'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';

interface FadeInViewProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Distance in pixels to translate from (default: 20) */
  offset?: number;
  /** Direction of fade: 'up' | 'down' | 'left' | 'right' | 'none' (default: 'up') */
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  /** Animation duration in seconds (default: 0.6) */
  duration?: number;
  /** Trigger animation only once when entering viewport (default: true) */
  once?: boolean;
  /** Viewport margin for intersection observer (default: '-50px') */
  margin?: string;
}

export function FadeInView({
  children,
  className = '',
  delay = 0,
  offset = 20,
  direction = 'up',
  duration = 0.6,
  once = true,
  margin = '-50px',
}: FadeInViewProps) {
  const prefersReducedMotion = useReducedMotion();

  const getInitialPosition = () => {
    if (prefersReducedMotion) return {};

    switch (direction) {
      case 'up':
        return { y: offset };
      case 'down':
        return { y: -offset };
      case 'left':
        return { x: offset };
      case 'right':
        return { x: -offset };
      case 'none':
      default:
        return {};
    }
  };

  const getFinalPosition = () => {
    switch (direction) {
      case 'up':
      case 'down':
        return { y: 0 };
      case 'left':
      case 'right':
        return { x: 0 };
      case 'none':
      default:
        return {};
    }
  };

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        ...getInitialPosition(),
      }}
      whileInView={{
        opacity: 1,
        ...getFinalPosition(),
      }}
      viewport={{
        once,
        margin,
      }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1], // Soft cubic-bezier easing
      }}
    >
      {children}
    </motion.div>
  );
}
