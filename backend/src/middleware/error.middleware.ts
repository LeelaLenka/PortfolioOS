/**
 * error.middleware.ts — Global error handler (Express error-handling middleware)
 *
 * WHY: Uncaught errors in async controllers would crash the server without this.
 *      Centralized handler = consistent error JSON + logging.
 *
 * HOW: Register LAST in app.ts after all routes:
 *      `app.use(errorHandler)`
 *
 * Phase 4+: integrate with structured logging (Winston/Pino).
 */

import type { NextFunction, Request, Response } from 'express';
import { sendError } from '../utils/response.util.js';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  console.error('[Unhandled Error]', err.message);
  sendError(res, 'Internal server error', 500);
}
