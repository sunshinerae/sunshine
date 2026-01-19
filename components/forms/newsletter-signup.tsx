'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CTAButton } from '@/components/ui/cta-button';
import { crispEase } from '@/lib/animation-variants';

interface NewsletterSignupProps {
  /** Visual variant based on background color context */
  variant?: 'purple' | 'orange' | 'yellow' | 'white';
  /** Optional heading text */
  heading?: string;
  /** Optional description/microcopy */
  description?: string;
  /** Placeholder text for email input */
  placeholder?: string;
  /** Submit button text */
  buttonText?: string;
  /** Success message after submission */
  successMessage?: string;
  /** Callback when form is submitted */
  onSubmit?: (email: string) => Promise<void> | void;
  /** Additional class names */
  className?: string;
}

/**
 * Newsletter signup form with email input and submit button
 *
 * Styled for brand consistency with smooth focus states
 * and clear success/error feedback
 */
export function NewsletterSignup({
  variant = 'white',
  heading,
  description,
  placeholder = 'Enter your email',
  buttonText = 'Join The List',
  successMessage = 'Welcome to the community!',
  onSubmit,
  className,
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      if (onSubmit) {
        await onSubmit(email);
      }
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  // Text colors based on background variant
  const textStyles = {
    purple: 'text-sun-cream',
    orange: 'text-sun-cream',
    yellow: 'text-sun-cocoa',
    white: 'text-sun-cocoa',
  };

  // Input styles based on variant for proper contrast
  const inputStyles = {
    purple: 'bg-sun-cream/10 border-sun-cream/30 text-sun-cream placeholder:text-sun-cream/60 focus:border-sun-gold focus:ring-sun-gold/30',
    orange: 'bg-sun-cream/10 border-sun-cream/30 text-sun-cream placeholder:text-sun-cream/60 focus:border-sun-gold focus:ring-sun-gold/30',
    yellow: 'bg-sun-paper border-sun-sand text-sun-cocoa placeholder:text-sun-cocoa/50 focus:border-sun-plum focus:ring-sun-plum/30',
    white: 'bg-sun-paper border-sun-sand text-sun-cocoa placeholder:text-sun-cocoa/50 focus:border-sun-plum focus:ring-sun-plum/30',
  };

  // Button variant mapping
  const buttonVariant = variant;

  return (
    <div className={cn('w-full', className)}>
      {heading && (
        <h3 className={cn(
          'font-headline text-xl uppercase tracking-wide mb-2',
          textStyles[variant]
        )}>
          {heading}
        </h3>
      )}

      {description && (
        <p className={cn(
          'font-body text-sm mb-4 leading-relaxed',
          variant === 'purple' || variant === 'orange'
            ? 'text-sun-cream/80'
            : 'text-sun-cocoa/70'
        )}>
          {description}
        </p>
      )}

      {status === 'success' ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: crispEase }}
          className={cn(
            'font-body text-base py-3',
            textStyles[variant]
          )}
        >
          {successMessage}
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === 'error') setStatus('idle');
              }}
              placeholder={placeholder}
              disabled={status === 'loading'}
              className={cn(
                'w-full h-11 px-4 rounded-full',
                'font-body text-sm',
                'border-2 outline-none',
                'transition-all duration-200',
                'focus:ring-2 focus:ring-offset-0',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                inputStyles[variant]
              )}
              aria-describedby={status === 'error' ? 'newsletter-error' : undefined}
            />
            {status === 'error' && errorMessage && (
              <motion.p
                id="newsletter-error"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  'mt-2 text-sm font-body',
                  variant === 'purple' || variant === 'orange'
                    ? 'text-sun-gold'
                    : 'text-sun-coral'
                )}
                role="alert"
              >
                {errorMessage}
              </motion.p>
            )}
          </div>

          <CTAButton
            type="submit"
            variant={buttonVariant}
            disabled={status === 'loading'}
            className="sm:flex-shrink-0"
          >
            {status === 'loading' ? 'Joining...' : buttonText}
          </CTAButton>
        </form>
      )}
    </div>
  );
}
