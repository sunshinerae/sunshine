'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { crispEase } from '@/lib/animation-variants';
import { CTAButton } from '@/components/ui/cta-button';

export interface EventCardProps {
  /** Event title */
  title: string;
  /** Event date (ISO string or formatted string) */
  date: string;
  /** Event time range */
  time?: string;
  /** Event description */
  description: string;
  /** Event type determines visual styling */
  type: 'golden-hour' | 'lunar-room';
  /** Event location */
  location?: string;
  /** CTA text */
  ctaText?: string;
  /** CTA link */
  ctaHref?: string;
  /** Click handler for CTA */
  onCtaClick?: () => void;
  /** Additional class names */
  className?: string;
}

/**
 * Event display card with date, title, description, and CTA
 *
 * Visual styling based on event type:
 * - golden-hour: Warm palette (orange/yellow), sun-drenched energy
 * - lunar-room: Cool/dark palette (purple/blue), calm introspective vibe
 */
export function EventCard({
  title,
  date,
  time,
  description,
  type,
  location,
  ctaText = 'RSVP',
  ctaHref,
  onCtaClick,
  className,
}: EventCardProps) {
  // Format date for display
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  // Type-based styling per brand spec
  const typeStyles = {
    'golden-hour': {
      card: 'bg-sun-paper border border-sun-sand',
      dateBox: 'bg-sun-gold text-sun-cocoa',
      title: 'text-sun-cocoa',
      description: 'text-sun-cocoa/80',
      location: 'text-sun-plum',
      time: 'text-sun-cocoa/70',
      ctaVariant: 'white' as const,
    },
    'lunar-room': {
      card: 'bg-sun-paper border border-sun-sand',
      dateBox: 'bg-sun-plum text-white',
      title: 'text-sun-cocoa',
      description: 'text-sun-cocoa/80',
      location: 'text-sun-plum',
      time: 'text-sun-cocoa/70',
      ctaVariant: 'white' as const,
    },
  };

  const styles = typeStyles[type];

  return (
    <motion.article
      initial={{ y: 0 }}
      whileHover={{
        y: -4,
      }}
      transition={{
        duration: 0.3,
        ease: crispEase,
      }}
      className={cn(
        'rounded-xl overflow-hidden flex flex-col shadow-soft',
        styles.card,
        className
      )}
    >
      {/* Date badge */}
      <div className="p-6 pb-4">
        <div
          className={cn(
            'inline-flex items-center px-4 py-2 rounded-full font-subhead text-sm font-semibold tracking-wide',
            styles.dateBox
          )}
        >
          {formatDate(date)}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-4 flex-1 flex flex-col gap-3">
        <h3
          className={cn(
            'font-headline text-xl uppercase tracking-wide',
            styles.title
          )}
        >
          {title}
        </h3>

        {(time || location) && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {time && (
              <span className={cn('font-body text-sm', styles.time)}>
                {time}
              </span>
            )}
            {time && location && (
              <span className={cn('text-sm', styles.time)} aria-hidden="true">
                ·
              </span>
            )}
            {location && (
              <span className={cn('font-body text-sm font-medium', styles.location)}>
                {location}
              </span>
            )}
          </div>
        )}

        <p className={cn('font-body text-base leading-relaxed', styles.description)}>
          {description}
        </p>
      </div>

      {/* CTA */}
      <div className="p-6 pt-2 mt-auto">
        <CTAButton
          variant={styles.ctaVariant}
          href={ctaHref}
          onClick={onCtaClick}
          className="w-full"
        >
          {ctaText}
        </CTAButton>
      </div>
    </motion.article>
  );
}
