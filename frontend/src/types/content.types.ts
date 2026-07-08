/**
 * content.types.ts — CMS-ready content shapes (frontend contracts)
 *
 * WHY: Hero, Footer, and pages receive data from the API later.
 *      Defining types now ensures components stay prop-driven — no hardcoded copy.
 *
 * HOW: Admin dashboard writes to DB → API returns these shapes → pages pass to components.
 */

/** Supported social platforms — maps to icon in SocialLinks */
export type SocialPlatform = 'github' | 'linkedin' | 'email';

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
  /** Accessible label — required for a11y when platform alone isn't enough */
  label?: string;
}

/** Call-to-action button used in Hero and future sections */
export interface CtaButton {
  label: string;
  href: string;
  icon?: string;
  /** Opens in new tab when true (external links) */
  external?: boolean;
}

/** Hero section — fully driven by CMS / props; empty fields render nothing */
export interface HeroContent {
  greeting?: string;
  name?: string;
  /** Strings cycled by TypingText (e.g. role titles) */
  typingRoles?: string[];
  description?: string;
  primaryCta?: CtaButton;
  secondaryCta?: CtaButton;
  socialLinks?: SocialLink[];
}

/** Footer content — optional; structural footer renders without these */
export interface FooterContent {
  copyright?: string;
  socialLinks?: SocialLink[];
  navLinks?: { label: string; path: string }[];
}
