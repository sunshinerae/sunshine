'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { crispEase } from '@/lib/animation-variants';
import { CalendarDay } from '@/lib/calendar';

interface CalendarDayCellProps {
  day: CalendarDay;
  onClick?: (day: CalendarDay) => void;
}

/**
 * Individual day cell in the calendar grid
 * Shows day number and color-coded dots for events
 */
export function CalendarDayCell({ day, onClick }: CalendarDayCellProps) {
  const hasEvents = day.events.length > 0;

  // Group events by type for color-coded dots
  const hasGoldenHour = day.events.some((e) => e.type === 'golden-hour');
  const hasLunarRoom = day.events.some((e) => e.type === 'lunar-room');

  const handleClick = () => {
    if (hasEvents && onClick) {
      onClick(day);
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      disabled={!hasEvents}
      whileHover={hasEvents ? { scale: 1.1 } : {}}
      whileTap={hasEvents ? { scale: 0.95 } : {}}
      transition={{ duration: 0.15, ease: crispEase }}
      className={cn(
        'relative flex flex-col items-center justify-center',
        'w-full aspect-square p-1',
        'rounded-lg transition-colors duration-150',
        !day.isCurrentMonth && 'opacity-30',
        day.isToday && 'ring-2 ring-sun-coral ring-offset-1',
        hasEvents && 'cursor-pointer hover:bg-sun-gold/10',
        !hasEvents && 'cursor-default'
      )}
    >
      {/* Day number */}
      <span
        className={cn(
          'text-sm font-body',
          day.isCurrentMonth ? 'text-sun-cocoa' : 'text-sun-cocoa/50',
          day.isToday && 'font-bold text-sun-coral'
        )}
      >
        {day.dayNumber}
      </span>

      {/* Event dots */}
      {hasEvents && (
        <div className="flex gap-0.5 mt-0.5">
          {hasGoldenHour && (
            <span className="w-1.5 h-1.5 rounded-full bg-sun-gold" />
          )}
          {hasLunarRoom && (
            <span className="w-1.5 h-1.5 rounded-full bg-sun-plum" />
          )}
        </div>
      )}
    </motion.button>
  );
}
