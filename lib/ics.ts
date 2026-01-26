import { Event } from './events';

export type CalendarType = 'google' | 'outlook' | 'apple' | 'yahoo';

/**
 * Parse time range string like "5:00 PM - 8:00 PM" into start and end Date objects
 */
export function parseTimeRange(
  dateStr: string,
  timeStr: string
): { start: Date; end: Date } {
  const date = new Date(dateStr);

  // Parse time range like "5:00 PM - 8:00 PM"
  const timeMatch = timeStr.match(
    /(\d{1,2}):(\d{2})\s*(AM|PM)\s*-\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i
  );

  if (!timeMatch) {
    // Default to all-day event if parsing fails
    const start = new Date(date);
    start.setHours(9, 0, 0, 0);
    const end = new Date(date);
    end.setHours(17, 0, 0, 0);
    return { start, end };
  }

  const [, startHour, startMin, startPeriod, endHour, endMin, endPeriod] = timeMatch;

  // Convert to 24-hour format
  const convertTo24Hour = (hour: string, period: string): number => {
    let h = parseInt(hour, 10);
    if (period.toUpperCase() === 'PM' && h !== 12) h += 12;
    if (period.toUpperCase() === 'AM' && h === 12) h = 0;
    return h;
  };

  const start = new Date(date);
  start.setHours(
    convertTo24Hour(startHour, startPeriod),
    parseInt(startMin, 10),
    0,
    0
  );

  const end = new Date(date);
  end.setHours(
    convertTo24Hour(endHour, endPeriod),
    parseInt(endMin, 10),
    0,
    0
  );

  return { start, end };
}

/**
 * Format a Date to ICS datetime format (UTC)
 */
function formatICSDate(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    date.getUTCFullYear().toString() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    'T' +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    'Z'
  );
}

/**
 * Generate a unique ID for the event
 */
function generateUID(event: Event): string {
  return `${event.id}-${Date.now()}@sunshineeffect.com`;
}

/**
 * Escape special characters for ICS text fields
 */
function escapeICSText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

/**
 * Generate valid ICS file content for an event
 */
export function generateICS(event: Event): string {
  const { start, end } = parseTimeRange(event.date, event.time);
  const now = new Date();

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//The Sunshine Effect//Events//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${generateUID(event)}`,
    `DTSTAMP:${formatICSDate(now)}`,
    `DTSTART:${formatICSDate(start)}`,
    `DTEND:${formatICSDate(end)}`,
    `SUMMARY:${escapeICSText(event.title)}`,
    `DESCRIPTION:${escapeICSText(event.description)}`,
    `LOCATION:${escapeICSText(event.location)}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  return lines.join('\r\n');
}

/**
 * Trigger browser download of ICS file
 */
export function downloadICS(event: Event): void {
  const icsContent = generateICS(event);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${event.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Format date for Google Calendar URL (YYYYMMDDTHHmmssZ)
 */
function formatGoogleDate(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return (
    date.getUTCFullYear().toString() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    'T' +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    'Z'
  );
}

/**
 * Format date for Outlook URL (ISO format)
 */
function formatOutlookDate(date: Date): string {
  return date.toISOString();
}

/**
 * Generate Google Calendar URL
 */
export function getGoogleCalendarUrl(event: Event): string {
  const { start, end } = parseTimeRange(event.date, event.time);

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${formatGoogleDate(start)}/${formatGoogleDate(end)}`,
    details: event.description,
    location: event.location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generate Outlook Web Calendar URL
 */
export function getOutlookCalendarUrl(event: Event): string {
  const { start, end } = parseTimeRange(event.date, event.time);

  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: event.title,
    startdt: formatOutlookDate(start),
    enddt: formatOutlookDate(end),
    body: event.description,
    location: event.location,
  });

  return `https://outlook.live.com/calendar/0/action/compose?${params.toString()}`;
}

/**
 * Generate Yahoo Calendar URL
 */
export function getYahooCalendarUrl(event: Event): string {
  const { start, end } = parseTimeRange(event.date, event.time);

  // Yahoo uses duration in HHmm format
  const durationMs = end.getTime() - start.getTime();
  const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
  const durationMins = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  const duration = `${durationHours.toString().padStart(2, '0')}${durationMins.toString().padStart(2, '0')}`;

  const params = new URLSearchParams({
    v: '60',
    title: event.title,
    st: formatGoogleDate(start),
    dur: duration,
    desc: event.description,
    in_loc: event.location,
  });

  return `https://calendar.yahoo.com/?${params.toString()}`;
}

/**
 * Open calendar based on type
 */
export function addToCalendar(event: Event, calendarType: CalendarType): void {
  switch (calendarType) {
    case 'google':
      window.open(getGoogleCalendarUrl(event), '_blank');
      break;
    case 'outlook':
      window.open(getOutlookCalendarUrl(event), '_blank');
      break;
    case 'yahoo':
      window.open(getYahooCalendarUrl(event), '_blank');
      break;
    case 'apple':
    default:
      downloadICS(event);
      break;
  }
}
