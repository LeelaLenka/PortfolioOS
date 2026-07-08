/**
 * theme.types.ts — Theme-related TypeScript types
 *
 * WHY: PortfolioOS ships dark-first. Light mode is a future phase;
 *      typing the mode now prevents ad-hoc string literals.
 */

export type ThemeMode = 'dark' | 'light';

export const DEFAULT_THEME: ThemeMode = 'dark';
