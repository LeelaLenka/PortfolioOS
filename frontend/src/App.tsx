/**
 * App.tsx — Application root component
 *
 * WHY: Minimal root — delegates to AppProviders (context) and AppRouter (routing).
 *      All complexity lives in feature modules and layout components.
 *
 * HOW: React renders App → AppProviders → AppRouter → matched route → page component.
 */

import { AppProviders } from '@/components/common';
import { AppRouter } from '@/routes';

export function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}
