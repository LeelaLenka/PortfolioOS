import type { NextFunction, Request, RequestHandler, Response } from 'express';

/** An error with an HTTP status, thrown from services and turned into JSON by the error middleware */
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

/** Lets async route handlers throw; Express 4 doesn't catch rejected promises by itself */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    fn(req, res, next).catch(next);
  };
