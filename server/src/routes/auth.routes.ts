import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { prisma } from '../lib/prisma.js';
import { requireAuth, signToken } from '../middleware/auth.js';
import { loginSchema } from '../services/validators.js';
import { asyncHandler, HttpError } from '../utils/http.js';
import { DUMMY_HASH, verifyAccessKey } from '../utils/keys.js';

export const authRouter = Router();

// 10 login attempts per IP every 15 minutes makes guessing keys impractical
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts. Try again in 15 minutes.' } });

authRouter.post('/login', loginLimiter, asyncHandler(async (req, res) => {
  const { email, accessKey } = loginSchema.parse(req.body);
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, role: true, slug: true, email: true, accessKeyHash: true, profile: { select: { fullName: true } } },
  });

  const ok = await verifyAccessKey(accessKey, user?.accessKeyHash ?? DUMMY_HASH);
  if (!user || !user.accessKeyHash || !ok) throw new HttpError(401, 'That email and access key don’t match.');

  res.json({
    success: true,
    data: {
      token: signToken({ id: user.id, role: user.role }),
      user: { email: user.email, slug: user.slug, role: user.role, fullName: user.profile?.fullName ?? '' },
    },
  });
}));

authRouter.get('/me', requireAuth, asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { email: true, slug: true, role: true, profile: { select: { fullName: true } } },
  });
  if (!user) throw new HttpError(401, 'Account not found. Log in again.');
  res.json({ success: true, data: { email: user.email, slug: user.slug, role: user.role, fullName: user.profile?.fullName ?? '' } });
}));
