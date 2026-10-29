import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { HttpError } from '../utils/http.js';

export function notFound(_req: Request, res: Response): void {
  res.status(404).json({ success: false, message: 'Route not found' });
}

// Express recognises error middleware by its 4 parameters, so `_next` must stay.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ZodError) {
    const first = err.issues[0];
    res.status(400).json({
      success: false,
      message: first ? `${first.path.join('.') || 'input'}: ${first.message}` : 'Invalid input',
    });
    return;
  }
  if (err instanceof HttpError) {
    res.status(err.status).json({ success: false, message: err.message });
    return;
  }
  console.error('[Unhandled error]', err instanceof Error ? err.message : err);
  res.status(500).json({ success: false, message: 'Something went wrong on the server.' });
}
