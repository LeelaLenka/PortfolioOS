/**
 * health.service.ts — Business logic for health checks
 *
 * WHY: Keeps controllers thin. If health check later validates Redis, Cloudinary,
 *      and DB — that logic lives here, not in the route handler.
 *
 * SOLID — Single Responsibility:
 * - Route: HTTP parsing
 * - Controller: HTTP response mapping
 * - Service: business rules
 * - Repository: data access
 */

import { healthRepository } from '../repositories/health.repository.js';

export const healthService = {
  async checkApiHealth(): Promise<{ healthy: boolean }> {
    const healthy = await healthRepository.pingDatabase();
    return { healthy };
  },
};
