/**
 * navigation.types.ts — Shared types for navigation and layout
 *
 * WHY: Navbar, Sidebar, and route config share the same NavItem shape.
 *      Defining it once prevents drift between components.
 */

import type { PublicRoutePath } from '@/routes/paths';

/** A single navigation link used in Navbar and Sidebar */
export interface NavItem {
  label: string;
  path: PublicRoutePath | string;
  icon?: string;
  /** If true, only shown in admin sidebar (Phase 4+) */
  adminOnly?: boolean;
}

/** AppLayout variant controls whether sidebar is rendered */
export type LayoutVariant = 'public' | 'admin';
