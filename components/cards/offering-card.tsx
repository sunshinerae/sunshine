'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { crispEase } from '@/lib/animation-variants';
import { CTAButton } from '@/components/ui/cta-button';

export interface OfferingCardProps {
  /** Offering title */
  title: string;
  /** Offering description */
  description: string;
  /** Icon component or element to display */
  icon?: React.ReactNode;
  /** Visual variant determines color styling */
  variant?: 'purple' | 'orange' | 'yellow' | 'white';
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
 * Offering display card with icon placeholder, title, description, and CTA
 *
 * Visual variants:
 * - purple: Power Purple background with White Cloud text
 * - orange: Molten Orange background with White Cloud text
 * - yellow: Yellow Sun background with Deep Brown text
 * - white: White Cloud background with Deep Brown text
 */
export function OfferingCard({
  title,
  description,
  icon,
  variant = 'purple',
  ctaText = 'Learn More',
  ctaHref,
  onCtaClick,
  className,
}: OfferingCardProps) {
  // Variant-based styling per brand spec contrast rules
  const variantStyles = {
    purple: {
      card: 'bg-sunshine-purple',
      icon: 'bg-sunshine-yellow/20 text-sunshine-yellow',
      title: 'text-sunshine-white',
      description: 'text-sunshine-white/90',
      ctaVariant: 'purple' as const,
    },
    orange: {
      card: 'bg-sunshine-orange',
      icon: 'bg-sunshine-yellow/20 text-sunshine-yellow',
      title: 'text-sunshine-white',
      description: 'text-sunshine-white/90',
      ctaVariant: 'orange' as const,
    },
    yellow: {
      card: 'bg-sunshine-yellow',
      icon: 'bg-sunshine-purple/20 text-sunshine-purple',
      title: 'text-sunshine-brown',
      description: 'text-sunshine-brown/80',
      ctaVariant: 'yellow' as const,
    },
    white: {
      card: 'bg-sunshine-white',
      icon: 'bg-sunshine-purple/10 text-sunshine-purple',
      title: 'text-sunshine-brown',
      description: 'text-sunshine-brown/80',
      ctaVariant: 'white' as const,
    },
  };

  const styles = variantStyles[variant];

  // Default icon placeholder (simple circle with inner shape)
  const defaultIcon = (
    <svg
      className="w-8 h-8"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="2" />
      <circle cx="16" cy="16" r="4" fill="currentColor" />
    </svg>
  );

  return (
    <motion.article
      initial={{ y: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
      whileHover={{
        y: -4,
        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
      }}
      transition={{
        duration: 0.3,
        ease: crispEase,
      }}
      className={cn(
        'rounded-2xl overflow-hidden flex flex-col p-6',
        styles.card,
        className
      )}
    >
      {/* Icon placeholder */}
      <div
        className={cn(
          'w-14 h-14 rounded-full flex items-center justify-center mb-5',
          styles.icon
        )}
      >
        {icon || defaultIcon}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-3">
        <h3
          className={cn(
            'font-headline text-xl uppercase tracking-wide',
            styles.title
          )}
        >
          {title}
        </h3>

        <p
          className={cn(
            'font-body text-base leading-relaxed',
            styles.description
          )}
        >
          {description}
        </p>
      </div>

      {/* CTA */}
      <div className="mt-6">
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
