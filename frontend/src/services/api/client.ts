/**
 * client.ts — Axios HTTP client singleton
 *
 * WHY: Every API call (projects, skills, auth) shares one configured instance —
 *      base URL, timeouts, JWT interceptor (Phase 4), error handling.
 *
 * HOW: Import `apiClient` in feature services:
 *      `const { data } = await apiClient.get('/projects')`
 *
 * Vite env: VITE_ prefix exposes vars to the browser bundle.
 * NEVER put secrets in VITE_ vars — they are public.
 */

import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? '/api';

export const apiClient = axios.create({
  baseURL,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/** Phase 4: attach JWT from localStorage via request interceptor */
apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    // Centralized error logging — expand with toast notifications in Phase 3
    if (axios.isAxiosError(error)) {
      console.error('[API Error]', error.response?.status, error.message);
    }
    return Promise.reject(error instanceof Error ? error : new Error('Unknown API error'));
  },
);
