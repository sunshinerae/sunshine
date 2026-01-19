'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { crispEase } from '@/lib/animation-variants';

interface CTAButtonProps {
  /** Button text */
  children: React.ReactNode;
  /** Visual variant based on background color context */
  variant?: 'purple' | 'orange' | 'yellow' | 'white';
  /** Button size */
  size?: 'default' | 'lg';
  /** Optional href for link buttons */
  href?: string;
  /** Click handler */
  onClick?: () => void;
  /** Button type */
  type?: 'button' | 'submit';
  /** Disabled state */
  disabled?: boolean;
  /** Additional class names */
  className?: string;
}

/**
 * Brand CTA Button with hover scale effect
 *
 * Variants determine color scheme based on background:
 * - purple: For use on purple backgrounds (Blue Sky or Yellow Sun button)
 * - orange: For use on orange backgrounds (Blue Sky or Yellow Sun button)
 * - yellow: For use on yellow backgrounds (Purple or Orange button, never white text)
 * - white: For use on white backgrounds (Purple or Orange button)
 */
export function CTAButton({
  children,
  variant = 'white',
  size = 'default',
  href,
  onClick,
  type = 'button',
  disabled = false,
  className,
}: CTAButtonProps) {
  const variantStyles = {
    purple: 'bg-sun-gold text-sun-cocoa hover:bg-sun-gold/90',
    orange: 'bg-sun-gold text-sun-cocoa hover:bg-sun-gold/90',
    yellow: 'bg-sun-plum text-white hover:bg-sun-plum/90',
    white: 'bg-sun-plum text-white hover:bg-sun-plum/90',
  };

  const sizeStyles = {
    default: 'h-11 px-6 text-sm',
    lg: 'h-12 px-8 text-base',
  };

  const baseStyles = cn(
    'inline-flex items-center justify-center',
    'rounded-[14px] font-subhead font-semibold tracking-wide',
    'transition-colors duration-200',
    'outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sun-plum',
    'disabled:pointer-events-none disabled:opacity-50',
    variantStyles[variant],
    sizeStyles[size],
    className
  );

  const motionProps = {
    initial: { scale: 1 },
    whileHover: disabled ? {} : { scale: 1.05 },
    whileTap: disabled ? {} : { scale: 0.98 },
    transition: {
      duration: 0.3,
      ease: crispEase,
    },
  };

  if (href && !disabled) {
    return (
      <motion.a
        href={href}
        className={baseStyles}
        {...motionProps}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseStyles}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
}
