import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';
import { portfolioService } from '../services/portfolio.service.js';
import {
  certificatesSchema,
  experiencesSchema,
  profileSchema,
  projectsSchema,
  skillGroupsSchema,
} from '../services/validators.js';
import { asyncHandler, HttpError } from '../utils/http.js';

/** Everything here edits the logged-in person's own portfolio */
export const meRouter = Router();
meRouter.use(requireAuth);

meRouter.get('/portfolio', asyncHandler(async (req, res) => {
  res.json({ success: true, data: await portfolioService.getById(req.user!.id) });
}));

meRouter.put('/profile', asyncHandler(async (req, res) => {
  await portfolioService.saveProfile(req.user!.id, profileSchema.parse(req.body));
  res.json({ success: true, message: 'Profile saved.' });
}));

meRouter.put('/projects', asyncHandler(async (req, res) => {
  await portfolioService.saveProjects(req.user!.id, projectsSchema.parse(req.body));
  res.json({ success: true, message: 'Projects saved.' });
}));

meRouter.put('/skills', asyncHandler(async (req, res) => {
  await portfolioService.saveSkillGroups(req.user!.id, skillGroupsSchema.parse(req.body));
  res.json({ success: true, message: 'Skills saved.' });
}));

meRouter.put('/experiences', asyncHandler(async (req, res) => {
  await portfolioService.saveExperiences(req.user!.id, experiencesSchema.parse(req.body));
  res.json({ success: true, message: 'Experience saved.' });
}));

meRouter.put('/certificates', asyncHandler(async (req, res) => {
  await portfolioService.saveCertificates(req.user!.id, certificatesSchema.parse(req.body));
  res.json({ success: true, message: 'Certificates saved.' });
}));

meRouter.get('/messages', asyncHandler(async (req, res) => {
  const messages = await prisma.contactMessage.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
  res.json({ success: true, data: messages });
}));

meRouter.patch('/messages/:id/read', asyncHandler(async (req, res) => {
  const { count } = await prisma.contactMessage.updateMany({
    where: { id: req.params.id, userId: req.user!.id },
    data: { read: true },
  });
  if (!count) throw new HttpError(404, 'Message not found.');
  res.json({ success: true, message: 'Marked as read.' });
}));

meRouter.delete('/messages/:id', asyncHandler(async (req, res) => {
  const { count } = await prisma.contactMessage.deleteMany({ where: { id: req.params.id, userId: req.user!.id } });
  if (!count) throw new HttpError(404, 'Message not found.');
  res.json({ success: true, message: 'Message deleted.' });
}));
