import cors from 'cors';
import express, { type Express } from 'express';
import { env } from './config/env.js';
import { errorHandler } from './middleware/error.middleware.js';
import { healthRouter } from './routes/health.routes.js';

export function createApp(): Express {
  const app = express();

  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.use('/api/health', healthRouter);

  app.use((_req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
  });

  /** Must be registered after all routes */
  app.use(errorHandler);

  return app;
}
