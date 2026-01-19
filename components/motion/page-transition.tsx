'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { pageTransition, pageVariants } from '@/lib/animation-variants';

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Page transition wrapper for smooth route transitions
 * Uses a soft fade animation consistent with the brand's animation system
 */
export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial="initial"
      animate="enter"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
}
