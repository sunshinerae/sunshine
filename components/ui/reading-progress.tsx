'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

interface ReadingProgressProps {
  /** Height of the progress bar in pixels (default: 3) */
  height?: number;
  /** Color of the progress bar (default: sun-gold) */
  className?: string;
}

export function ReadingProgress({
  height = 3,
  className = 'bg-sun-gold',
}: ReadingProgressProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 z-50 origin-left ${className}`}
      style={{
        scaleX,
        height,
      }}
    />
  );
}
