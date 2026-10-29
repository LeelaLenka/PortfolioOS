import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler, HttpError } from '../utils/http.js';

const MAX_BYTES = 1.5 * 1024 * 1024; // after the browser has resized it
const MAX_IMAGES_PER_USER = 40;

/** POST /api/me/images  { dataUrl: "data:image/jpeg;base64,..." }  ->  { url } */
export const uploadRouter = Router();
uploadRouter.use(requireAuth);

uploadRouter.post('/', asyncHandler(async (req, res) => {
  const { dataUrl } = z.object({ dataUrl: z.string().max(3_000_000) }).parse(req.body);
  const match = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl);
  if (!match) throw new HttpError(400, 'Upload a JPG, PNG or WebP image.');

  const data = Buffer.from(match[2]!, 'base64');
  if (data.length > MAX_BYTES) throw new HttpError(413, 'That image is too large. Use one under 1.5 MB.');

  const count = await prisma.image.count({ where: { userId: req.user!.id } });
  if (count >= MAX_IMAGES_PER_USER) throw new HttpError(400, 'Image limit reached (40). Ask the site owner to clear old uploads.');

  const image = await prisma.image.create({ data: { userId: req.user!.id, mime: match[1]!, data } });
  const url = `${req.protocol}://${req.get('host')}/api/images/${image.id}`;
  res.status(201).json({ success: true, data: { url } });
}));

/** GET /api/images/:id  ->  the image itself, cached by browsers for a year (ids never change) */
export const imagesRouter = Router();

imagesRouter.get('/:id', asyncHandler(async (req, res) => {
  const id = z.string().regex(/^[a-z0-9]{10,40}$/).safeParse(req.params.id);
  if (!id.success) throw new HttpError(404, 'Image not found.');
  const image = await prisma.image.findUnique({ where: { id: id.data }, select: { mime: true, data: true } });
  if (!image) throw new HttpError(404, 'Image not found.');
  res.set('Content-Type', image.mime);
  res.set('Cache-Control', 'public, max-age=31536000, immutable');
  res.send(Buffer.from(image.data));
}));
