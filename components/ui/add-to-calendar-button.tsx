'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { crispEase } from '@/lib/animation-variants';
import { Event } from '@/lib/events';
import { addToCalendar, CalendarType } from '@/lib/ics';

interface AddToCalendarButtonProps {
  /** Event to add to calendar */
  event: Event;
  /** Visual variant based on event type */
  variant?: 'golden-hour' | 'lunar-room';
  /** Additional class names */
  className?: string;
}

const calendarOptions: { type: CalendarType; label: string; icon: string }[] = [
  { type: 'google', label: 'Google Calendar', icon: '📅' },
  { type: 'outlook', label: 'Outlook', icon: '📧' },
  { type: 'apple', label: 'Apple Calendar', icon: '🍎' },
  { type: 'yahoo', label: 'Yahoo Calendar', icon: '📆' },
];

/**
 * Dropdown button to add event to various calendar services
 */
export function AddToCalendarButton({
  event,
  variant = 'golden-hour',
  className,
}: AddToCalendarButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const variantStyles = {
    'golden-hour': {
      button: 'bg-sun-gold/10 text-sun-gold hover:bg-sun-gold/20 border-sun-gold/30',
      dropdown: 'bg-sun-paper border-sun-gold/30',
      item: 'hover:bg-sun-gold/10 text-sun-cocoa',
    },
    'lunar-room': {
      button: 'bg-sun-plum/10 text-sun-plum hover:bg-sun-plum/20 border-sun-plum/30',
      dropdown: 'bg-sun-paper border-sun-plum/30',
      item: 'hover:bg-sun-plum/10 text-sun-cocoa',
    },
  };

  const styles = variantStyles[variant];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSelect = (calendarType: CalendarType) => {
    addToCalendar(event, calendarType);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{
          duration: 0.2,
          ease: crispEase,
        }}
        className={cn(
          'inline-flex items-center justify-center gap-2',
          'w-full h-9 px-4',
          'rounded-lg border',
          'font-subhead text-sm font-medium tracking-wide',
          'transition-colors duration-200',
          'outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sun-plum',
          styles.button
        )}
      >
        <Calendar className="w-4 h-4" />
        <span>Add to Calendar</span>
        <ChevronDown
          className={cn(
            'w-4 h-4 ml-auto transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: crispEase }}
            className={cn(
              'absolute z-50 w-full mt-2',
              'rounded-lg border shadow-lg overflow-hidden',
              styles.dropdown
            )}
          >
            {calendarOptions.map((option) => (
              <button
                key={option.type}
                type="button"
                onClick={() => handleSelect(option.type)}
                className={cn(
                  'w-full px-4 py-2.5 text-left',
                  'flex items-center gap-3',
                  'font-body text-sm',
                  'transition-colors duration-150',
                  styles.item
                )}
              >
                <span className="text-base">{option.icon}</span>
                <span>{option.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
