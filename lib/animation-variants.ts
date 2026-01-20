import type { Variants, Transition } from 'framer-motion';

/**
 * Animation timing constants for The Sunshine Effect brand
 *
 * Soft animations: Body content, section reveals (0.6s+, gentle easing)
 * Crisp animations: CTAs, cards, interactive elements (0.3s, defined easing)
 */

// Easing curves
export const softEase = [0.25, 0.1, 0.25, 1] as const;
export const crispEase = [0.4, 0, 0.2, 1] as const;

// Duration constants
export const softDuration = 0.6;
export const crispDuration = 0.3;

// Transition presets
export const softTransition: Transition = {
  duration: softDuration,
  ease: softEase,
};

export const crispTransition: Transition = {
  duration: crispDuration,
  ease: crispEase,
};

/**
 * Soft fade variants for body content and section reveals
 */
export const fadeInSoft: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: softTransition,
  },
};

export const fadeInUpSoft: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: softTransition,
  },
};

export const fadeInDownSoft: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: softTransition,
  },
};

export const fadeInLeftSoft: Variants = {
  hidden: {
    opacity: 0,
    x: 20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: softTransition,
  },
};

export const fadeInRightSoft: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: softTransition,
  },
};

/**
 * Crisp fade variants for CTAs and interactive elements
 */
export const fadeInCrisp: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: crispTransition,
  },
};

export const fadeInUpCrisp: Variants = {
  hidden: {
    opacity: 0,
    y: 15,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: crispTransition,
  },
};

/**
 * Scale variants for CTAs and buttons (crisp)
 */
export const scaleInCrisp: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: crispTransition,
  },
};

export const scaleInSoft: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: softTransition,
  },
};

/**
 * Hover and tap variants for interactive elements
 */
export const hoverScale: Variants = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: crispEase,
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
      ease: crispEase,
    },
  },
};

export const hoverLift: Variants = {
  initial: {
    y: 0,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  hover: {
    y: -4,
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
    transition: {
      duration: 0.2,
      ease: crispEase,
    },
  },
};

/**
 * Stagger container variants
 */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0,
    },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

/**
 * Stagger item variants (crisp for cards)
 */
export const staggerItemCrisp: Variants = {
  hidden: {
    opacity: 0,
    y: 15,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: crispTransition,
  },
};

export const staggerItemSoft: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: softTransition,
  },
};

/**
 * Slide variants for panels and drawers
 */
export const slideInFromRight: Variants = {
  hidden: {
    x: '100%',
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: crispEase,
    },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: crispEase,
    },
  },
};

export const slideInFromLeft: Variants = {
  hidden: {
    x: '-100%',
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: crispEase,
    },
  },
  exit: {
    x: '-100%',
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: crispEase,
    },
  },
};

export const slideInFromBottom: Variants = {
  hidden: {
    y: '100%',
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: crispEase,
    },
  },
  exit: {
    y: '100%',
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: crispEase,
    },
  },
};

/**
 * Backdrop/overlay variants
 */
export const backdropFade: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

/**
 * Factory functions for custom variants
 */
export function createFadeInUp(
  offset: number = 20,
  duration: number = softDuration,
  ease: readonly number[] = softEase
): Variants {
  return {
    hidden: {
      opacity: 0,
      y: offset,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        ease: ease as [number, number, number, number],
      },
    },
  };
}

export function createStaggerContainer(
  staggerDelay: number = 0.1,
  initialDelay: number = 0
): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: initialDelay,
      },
    },
  };
}

export function createScaleIn(
  initialScale: number = 0.9,
  duration: number = crispDuration,
  ease: readonly number[] = crispEase
): Variants {
  return {
    hidden: {
      opacity: 0,
      scale: initialScale,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration,
        ease: ease as [number, number, number, number],
      },
    },
  };
}

/**
 * Page transition variants for route changes
 * Uses soft, gentle animations consistent with brand guidelines
 */
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
  },
  enter: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

export const pageTransition: Transition = {
  duration: 0.3,
  ease: softEase,
};
