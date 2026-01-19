'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CTAButton } from '@/components/ui/cta-button';
import { crispEase } from '@/lib/animation-variants';

interface SMSSignupProps {
  /** Visual variant based on background color context */
  variant?: 'purple' | 'orange' | 'yellow' | 'white';
  /** Optional heading text */
  heading?: string;
  /** Optional description/microcopy */
  description?: string;
  /** Placeholder text for phone input */
  placeholder?: string;
  /** Submit button text */
  buttonText?: string;
  /** Success message after submission */
  successMessage?: string;
  /** Callback when form is submitted */
  onSubmit?: (phone: string) => Promise<void> | void;
  /** Additional class names */
  className?: string;
}

/**
 * SMS signup form with phone input and submit button
 *
 * Styled for brand consistency with smooth focus states
 * and clear success/error feedback. Designed for "love note"
 * style text communications (1-2 per week).
 */
export function SMSSignup({
  variant = 'white',
  heading,
  description,
  placeholder = 'Enter your phone number',
  buttonText = 'Get Love Notes',
  successMessage = 'Your first love note is on its way!',
  onSubmit,
  className,
}: SMSSignupProps) {
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Format phone number as user types (US format)
  const formatPhone = (value: string): string => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  // Validate phone number (basic US validation)
  const isValidPhone = (value: string): boolean => {
    const digits = value.replace(/\D/g, '');
    return digits.length === 10;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
    if (status === 'error') setStatus('idle');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!isValidPhone(phone)) {
      setStatus('error');
      setErrorMessage('Please enter a valid 10-digit phone number');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      if (onSubmit) {
        await onSubmit(phone);
      }
      setStatus('success');
      setPhone('');
    } catch {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  // Text colors based on background variant
  const textStyles = {
    purple: 'text-sunshine-white',
    orange: 'text-sunshine-white',
    yellow: 'text-sunshine-brown',
    white: 'text-sunshine-brown',
  };

  // Input styles based on variant for proper contrast
  const inputStyles = {
    purple: 'bg-sunshine-white/10 border-sunshine-white/30 text-sunshine-white placeholder:text-sunshine-white/60 focus:border-sunshine-yellow focus:ring-sunshine-yellow/30',
    orange: 'bg-sunshine-white/10 border-sunshine-white/30 text-sunshine-white placeholder:text-sunshine-white/60 focus:border-sunshine-yellow focus:ring-sunshine-yellow/30',
    yellow: 'bg-sunshine-white border-sunshine-brown/20 text-sunshine-brown placeholder:text-sunshine-brown/50 focus:border-sunshine-purple focus:ring-sunshine-purple/30',
    white: 'bg-sunshine-white border-sunshine-brown/20 text-sunshine-brown placeholder:text-sunshine-brown/50 focus:border-sunshine-purple focus:ring-sunshine-purple/30',
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
            ? 'text-sunshine-white/80'
            : 'text-sunshine-brown/70'
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
            <label htmlFor="sms-phone" className="sr-only">
              Phone number
            </label>
            <input
              id="sms-phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              value={phone}
              onChange={handlePhoneChange}
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
              aria-describedby={status === 'error' ? 'sms-error' : 'sms-privacy'}
            />
            {status === 'error' && errorMessage && (
              <motion.p
                id="sms-error"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  'mt-2 text-sm font-body',
                  variant === 'purple' || variant === 'orange'
                    ? 'text-sunshine-yellow'
                    : 'text-sunshine-orange'
                )}
                role="alert"
              >
                {errorMessage}
              </motion.p>
            )}
            <p
              id="sms-privacy"
              className={cn(
                'mt-2 text-xs font-body',
                variant === 'purple' || variant === 'orange'
                  ? 'text-sunshine-white/60'
                  : 'text-sunshine-brown/50'
              )}
            >
              Expect 1-2 gentle check-ins per week. Unsubscribe anytime.
            </p>
          </div>

          <CTAButton
            type="submit"
            variant={buttonVariant}
            disabled={status === 'loading'}
            className="sm:flex-shrink-0 sm:self-start"
          >
            {status === 'loading' ? 'Joining...' : buttonText}
          </CTAButton>
        </form>
      )}
    </div>
  );
}
