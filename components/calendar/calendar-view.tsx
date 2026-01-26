'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { crispEase } from '@/lib/animation-variants';
import {
  getCalendarMonth,
  getMonthName,
  getWeekdayNames,
  navigateMonth,
  CalendarDay,
} from '@/lib/calendar';
import { Event } from '@/lib/events';
import { CalendarDayCell } from './calendar-day-cell';
import { CalendarEventModal } from './calendar-event-modal';

interface CalendarViewProps {
  events: Event[];
  className?: string;
}

/**
 * Monthly calendar grid showing event dates
 * Includes navigation and click-to-view functionality
 */
export function CalendarView({ events, className }: CalendarViewProps) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [direction, setDirection] = useState(0);
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const calendarMonth = useMemo(
    () => getCalendarMonth(year, month, events),
    [year, month, events]
  );

  const weekdays = getWeekdayNames();

  const handleNavigate = (dir: 'prev' | 'next') => {
    setDirection(dir === 'prev' ? -1 : 1);
    const { year: newYear, month: newMonth } = navigateMonth(year, month, dir);
    setYear(newYear);
    setMonth(newMonth);
  };

  const handleDayClick = (day: CalendarDay) => {
    setSelectedDay(day);
    setModalOpen(true);
  };

  // Animation variants for month transitions
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
    }),
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Header with navigation */}
      <div className="flex items-center justify-between mb-6">
        <motion.button
          type="button"
          onClick={() => handleNavigate('prev')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.15, ease: crispEase }}
          className={cn(
            'p-2 rounded-full',
            'bg-sun-gold/10 text-sun-gold hover:bg-sun-gold/20',
            'transition-colors duration-150'
          )}
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>

        <h3 className="font-headline text-xl uppercase text-sun-cocoa">
          {getMonthName(month)} {year}
        </h3>

        <motion.button
          type="button"
          onClick={() => handleNavigate('next')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.15, ease: crispEase }}
          className={cn(
            'p-2 rounded-full',
            'bg-sun-gold/10 text-sun-gold hover:bg-sun-gold/20',
            'transition-colors duration-150'
          )}
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdays.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-subhead uppercase tracking-wide text-sun-cocoa/60 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid with animation */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={`${year}-${month}`}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="grid grid-cols-7 gap-1"
        >
          {calendarMonth.days.map((day, index) => (
            <CalendarDayCell
              key={`${day.date.toISOString()}-${index}`}
              day={day}
              onClick={handleDayClick}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-6 text-xs text-sun-cocoa/70">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sun-gold" />
          Golden Hour
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sun-plum" />
          Lunar Room
        </span>
      </div>

      {/* Event modal */}
      <CalendarEventModal
        day={selectedDay}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}
