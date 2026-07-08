/**
 * Hero.tsx — Premium hero section (fully prop-driven)
 *
 * WHY: Home page centerpiece — composes GradientBackground, TypingText, Button, SocialLinks.
 *      All copy comes from `content` prop (future: React Query → CMS API).
 *
 * NO DUMMY CONTENT: Empty/missing fields render nothing — only visual chrome remains.
 *
 * STRUCTURE (always rendered):
 * - Animated gradient mesh background
 * - Content column with optional: greeting, name, typing roles, description, CTAs, socials
 */

import { motion } from 'framer-motion';
import type { HeroContent } from '@/types';
import {
  Button,
  Container,
  GradientBackground,
  SocialLinks,
  TypingText,
} from '@/components/ui';
import { staggerContainer, fadeInUp } from '@/utils/motion';
import { cn } from '@/utils';

interface HeroProps {
  content?: HeroContent;
  className?: string;
}

export function Hero({ content, className }: HeroProps) {
  const {
    greeting,
    name,
    typingRoles = [],
    description,
    primaryCta,
    secondaryCta,
    socialLinks = [],
  } = content ?? {};

  const hasHeading = Boolean(greeting ?? name ?? typingRoles.length > 0);
  const hasCtas = Boolean(primaryCta ?? secondaryCta);
  const hasContent = hasHeading || Boolean(description) || hasCtas || socialLinks.length > 0;

  return (
    <section
      className={cn('relative flex min-h-[calc(100vh-var(--navbar-height))] items-center overflow-hidden', className)}
      aria-label="Hero"
    >
      <GradientBackground />

      <Container className="relative z-10 py-16 lg:py-24">
        <motion.div
          className="mx-auto max-w-4xl"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {greeting ? (
            <motion.p
              variants={fadeInUp}
              className="mb-4 text-sm font-medium uppercase tracking-[0.25em] text-secondary"
            >
              {greeting}
            </motion.p>
          ) : null}

          {name ? (
            <motion.h1
              variants={fadeInUp}
              className="font-display text-hero font-bold leading-[1.1] tracking-tight text-text"
            >
              <span
                className="bg-gradient-to-br from-text via-text to-muted bg-clip-text text-transparent"
              >
                {name}
              </span>
            </motion.h1>
          ) : null}

          {typingRoles.length > 0 ? (
            <motion.div variants={fadeInUp} className="mt-4 text-2xl font-medium lg:text-3xl">
              <TypingText strings={typingRoles} />
            </motion.div>
          ) : null}

          {description ? (
            <motion.p
              variants={fadeInUp}
              className="mt-6 max-w-2xl text-lg leading-relaxed text-muted lg:text-xl"
            >
              {description}
            </motion.p>
          ) : null}

          {hasCtas ? (
            <motion.div variants={fadeInUp} className="mt-10 flex flex-wrap gap-4">
              {primaryCta ? (
                <Button
                  label={primaryCta.label}
                  href={primaryCta.href}
                  icon={primaryCta.icon}
                  variant="primary"
                  external={primaryCta.external}
                />
              ) : null}
              {secondaryCta ? (
                <Button
                  label={secondaryCta.label}
                  href={secondaryCta.href}
                  icon={secondaryCta.icon}
                  variant="secondary"
                  external={secondaryCta.external}
                />
              ) : null}
            </motion.div>
          ) : null}

          {socialLinks.length > 0 ? (
            <motion.div variants={fadeInUp} className="mt-10">
              <SocialLinks links={socialLinks} />
            </motion.div>
          ) : null}

          {/* Empty state: gradient shell only — ready for CMS data */}
          {!hasContent ? (
            <motion.div
              variants={fadeInUp}
              className="h-32 lg:h-40"
              data-hero-slot="content"
              aria-hidden
            />
          ) : null}
        </motion.div>
      </Container>
    </section>
  );
}
