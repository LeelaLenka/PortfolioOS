/**
 * GradientBackground.tsx — Animated ambient gradient mesh for Hero/sections
 *
 * WHY: Static dark backgrounds feel flat. Subtle animated orbs add depth without distraction.
 *
 * HOW: Absolutely positioned layers behind content — pointer-events-none for click-through.
 *      Framer Motion animates orb position/scale on infinite repeat.
 *
 * PERFORMANCE: transform/opacity only — compositor-friendly.
 */

import { motion } from 'framer-motion';
import { cn } from '@/utils';

interface GradientBackgroundProps {
  className?: string;
  /** Reduce motion for prefers-reduced-motion users */
  intensity?: 'subtle' | 'medium';
}

export function GradientBackground({ className, intensity = 'medium' }: GradientBackgroundProps) {
  const opacity = intensity === 'subtle' ? 0.5 : 1;

  return (
    <div
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      aria-hidden
    >
      {/* Base gradient wash */}
      <div
        className="animate-gradient-shift absolute inset-0 opacity-80"
        style={{ background: 'var(--gradient-hero)' }}
      />

      {/* Primary orb — top left */}
      <motion.div
        className="absolute -left-1/4 -top-1/4 h-[600px] w-[600px] rounded-full blur-3xl"
        style={{ background: 'var(--gradient-orb-primary)', opacity }}
        animate={{
          x: [0, 30, 0],
          y: [0, 20, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Accent orb — bottom right */}
      <motion.div
        className="absolute -bottom-1/4 -right-1/4 h-[500px] w-[500px] rounded-full blur-3xl"
        style={{ background: 'var(--gradient-orb-accent)', opacity: opacity * 0.8 }}
        animate={{
          x: [0, -25, 0],
          y: [0, -15, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Vignette — keeps focus on center content */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/60" />
    </div>
  );
}
