/**
 * api.types.ts — Shared API response shapes
 *
 * WHY: Frontend and backend agree on response structure.
 *      TypeScript enforces consistency at compile time on both sides.
 *
 * Microsoft pattern: Same as ApiResponse<T> in ASP.NET Core controllers.
 */

/** Standard success envelope for all API responses */
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  message: string;
  data?: T;
  timestamp?: string;
}

/** Standard error envelope */
export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;
