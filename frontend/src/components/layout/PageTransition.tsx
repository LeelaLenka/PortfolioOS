/**
 * PageTransition.tsx — Framer Motion wrapper for route changes
 *
 * WHY: Smooth fade/slide between pages feels premium (Framer, Linear app navigation).
 *
 * HOW:
 * - Uses React Router's `useOutlet()` to get current child route element
 * - `AnimatePresence mode="wait"` — exit completes before enter (no overlap glitch)
 * - `key={location.pathname}` — triggers animation on route change
 *
 * React Router note: Must render inside a route context (AppLayout child of Route).
 */

import { AnimatePresence, motion } from 'framer-motion';
import { useLocation, useOutlet } from 'react-router-dom';
import { pageVariants } from '@/utils/motion';

export function PageTransition() {
  const location = useLocation();
  const outlet = useOutlet();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full"
      >
        {outlet}
      </motion.div>
    </AnimatePresence>
  );
}
