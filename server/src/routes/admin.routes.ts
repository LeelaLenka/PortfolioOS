import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth, requireOwner } from '../middleware/auth.js';
import { portfolioService } from '../services/portfolio.service.js';
import { asyncHandler, HttpError } from '../utils/http.js';
import { generateAccessKey, hashAccessKey } from '../utils/keys.js';

/** Owner-only: review access requests and manage members */
export const adminRouter = Router();
adminRouter.use(requireAuth, requireOwner);

adminRouter.get('/requests', asyncHandler(async (_req, res) => {
  const requests = await prisma.accessRequest.findMany({ orderBy: { createdAt: 'desc' }, take: 200 });
  res.json({ success: true, data: requests });
}));

/** Creates the member's account and portfolio; returns the access key ONCE */
adminRouter.post('/requests/:id/approve', asyncHandler(async (req, res) => {
  const request = await prisma.accessRequest.findUnique({ where: { id: req.params.id } });
  if (!request) throw new HttpError(404, 'Request not found.');
  if (request.status !== 'PENDING') throw new HttpError(409, 'This request has already been reviewed.');

  const clash = await prisma.user.findFirst({
    where: { OR: [{ email: request.email }, { slug: request.slug }] },
    select: { email: true },
  });
  if (clash) {
    throw new HttpError(409, clash.email === request.email
      ? 'A portfolio already exists for this email.'
      : 'That address was taken after this request was made. Reject it and ask them to request another.');
  }

  const accessKey = generateAccessKey();
  const accessKeyHash = await hashAccessKey(accessKey);

  const user = await prisma.$transaction(async (tx) => {
    const created = await tx.user.create({
      data: { email: request.email, slug: request.slug, role: 'MEMBER', accessKeyHash },
    });
    await portfolioService.cloneDemoInto(tx, created.id, request.name, request.email);
    await tx.accessRequest.update({ where: { id: request.id }, data: { status: 'APPROVED', reviewedAt: new Date() } });
    return created;
  });

  res.json({ success: true, data: { accessKey, email: user.email, slug: user.slug, name: request.name } });
}));

adminRouter.post('/requests/:id/reject', asyncHandler(async (req, res) => {
  const { count } = await prisma.accessRequest.updateMany({
    where: { id: req.params.id, status: 'PENDING' },
    data: { status: 'REJECTED', reviewedAt: new Date() },
  });
  if (!count) throw new HttpError(404, 'No pending request with that id.');
  res.json({ success: true, message: 'Request rejected.' });
}));

adminRouter.get('/members', asyncHandler(async (_req, res) => {
  const members = await prisma.user.findMany({
    where: { role: { in: ['OWNER', 'MEMBER'] } },
    orderBy: { createdAt: 'asc' },
    select: { id: true, email: true, slug: true, role: true, createdAt: true, profile: { select: { fullName: true } } },
  });
  res.json({ success: true, data: members });
}));

/** Issues a new key and invalidates the old one, e.g. when a member loses theirs */
adminRouter.post('/members/:id/reset-key', asyncHandler(async (req, res) => {
  const accessKey = generateAccessKey();
  const { count } = await prisma.user.updateMany({
    where: { id: req.params.id, role: { in: ['OWNER', 'MEMBER'] } },
    data: { accessKeyHash: await hashAccessKey(accessKey) },
  });
  if (!count) throw new HttpError(404, 'Member not found.');
  res.json({ success: true, data: { accessKey } });
}));

adminRouter.delete('/members/:id', asyncHandler(async (req, res) => {
  const { count } = await prisma.user.deleteMany({ where: { id: req.params.id, role: 'MEMBER' } });
  if (!count) throw new HttpError(404, 'Member not found. The owner account can’t be deleted.');
  res.json({ success: true, message: 'Member and their portfolio deleted.' });
}));
