/**
 * primereact.config.ts — Central PrimeReact global configuration
 *
 * WHY: PrimeReact behavior (z-index stacking, ripples, transitions) must be consistent
 *      across Navbar mobile drawer, admin DataTables, and future dialogs.
 *
 * HOW: Passed to `<PrimeReactProvider value={primeReactConfig} />` in ThemeProvider.
 *
 * Docs: https://primereact.org/configuration/
 */

import type { APIOptions } from 'primereact/api';

export const primeReactConfig: Partial<APIOptions> = {
  /** Material-style click ripple on buttons */
  ripple: true,

  /** Outlined inputs match Linear/Vercel aesthetic better than filled */
  inputStyle: 'outlined',

  /** Use PrimeReact styled mode — overridden via primereact-overrides.css */
  unstyled: false,

  /** Smooth CSS transitions for overlays */
  cssTransition: true,

  /** Auto-manage z-index for nested overlays (menu inside dialog) */
  autoZIndex: true,

  zIndex: {
    modal: 1100,
    overlay: 1000,
    menu: 1000,
    tooltip: 1100,
  },

  /** Keep mobile nav open while scrolling page content */
  hideOverlaysOnDocumentScrolling: false,
};
