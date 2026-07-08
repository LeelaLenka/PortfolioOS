/**
 * paths.ts — Single source of truth for all route paths
 *
 * WHY: Avoid magic strings like '/projects' scattered across Navbar, Router, links.
 *      Change a path once — every reference updates.
 *
 * HOW: Import ROUTES in components and route config.
 *
 * BEST PRACTICE: Use `as const` for literal type inference in TypeScript.
 */

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  PROJECTS: '/projects',
  EXPERIENCE: '/experience',
  CERTIFICATES: '/certificates',
  SKILLS: '/skills',
  RESUME: '/resume',
  CONTACT: '/contact',

  /** Admin dashboard routes — protected in Phase 4 (auth) */
  ADMIN: {
    ROOT: '/admin',
    DASHBOARD: '/admin/dashboard',
    PROJECTS: '/admin/projects',
    SKILLS: '/admin/skills',
    EXPERIENCE: '/admin/experience',
    EDUCATION: '/admin/education',
    CERTIFICATES: '/admin/certificates',
    ACHIEVEMENTS: '/admin/achievements',
    RESUMES: '/admin/resumes',
    MESSAGES: '/admin/messages',
  },
} as const;

/** Type-safe union of all public route paths */
export type PublicRoutePath =
  | typeof ROUTES.HOME
  | typeof ROUTES.ABOUT
  | typeof ROUTES.PROJECTS
  | typeof ROUTES.EXPERIENCE
  | typeof ROUTES.CERTIFICATES
  | typeof ROUTES.SKILLS
  | typeof ROUTES.RESUME
  | typeof ROUTES.CONTACT;
