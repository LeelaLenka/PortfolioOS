/**
 * SocialLinks.tsx — GitHub, LinkedIn, Email icon links
 *
 * WHY: Hero and Footer share the same social link row — DRY via one component.
 *
 * HOW: Pass `links` from CMS. Renders nothing when array is empty.
 *      Maps platform → PrimeIcon class.
 *
 * ACCESSIBILITY: Each link has aria-label; icons are decorative (aria-hidden).
 */

import { motion } from 'framer-motion';
import type { SocialLink, SocialPlatform } from '@/types';
import { cn } from '@/utils';
import { fadeIn } from '@/utils/motion';

interface SocialLinksProps {
  links: SocialLink[];
  className?: string;
  iconSize?: 'sm' | 'md' | 'lg';
}

const platformConfig: Record<
  SocialPlatform,
  { icon: string; defaultLabel: string; mailto?: boolean }
> = {
  github: { icon: 'pi pi-github', defaultLabel: 'GitHub profile' },
  linkedin: { icon: 'pi pi-linkedin', defaultLabel: 'LinkedIn profile' },
  email: { icon: 'pi pi-envelope', defaultLabel: 'Send email', mailto: true },
};

const sizeClasses = {
  sm: 'h-9 w-9 text-sm',
  md: 'h-11 w-11 text-base',
  lg: 'h-12 w-12 text-lg',
};

export function SocialLinks({ links, className, iconSize = 'md' }: SocialLinksProps) {
  if (links.length === 0) return null;

  return (
    <motion.div
      className={cn('flex flex-wrap items-center gap-3', className)}
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      {links.map((link) => {
        const config = platformConfig[link.platform];
        const href = config.mailto && !link.url.startsWith('mailto:')
          ? `mailto:${link.url}`
          : link.url;
        const label = link.label ?? config.defaultLabel;

        return (
          <motion.a
            key={`${link.platform}-${link.url}`}
            href={href}
            target={link.platform === 'email' ? undefined : '_blank'}
            rel={link.platform === 'email' ? undefined : 'noopener noreferrer'}
            aria-label={label}
            className={cn(
              'flex items-center justify-center rounded-xl border border-border bg-surface/50 text-muted',
              'transition-all duration-300 hover:border-primary/40 hover:bg-primary/10 hover:text-text hover:shadow-glow',
              sizeClasses[iconSize],
            )}
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.96 }}
          >
            <i className={cn(config.icon)} aria-hidden />
          </motion.a>
        );
      })}
    </motion.div>
  );
}
