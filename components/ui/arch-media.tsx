'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ArchMediaProps {
  src: string;
  alt: string;
  className?: string;
  /** Aspect ratio - defaults to 3/4 (portrait) */
  aspect?: '3/4' | '4/5' | '2/3' | '1/1';
  /** Optional gradient overlay */
  gradient?: boolean;
  /** Gradient colors from the brand palette */
  gradientFrom?: string;
  gradientTo?: string;
}

/**
 * Arch-shaped media container
 * Creates the distinctive arch crop seen in elevated editorial layouts
 */
export function ArchMedia({
  src,
  alt,
  className,
  aspect = '3/4',
  gradient = false,
  gradientFrom = 'sun-coral',
  gradientTo = 'sun-gold',
}: ArchMediaProps) {
  const aspectClasses = {
    '3/4': 'aspect-[3/4]',
    '4/5': 'aspect-[4/5]',
    '2/3': 'aspect-[2/3]',
    '1/1': 'aspect-square',
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        'rounded-t-[999px] rounded-b-3xl',
        aspectClasses[aspect],
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
      />
      {gradient && (
        <div
          className={cn(
            'absolute inset-0',
            `bg-gradient-to-b from-${gradientFrom}/30 via-transparent to-${gradientTo}/40`,
            'mix-blend-overlay'
          )}
        />
      )}
    </div>
  );
}
