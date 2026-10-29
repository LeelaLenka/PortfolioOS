import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { HttpError } from '../utils/http.js';

export interface AuthUser {
  id: string;
  role: 'OWNER' | 'MEMBER' | 'DEMO';
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthUser;
  }
}

export function signToken(user: AuthUser): string {
  return jwt.sign({ sub: user.id, role: user.role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
}

/** Requires a valid "Authorization: Bearer <token>" header */
export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return next(new HttpError(401, 'Log in to continue.'));

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload;
    req.user = { id: String(payload.sub), role: payload.role as AuthUser['role'] };
    next();
  } catch {
    next(new HttpError(401, 'Your session has expired. Log in again.'));
  }
}

/** Only the site owner can manage access requests and members */
export function requireOwner(req: Request, _res: Response, next: NextFunction): void {
  if (req.user?.role !== 'OWNER') return next(new HttpError(403, 'Only the site owner can do this.'));
  next();
}
