/**
 * health.controller.ts — HTTP adapter for health endpoints
 *
 * WHY: Separates "what to respond" (controller) from "how to check health" (service).
 *
 * HOW: Express calls controller method → service runs logic → controller sends JSON.
 *      Controllers should NOT contain business logic or database queries.
 */

import type { Request, Response } from 'express';
import { healthService } from '../services/health.service.js';
import { sendError, sendSuccess } from '../utils/response.util.js';

export const healthController = {
  async getHealth(_req: Request, res: Response): Promise<void> {
    try {
      const { healthy } = await healthService.checkApiHealth();

      if (!healthy) {
        sendError(res, 'Database connection failed', 503);
        return;
      }

      sendSuccess(res, { message: 'PortfolioOS API is healthy' });
    } catch {
      sendError(res, 'Database connection failed', 503);
    }
  },
};
