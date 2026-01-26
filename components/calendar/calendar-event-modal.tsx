'use client';

import { MapPin, Clock, ArrowRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { CalendarDay, formatCalendarDate } from '@/lib/calendar';
import { Event } from '@/lib/events';

interface CalendarEventModalProps {
  day: CalendarDay | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal showing all events for a selected calendar day
 * Includes "Jump to Event" functionality
 */
export function CalendarEventModal({
  day,
  open,
  onOpenChange,
}: CalendarEventModalProps) {
  if (!day) return null;

  const handleJumpToEvent = (event: Event) => {
    onOpenChange(false);
    // Small delay to allow modal to close
    setTimeout(() => {
      const element = document.getElementById(`event-${event.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Add a brief highlight effect
        element.classList.add('ring-4', 'ring-sun-gold', 'ring-offset-2');
        setTimeout(() => {
          element.classList.remove('ring-4', 'ring-sun-gold', 'ring-offset-2');
        }, 2000);
      }
    }, 150);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-sun-paper">
        <DialogHeader>
          <DialogTitle className="font-headline text-xl uppercase text-sun-cocoa">
            Events on {formatCalendarDate(day.date)}
          </DialogTitle>
          <DialogDescription className="text-sun-cocoa/70">
            {day.events.length} event{day.events.length !== 1 ? 's' : ''} scheduled
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {day.events.map((event) => (
            <EventListItem
              key={event.id}
              event={event}
              onJump={() => handleJumpToEvent(event)}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface EventListItemProps {
  event: Event;
  onJump: () => void;
}

function EventListItem({ event, onJump }: EventListItemProps) {
  const typeStyles = {
    'golden-hour': {
      badge: 'bg-sun-gold/20 text-sun-gold border-sun-gold/30',
      accent: 'border-l-sun-gold',
    },
    'lunar-room': {
      badge: 'bg-sun-plum/20 text-sun-plum border-sun-plum/30',
      accent: 'border-l-sun-plum',
    },
  };

  const styles = typeStyles[event.type];

  return (
    <div
      className={cn(
        'p-4 rounded-lg bg-white border border-sun-sand',
        'border-l-4',
        styles.accent
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Type badge */}
          <span
            className={cn(
              'inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-2 border',
              styles.badge
            )}
          >
            {event.type === 'golden-hour' ? 'Golden Hour' : 'Lunar Room'}
          </span>

          {/* Title */}
          <h4 className="font-headline text-base uppercase text-sun-cocoa mb-2">
            {event.title}
          </h4>

          {/* Time & Location */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-sun-cocoa/70">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {event.time}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {event.location}
            </span>
          </div>
        </div>

        {/* Jump button */}
        <button
          type="button"
          onClick={onJump}
          className={cn(
            'flex items-center gap-1 px-3 py-1.5 rounded-lg',
            'text-sm font-medium',
            'bg-sun-gold/10 text-sun-gold hover:bg-sun-gold/20',
            'transition-colors duration-150'
          )}
        >
          <span className="hidden sm:inline">View</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
