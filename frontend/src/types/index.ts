/**
 * index.ts — Barrel export for shared types
 *
 * WHY: Consumers import from `@/types` instead of deep paths.
 *      Keeps imports clean as the type library grows.
 */

export type { NavItem, LayoutVariant } from './navigation.types';
export type {
  SocialPlatform,
  SocialLink,
  CtaButton,
  HeroContent,
  FooterContent,
} from './content.types';
export type { ThemeMode } from './theme.types';
export { DEFAULT_THEME } from './theme.types';
