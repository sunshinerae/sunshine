'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { crispEase } from '@/lib/animation-variants';

interface TestimonialCardProps {
  /** The testimonial quote text */
  quote: string;
  /** Name of the person (format: "First L.") */
  name: string;
  /** Descriptor like "retreat guest" or "coaching client" */
  descriptor: string;
  /** Visual variant for the card */
  variant?: 'purple' | 'orange' | 'white';
  /** Additional class names */
  className?: string;
}

export function TestimonialCard({
  quote,
  name,
  descriptor,
  variant = 'white',
  className,
}: TestimonialCardProps) {
  const variantStyles = {
    purple: 'bg-sunshine-purple text-sunshine-white',
    orange: 'bg-sunshine-orange text-sunshine-white',
    white: 'bg-sunshine-white text-sunshine-brown',
  };

  const quoteMarkColor = {
    purple: 'text-sunshine-yellow',
    orange: 'text-sunshine-yellow',
    white: 'text-sunshine-purple',
  };

  return (
    <motion.blockquote
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
        'rounded-2xl p-8 flex flex-col gap-6',
        variantStyles[variant],
        className
      )}
    >
      <span
        className={cn(
          'font-headline text-5xl leading-none select-none',
          quoteMarkColor[variant]
        )}
        aria-hidden="true"
      >
        "
      </span>

      <p className="font-body text-lg leading-relaxed -mt-4">{quote}</p>

      <footer className="mt-auto">
        <cite className="not-italic">
          <span className="font-subhead text-base block">{name}</span>
          <span
            className={cn(
              'font-body text-sm',
              variant === 'white' ? 'text-sunshine-purple/70' : 'text-sunshine-white/80'
            )}
          >
            {descriptor}
          </span>
        </cite>
      </footer>
    </motion.blockquote>
  );
}
