/**
 * response.util.ts — HTTP response helpers for controllers
 *
 * WHY: Controllers shouldn't repeat `res.status(200).json({ success: true, ... })` everywhere.
 *      One helper = consistent API contract across all endpoints.
 *
 * HOW: Controller calls `sendSuccess(res, { message: '...', data: projects })`
 */

import type { Response } from 'express';
import type { ApiErrorResponse, ApiSuccessResponse } from '../types/api.types.js';

interface SendSuccessOptions<T> {
  message: string;
  data?: T;
  statusCode?: number;
}

export function sendSuccess<T>(res: Response, options: SendSuccessOptions<T>): Response {
  const body: ApiSuccessResponse<T> = {
    success: true,
    message: options.message,
    timestamp: new Date().toISOString(),
  };

  if (options.data !== undefined) {
    body.data = options.data;
  }

  return res.status(options.statusCode ?? 200).json(body);
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 500,
  errors?: Record<string, string[]>,
): Response {
  const body: ApiErrorResponse = { success: false, message };
  if (errors) body.errors = errors;
  return res.status(statusCode).json(body);
}
