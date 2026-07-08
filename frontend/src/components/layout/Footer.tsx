/**
 * Footer.tsx — Site footer (CMS-driven, no dummy links)
 *
 * WHY: Structural footer with optional copyright + social links from props/API.
 *      Renders minimal chrome when `content` is undefined.
 *
 * Phase 5: Pass content from React Query hook fetching site settings.
 */

import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { FooterContent } from '@/types';
import { Container, SocialLinks } from '@/components/ui';
import { PUBLIC_NAV_ITEMS } from '@/routes/nav.config';
import { fadeIn } from '@/utils/motion';

interface FooterProps {
  content?: FooterContent;
}

export function Footer({ content }: FooterProps) {
  const year = new Date().getFullYear();
  const navLinks = content?.navLinks ?? PUBLIC_NAV_ITEMS.map((item) => ({
    label: item.label,
    path: item.path,
  }));

  return (
    <motion.footer
      className="mt-auto border-t border-border bg-surface/40 backdrop-blur-sm"
      variants={fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <Container className="py-10 lg:py-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          {content?.copyright ? (
            <p className="text-sm text-muted">{content.copyright}</p>
          ) : (
            <p className="text-sm text-muted">© {year}</p>
          )}

          <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Footer navigation">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className="text-sm text-muted no-underline transition-colors hover:text-text"
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {content?.socialLinks && content.socialLinks.length > 0 ? (
            <SocialLinks links={content.socialLinks} iconSize="sm" />
          ) : null}
        </div>
      </Container>
    </motion.footer>
  );
}
