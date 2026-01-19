'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';

interface ScaleInProps {
  children: ReactNode;
  className?: string;
  /** Delay before animation starts in seconds (default: 0) */
  delay?: number;
  /** Initial scale value (default: 0.9) */
  initialScale?: number;
  /** Animation duration in seconds (default: 0.3 for crisp motion) */
  duration?: number;
  /** Trigger animation only once when entering viewport (default: true) */
  once?: boolean;
  /** Viewport margin for intersection observer (default: '-50px') */
  margin?: string;
  /** Include subtle fade with scale (default: true) */
  withFade?: boolean;
  /** Initial opacity when withFade is true (default: 0) */
  initialOpacity?: number;
}

export function ScaleIn({
  children,
  className = '',
  delay = 0,
  initialScale = 0.9,
  duration = 0.3,
  once = true,
  margin = '-50px',
  withFade = true,
  initialOpacity = 0,
}: ScaleInProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{
        scale: initialScale,
        ...(withFade && { opacity: initialOpacity }),
      }}
      whileInView={{
        scale: 1,
        ...(withFade && { opacity: 1 }),
      }}
      viewport={{
        once,
        margin,
      }}
      transition={{
        duration,
        delay,
        ease: [0.4, 0, 0.2, 1], // Crisp cubic-bezier easing for CTAs and buttons
      }}
    >
      {children}
    </motion.div>
  );
}

interface ScaleOnHoverProps {
  children: ReactNode;
  className?: string;
  /** Scale value on hover (default: 1.05) */
  hoverScale?: number;
  /** Scale value when pressed/tapped (default: 0.98) */
  tapScale?: number;
  /** Animation duration in seconds (default: 0.2) */
  duration?: number;
}

export function ScaleOnHover({
  children,
  className = '',
  hoverScale = 1.05,
  tapScale = 0.98,
  duration = 0.2,
}: ScaleOnHoverProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      whileHover={{
        scale: hoverScale,
      }}
      whileTap={{
        scale: tapScale,
      }}
      transition={{
        duration,
        ease: [0.4, 0, 0.2, 1], // Crisp cubic-bezier easing
      }}
    >
      {children}
    </motion.div>
  );
}
