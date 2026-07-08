/**
 * AppRouter.tsx — Central route configuration
 *
 * WHY: All routes in one file = easy to see the entire app map.
 *      Lazy imports = code splitting — each page loads only when visited.
 *
 * HOW React Router v6 nested routes work:
 *
 *   <Route element={<AppLayout />}>     ← layout route (no path)
 *     <Route path="/" element={<Home />} />  ← renders inside AppLayout's Outlet
 *   </Route>
 *
 * BEST PRACTICES:
 * - `ROUTES` constants instead of string literals
 * - `React.lazy` + `Suspense` for performance
 * - Separate public vs admin layout variants
 *
 * ALTERNATIVE: File-based routing (Remix, Next.js App Router) — we use explicit config for Vite SPA.
 */

import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppLayout } from '@/components/layout';
import { ROUTES } from './paths';

/** Lazy-loaded pages — each becomes its own JS chunk at build time */
const HomePage = lazy(() =>
  import('@/features/home').then((module) => ({ default: module.HomePage })),
);
const AboutPage = lazy(() =>
  import('@/features/about').then((module) => ({ default: module.AboutPage })),
);
const ProjectsPage = lazy(() =>
  import('@/features/projects').then((module) => ({ default: module.ProjectsPage })),
);
const SkillsPage = lazy(() =>
  import('@/features/skills').then((module) => ({ default: module.SkillsPage })),
);
const ExperiencePage = lazy(() =>
  import('@/features/experience').then((module) => ({ default: module.ExperiencePage })),
);
const CertificatesPage = lazy(() =>
  import('@/features/certificates').then((module) => ({ default: module.CertificatesPage })),
);
const ResumePage = lazy(() =>
  import('@/features/resume').then((module) => ({ default: module.ResumePage })),
);
const ContactPage = lazy(() =>
  import('@/features/contact').then((module) => ({ default: module.ContactPage })),
);
const AdminDashboardPage = lazy(() =>
  import('@/features/admin').then((module) => ({ default: module.AdminDashboardPage })),
);

/** Minimal fallback while lazy chunks load */
function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <i className="pi pi-spin pi-spinner text-2xl text-primary" aria-label="Loading" />
    </div>
  );
}

/** Wraps lazy pages in Suspense boundary */
function LazyPage({ children }: { children: ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

const router = createBrowserRouter([
  {
    element: <AppLayout variant="public" />,
    children: [
      {
        path: ROUTES.HOME,
        element: (
          <LazyPage>
            <HomePage />
          </LazyPage>
        ),
      },
      {
        path: ROUTES.ABOUT,
        element: (
          <LazyPage>
            <AboutPage />
          </LazyPage>
        ),
      },
      {
        path: ROUTES.PROJECTS,
        element: (
          <LazyPage>
            <ProjectsPage />
          </LazyPage>
        ),
      },
      {
        path: ROUTES.SKILLS,
        element: (
          <LazyPage>
            <SkillsPage />
          </LazyPage>
        ),
      },
      {
        path: ROUTES.EXPERIENCE,
        element: (
          <LazyPage>
            <ExperiencePage />
          </LazyPage>
        ),
      },
      {
        path: ROUTES.CERTIFICATES,
        element: (
          <LazyPage>
            <CertificatesPage />
          </LazyPage>
        ),
      },
      {
        path: ROUTES.RESUME,
        element: (
          <LazyPage>
            <ResumePage />
          </LazyPage>
        ),
      },
      {
        path: ROUTES.CONTACT,
        element: (
          <LazyPage>
            <ContactPage />
          </LazyPage>
        ),
      },
    ],
  },
  {
    element: <AppLayout variant="admin" />,
    children: [
      {
        path: ROUTES.ADMIN.DASHBOARD,
        element: (
          <LazyPage>
            <AdminDashboardPage />
          </LazyPage>
        ),
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
