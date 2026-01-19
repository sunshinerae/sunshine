'use client';

import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  /** The main title text (uses font-headline, uppercase) */
  title: string;
  /** Optional subtitle text (uses font-body) */
  subtitle?: string;
  /** Alignment of the heading */
  align?: 'left' | 'center';
  /** Visual variant based on background color */
  variant?: 'purple' | 'orange' | 'yellow' | 'white';
  /** Additional class names */
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  align = 'center',
  variant = 'white',
  className,
}: SectionHeadingProps) {
  const titleColors = {
    purple: 'text-sun-cream',
    orange: 'text-sun-cream',
    yellow: 'text-sun-cocoa',
    white: 'text-sun-cocoa',
  };

  const subtitleColors = {
    purple: 'text-sun-cream/90',
    orange: 'text-sun-cream/90',
    yellow: 'text-sun-plum',
    white: 'text-sun-plum',
  };

  const alignStyles = {
    left: 'text-left',
    center: 'text-center',
  };

  return (
    <header className={cn('space-y-4', alignStyles[align], className)}>
      <h2
        className={cn(
          'font-headline text-3xl md:text-4xl lg:text-5xl uppercase tracking-wide leading-tight',
          titleColors[variant]
        )}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className={cn(
            'font-body text-lg md:text-xl leading-relaxed max-w-2xl',
            align === 'center' && 'mx-auto',
            subtitleColors[variant]
          )}
        >
          {subtitle}
        </p>
      )}
    </header>
  );
}
