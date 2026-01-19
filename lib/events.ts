import eventsData from '@/data/events.json';

// Types
export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  type: 'golden-hour' | 'lunar-room';
  image: string;
  location: string;
  capacity: number;
  price: string;
}

export type EventType = 'golden-hour' | 'lunar-room';

// Constants
export const EVENT_TYPES: Record<EventType, { name: string; description: string }> = {
  'golden-hour': {
    name: 'Golden Hour',
    description: 'Warm, energizing gatherings during the magic hour',
  },
  'lunar-room': {
    name: 'Lunar Room',
    description: 'Restorative, reflective experiences under the moon',
  },
};

/**
 * Get all events
 */
export function getAllEvents(): Event[] {
  return eventsData.events as Event[];
}

/**
 * Get events filtered by type
 */
export function getEventsByType(type: EventType): Event[] {
  return getAllEvents().filter((event) => event.type === type);
}

/**
 * Get Golden Hour events
 */
export function getGoldenHourEvents(): Event[] {
  return getEventsByType('golden-hour');
}

/**
 * Get Lunar Room events
 */
export function getLunarRoomEvents(): Event[] {
  return getEventsByType('lunar-room');
}

/**
 * Get a single event by ID
 */
export function getEventById(id: string): Event | undefined {
  return getAllEvents().find((event) => event.id === id);
}

/**
 * Get upcoming events (events with dates in the future)
 */
export function getUpcomingEvents(): Event[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return getAllEvents()
    .filter((event) => new Date(event.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

/**
 * Get upcoming events filtered by type
 */
export function getUpcomingEventsByType(type: EventType): Event[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return getEventsByType(type)
    .filter((event) => new Date(event.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

/**
 * Get the next upcoming event
 */
export function getNextEvent(): Event | undefined {
  const upcoming = getUpcomingEvents();
  return upcoming[0];
}

/**
 * Get the next upcoming event by type
 */
export function getNextEventByType(type: EventType): Event | undefined {
  const upcoming = getUpcomingEventsByType(type);
  return upcoming[0];
}

/**
 * Format event date for display
 */
export function formatEventDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format event date in short form
 */
export function formatEventDateShort(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Check if an event is sold out (capacity = 0 would indicate this)
 */
export function isEventSoldOut(event: Event): boolean {
  return event.capacity === 0;
}

/**
 * Check if an event is free
 */
export function isEventFree(event: Event): boolean {
  return event.price.toLowerCase() === 'free';
}

/**
 * Get all unique event locations
 */
export function getAllLocations(): string[] {
  const locations = getAllEvents().map((event) => event.location);
  return [...new Set(locations)];
}

/**
 * Get events by location
 */
export function getEventsByLocation(location: string): Event[] {
  return getAllEvents().filter((event) => event.location === location);
}
