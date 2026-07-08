/**
 * health.routes.ts — HTTP route definitions for /api/health
 *
 * WHY: Routes only map URLs to controller methods — nothing else.
 *      This file should stay thin (1-3 lines per route).
 *
 * BEFORE (Phase 1): Route contained Prisma query directly.
 * AFTER (Phase 2): Route delegates to controller → service → repository chain.
 */

import { Router } from 'express';
import { healthController } from '../controllers/health.controller.js';

export const healthRouter = Router();

healthRouter.get('/', (req, res) => {
  void healthController.getHealth(req, res);
});
