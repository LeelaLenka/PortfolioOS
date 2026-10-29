import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import { allowedOrigins } from './config/env.js';
import { errorHandler, notFound } from './middleware/error.js';
import { adminRouter } from './routes/admin.routes.js';
import { imagesRouter, uploadRouter } from './routes/images.routes.js';
import { authRouter } from './routes/auth.routes.js';
import { meRouter } from './routes/me.routes.js';
import { publicRouter } from './routes/public.routes.js';

export function createApp(): Express {
  const app = express();

  // Render sits behind a proxy; this makes rate limiting see the real visitor IP
  app.set('trust proxy', 1);
  // cross-origin so the Vercel site can show images served by this API
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(
    cors({
      origin(origin, cb) {
        const isLocalVite = !!origin && /^http:\/\/(localhost|127\.0\.0\.1):51\d{2}$/.test(origin);
        if (!origin || isLocalVite || allowedOrigins.includes(origin)) return cb(null, true);
        cb(null, false); // unknown site: no CORS headers, so the browser blocks it
      },
    }),
  );
  // Image uploads need a bigger body limit, so they're parsed before the global 200kb parser
  app.use('/api/me/images', express.json({ limit: '3mb' }), uploadRouter);
  app.use(express.json({ limit: '200kb' }));
  app.use('/api/images', imagesRouter);

  app.use('/api', publicRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/me', meRouter);
  app.use('/api/admin', adminRouter);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
