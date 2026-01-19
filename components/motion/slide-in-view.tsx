'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';

interface SlideInViewProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Distance in pixels to slide from (default: 40) */
  offset?: number;
  /** Direction of slide: 'up' | 'down' | 'left' | 'right' (default: 'left') */
  direction?: 'up' | 'down' | 'left' | 'right';
  /** Animation duration in seconds (default: 0.6) */
  duration?: number;
  /** Trigger animation only once when entering viewport (default: true) */
  once?: boolean;
  /** Viewport margin for intersection observer (default: '-50px') */
  margin?: string;
  /** Whether to also fade in while sliding (default: true) */
  withFade?: boolean;
}

export function SlideInView({
  children,
  className = '',
  delay = 0,
  offset = 40,
  direction = 'left',
  duration = 0.6,
  once = true,
  margin = '-50px',
  withFade = true,
}: SlideInViewProps) {
  const prefersReducedMotion = useReducedMotion();

  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: offset };
      case 'down':
        return { y: -offset };
      case 'left':
        return { x: offset };
      case 'right':
        return { x: -offset };
      default:
        return { x: offset };
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
      default:
        return { x: 0 };
    }
  };

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{
        opacity: withFade ? 0 : 1,
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
