import { Event } from './events';

export interface CalendarDay {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: Event[];
}

export interface CalendarMonth {
  year: number;
  month: number;
  days: CalendarDay[];
}

/**
 * Get the name of a month
 */
export function getMonthName(month: number): string {
  const date = new Date(2000, month, 1);
  return date.toLocaleDateString('en-US', { month: 'long' });
}

/**
 * Get short weekday names
 */
export function getWeekdayNames(): string[] {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
}

/**
 * Check if two dates are the same day
 */
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Get events for a specific date
 */
function getEventsForDate(date: Date, events: Event[]): Event[] {
  return events.filter((event) => {
    const eventDate = new Date(event.date);
    return isSameDay(date, eventDate);
  });
}

/**
 * Build a calendar month grid with event data
 */
export function getCalendarMonth(
  year: number,
  month: number,
  events: Event[]
): CalendarMonth {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // First day of the month
  const firstDay = new Date(year, month, 1);
  // Last day of the month
  const lastDay = new Date(year, month + 1, 0);

  // Start from the Sunday of the week containing the first day
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  // End on the Saturday of the week containing the last day
  const endDate = new Date(lastDay);
  endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

  const days: CalendarDay[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    days.push({
      date: new Date(currentDate),
      dayNumber: currentDate.getDate(),
      isCurrentMonth: currentDate.getMonth() === month,
      isToday: isSameDay(currentDate, today),
      events: getEventsForDate(currentDate, events),
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return { year, month, days };
}

/**
 * Navigate to previous or next month
 */
export function navigateMonth(
  year: number,
  month: number,
  direction: 'prev' | 'next'
): { year: number; month: number } {
  if (direction === 'prev') {
    if (month === 0) {
      return { year: year - 1, month: 11 };
    }
    return { year, month: month - 1 };
  } else {
    if (month === 11) {
      return { year: year + 1, month: 0 };
    }
    return { year, month: month + 1 };
  }
}

/**
 * Format a date for display
 */
export function formatCalendarDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}
