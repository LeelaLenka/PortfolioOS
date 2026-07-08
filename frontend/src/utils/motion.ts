/**
 * motion.ts — Shared Framer Motion variants
 *
 * WHY: One source for animation timing/easing — every page and component feels cohesive.
 *
 * HOW: `<motion.div variants={fadeInUp} initial="hidden" animate="visible" />`
 *
 * PERFORMANCE: Prefer `transform` and `opacity` — GPU-composited, no layout thrash.
 */

import type { Transition, Variants } from 'framer-motion';

/** Premium easing — similar to Apple/Linear spring-like feel */
export const easeOutExpo: Transition['ease'] = [0.16, 1, 0.3, 1];

export const defaultTransition: Transition = {
  duration: 0.5,
  ease: easeOutExpo,
};

/** Page enter/exit — used by PageTransition wrapper */
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 12,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: defaultTransition,
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.3, ease: easeOutExpo },
  },
};

/** Stagger children in hero sections */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: defaultTransition,
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: easeOutExpo },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: defaultTransition,
  },
};
