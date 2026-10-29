import { randomBytes } from 'node:crypto';
import bcrypt from 'bcryptjs';

/** A new access key, e.g. pos_Xk3...; shown once, only its hash is stored */
export function generateAccessKey(): string {
  return `pos_${randomBytes(24).toString('base64url')}`;
}

export function hashAccessKey(key: string): Promise<string> {
  return bcrypt.hash(key, 12);
}

export function verifyAccessKey(key: string, hash: string): Promise<boolean> {
  return bcrypt.compare(key, hash);
}

/** Slugs that would clash with app routes */
export const RESERVED_SLUGS = new Set([
  'demo', 'admin', 'studio', 'login', 'join', 'api', 'p', 'about', 'help', 'owner',
]);

/** A real hash of a throwaway value, compared against when an email doesn't exist,
 *  so failed logins take the same time whether or not the account exists */
export const DUMMY_HASH = bcrypt.hashSync('portfolioos-dummy-key', 12);
