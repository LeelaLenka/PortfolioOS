/**
 * nav.config.ts — Navigation items shared by Navbar and Sidebar
 *
 * WHY: Single config drives both layout components — add a route once, it appears everywhere.
 *
 * HOW: Filter by `adminOnly` depending on layout variant.
 */

import { ROUTES } from '@/routes/paths';
import type { NavItem } from '@/types';

/** Public portfolio navigation — shown in Navbar */
export const PUBLIC_NAV_ITEMS: NavItem[] = [
  { label: 'Home', path: ROUTES.HOME, icon: 'pi pi-home' },
  { label: 'About', path: ROUTES.ABOUT, icon: 'pi pi-user' },
  { label: 'Projects', path: ROUTES.PROJECTS, icon: 'pi pi-folder' },
  { label: 'Skills', path: ROUTES.SKILLS, icon: 'pi pi-code' },
  { label: 'Experience', path: ROUTES.EXPERIENCE, icon: 'pi pi-briefcase' },
  { label: 'Certificates', path: ROUTES.CERTIFICATES, icon: 'pi pi-verified' },
  { label: 'Resume', path: ROUTES.RESUME, icon: 'pi pi-file' },
  { label: 'Contact', path: ROUTES.CONTACT, icon: 'pi pi-envelope' },
];

/** Admin dashboard navigation — shown in Sidebar (Phase 4+) */
export const ADMIN_NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: ROUTES.ADMIN.DASHBOARD, icon: 'pi pi-th-large', adminOnly: true },
  { label: 'Projects', path: ROUTES.ADMIN.PROJECTS, icon: 'pi pi-folder', adminOnly: true },
  { label: 'Skills', path: ROUTES.ADMIN.SKILLS, icon: 'pi pi-code', adminOnly: true },
  { label: 'Experience', path: ROUTES.ADMIN.EXPERIENCE, icon: 'pi pi-briefcase', adminOnly: true },
  { label: 'Certificates', path: ROUTES.ADMIN.CERTIFICATES, icon: 'pi pi-verified', adminOnly: true },
  { label: 'Resumes', path: ROUTES.ADMIN.RESUMES, icon: 'pi pi-file', adminOnly: true },
  { label: 'Messages', path: ROUTES.ADMIN.MESSAGES, icon: 'pi pi-inbox', adminOnly: true },
];
