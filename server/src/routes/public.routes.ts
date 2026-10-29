import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { prisma } from '../lib/prisma.js';
import { portfolioService } from '../services/portfolio.service.js';
import { accessRequestSchema, contactSchema, slugSchema } from '../services/validators.js';
import { asyncHandler, HttpError } from '../utils/http.js';
import { RESERVED_SLUGS } from '../utils/keys.js';

export const publicRouter = Router();

// Stop bots from flooding the forms: a few submissions per IP every 15 minutes, per form
const limiter = (limit: number) =>
  rateLimit({ windowMs: 15 * 60 * 1000, limit, standardHeaders: true, legacyHeaders: false,
    message: { success: false, message: 'Too many submissions. Try again in 15 minutes.' } });
const contactLimiter = limiter(5);
const requestLimiter = limiter(5);

publicRouter.get('/health', asyncHandler(async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  res.json({ success: true, message: 'PortfolioOS API is healthy' });
}));

/** The site owner's portfolio, shown on the home page */
publicRouter.get('/portfolio', asyncHandler(async (_req, res) => {
  res.json({ success: true, data: await portfolioService.getOwner() });
}));

publicRouter.get('/portfolio/:slug', asyncHandler(async (req, res) => {
  const slug = slugSchema.parse(req.params.slug);
  res.json({ success: true, data: await portfolioService.getBySlug(slug) });
}));

publicRouter.post('/portfolio/:slug/contact', contactLimiter, asyncHandler(async (req, res) => {
  const slug = slugSchema.parse(req.params.slug);
  const body = contactSchema.parse(req.body);
  const user = await prisma.user.findUnique({ where: { slug }, select: { id: true, role: true } });
  if (!user) throw new HttpError(404, 'No portfolio exists at this address.');
  if (user.role === 'DEMO') throw new HttpError(400, 'This is an example portfolio, so messages are not delivered.');
  await prisma.contactMessage.create({ data: { ...body, userId: user.id } });
  res.status(201).json({ success: true, message: 'Message sent.' });
}));

/** A visitor asks for their own portfolio; the owner approves or rejects it */
publicRouter.post('/access-requests', requestLimiter, asyncHandler(async (req, res) => {
  const body = accessRequestSchema.parse(req.body);
  if (RESERVED_SLUGS.has(body.slug)) throw new HttpError(400, 'slug: that address is reserved, choose another.');

  const [slugTaken, emailTaken, pending] = await Promise.all([
    prisma.user.findUnique({ where: { slug: body.slug }, select: { id: true } }),
    prisma.user.findUnique({ where: { email: body.email }, select: { id: true } }),
    prisma.accessRequest.findFirst({
      where: { status: 'PENDING', OR: [{ email: body.email }, { slug: body.slug }] },
      select: { email: true },
    }),
  ]);
  if (slugTaken) throw new HttpError(409, 'slug: that address is already taken, choose another.');
  if (emailTaken) throw new HttpError(409, 'This email already has a portfolio. Log in with your access key.');
  if (pending) {
    throw new HttpError(409, pending.email === body.email
      ? 'You already have a pending request. You’ll get your access key once it’s approved.'
      : 'slug: someone has already requested that address, choose another.');
  }

  await prisma.accessRequest.create({ data: body });
  res.status(201).json({ success: true, message: 'Request sent.' });
}));
