'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CTAButton } from '@/components/ui/cta-button';
import { crispEase } from '@/lib/animation-variants';

interface ContactFormProps {
  /** Visual variant based on background color context */
  variant?: 'purple' | 'orange' | 'yellow' | 'white';
  /** Optional heading text */
  heading?: string;
  /** Optional description/microcopy */
  description?: string;
  /** Submit button text */
  buttonText?: string;
  /** Success message after submission */
  successMessage?: string;
  /** Callback when form is submitted */
  onSubmit?: (data: ContactFormData) => Promise<void> | void;
  /** Additional class names */
  className?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Contact form with name, email, subject, and message fields
 *
 * Styled for brand consistency with smooth focus states
 * and clear success/error feedback. Welcoming tone with
 * microcopy that reduces anxiety about reaching out.
 */
export function ContactForm({
  variant = 'white',
  heading,
  description,
  buttonText = 'Send Message',
  successMessage = "Thank you for reaching out! We'll get back to you soon.",
  onSubmit,
  className,
}: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ContactFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email';
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Please enter a subject';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please enter your message';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrors({});

    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
      setErrors({ message: 'Something went wrong. Please try again.' });
    }
  };

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (status === 'error') setStatus('idle');
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

  // Label styles based on variant
  const labelStyles = {
    purple: 'text-sunshine-white/90',
    orange: 'text-sunshine-white/90',
    yellow: 'text-sunshine-brown/80',
    white: 'text-sunshine-brown/80',
  };

  // Error styles based on variant
  const errorStyles = {
    purple: 'text-sunshine-yellow',
    orange: 'text-sunshine-yellow',
    yellow: 'text-sunshine-orange',
    white: 'text-sunshine-orange',
  };

  const inputBaseClasses = cn(
    'w-full px-4 py-3 rounded-2xl',
    'font-body text-sm',
    'border-2 outline-none',
    'transition-all duration-200',
    'focus:ring-2 focus:ring-offset-0',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    inputStyles[variant]
  );

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
          'font-body text-sm mb-6 leading-relaxed',
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
            'font-body text-base py-6 text-center',
            textStyles[variant]
          )}
        >
          {successMessage}
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label
              htmlFor="contact-name"
              className={cn('block font-body text-sm font-medium mb-1.5', labelStyles[variant])}
            >
              Name
            </label>
            <input
              id="contact-name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Your name"
              disabled={status === 'loading'}
              className={inputBaseClasses}
              aria-describedby={errors.name ? 'contact-name-error' : undefined}
            />
            {errors.name && (
              <motion.p
                id="contact-name-error"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn('mt-1.5 text-sm font-body', errorStyles[variant])}
                role="alert"
              >
                {errors.name}
              </motion.p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="contact-email"
              className={cn('block font-body text-sm font-medium mb-1.5', labelStyles[variant])}
            >
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="your@email.com"
              disabled={status === 'loading'}
              className={inputBaseClasses}
              aria-describedby={errors.email ? 'contact-email-error' : undefined}
            />
            {errors.email && (
              <motion.p
                id="contact-email-error"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn('mt-1.5 text-sm font-body', errorStyles[variant])}
                role="alert"
              >
                {errors.email}
              </motion.p>
            )}
          </div>

          {/* Subject Field */}
          <div>
            <label
              htmlFor="contact-subject"
              className={cn('block font-body text-sm font-medium mb-1.5', labelStyles[variant])}
            >
              Subject
            </label>
            <input
              id="contact-subject"
              type="text"
              value={formData.subject}
              onChange={(e) => handleChange('subject', e.target.value)}
              placeholder="What's on your mind?"
              disabled={status === 'loading'}
              className={inputBaseClasses}
              aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
            />
            {errors.subject && (
              <motion.p
                id="contact-subject-error"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn('mt-1.5 text-sm font-body', errorStyles[variant])}
                role="alert"
              >
                {errors.subject}
              </motion.p>
            )}
          </div>

          {/* Message Field */}
          <div>
            <label
              htmlFor="contact-message"
              className={cn('block font-body text-sm font-medium mb-1.5', labelStyles[variant])}
            >
              Message
            </label>
            <textarea
              id="contact-message"
              value={formData.message}
              onChange={(e) => handleChange('message', e.target.value)}
              placeholder="Share what's on your heart..."
              disabled={status === 'loading'}
              rows={5}
              className={cn(inputBaseClasses, 'resize-none')}
              aria-describedby={errors.message ? 'contact-message-error' : undefined}
            />
            {errors.message && (
              <motion.p
                id="contact-message-error"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn('mt-1.5 text-sm font-body', errorStyles[variant])}
                role="alert"
              >
                {errors.message}
              </motion.p>
            )}
          </div>

          {/* Microcopy */}
          <p className={cn(
            'text-xs font-body',
            variant === 'purple' || variant === 'orange'
              ? 'text-sunshine-white/60'
              : 'text-sunshine-brown/50'
          )}>
            This is a judgment-free space. We typically respond within 24-48 hours.
          </p>

          {/* Submit Button */}
          <div className="pt-2">
            <CTAButton
              type="submit"
              variant={variant}
              disabled={status === 'loading'}
              className="w-full sm:w-auto"
            >
              {status === 'loading' ? 'Sending...' : buttonText}
            </CTAButton>
          </div>
        </form>
      )}
    </div>
  );
}
