'use client';

import { motion, useReducedMotion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

interface StaggerChildrenProps {
  children: ReactNode;
  className?: string;
  /** Delay before animation starts in seconds (default: 0) */
  delay?: number;
  /** Stagger delay between children in seconds (default: 0.1) */
  staggerDelay?: number;
  /** Animation duration for each child in seconds (default: 0.3 for crisp motion) */
  duration?: number;
  /** Trigger animation only once when entering viewport (default: true) */
  once?: boolean;
  /** Viewport margin for intersection observer (default: '-50px') */
  margin?: string;
  /** Distance in pixels children fade up from (default: 15) */
  offset?: number;
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

const containerVariants: Variants = {
  hidden: {},
  visible: (custom: { delay: number; staggerDelay: number }) => ({
    transition: {
      staggerChildren: custom.staggerDelay,
      delayChildren: custom.delay,
    },
  }),
};

const itemVariants = (
  offset: number,
  duration: number
): Variants => ({
  hidden: {
    opacity: 0,
    y: offset,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration,
      ease: [0.4, 0, 0.2, 1], // Crisp cubic-bezier easing for cards/CTAs
    },
  },
});

export function StaggerChildren({
  children,
  className = '',
  delay = 0,
  staggerDelay = 0.1,
  duration = 0.3,
  once = true,
  margin = '-50px',
  offset = 15,
}: StaggerChildrenProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once,
        margin,
      }}
      custom={{ delay, staggerDelay }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = '',
}: StaggerItemProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={itemVariants(15, 0.3)}
    >
      {children}
    </motion.div>
  );
}

// Context-based approach for dynamic offset/duration
interface StaggerContextItemProps {
  children: ReactNode;
  className?: string;
  offset?: number;
  duration?: number;
}

export function StaggerContextItem({
  children,
  className = '',
  offset = 15,
  duration = 0.3,
}: StaggerContextItemProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={itemVariants(offset, duration)}
    >
      {children}
    </motion.div>
  );
}
