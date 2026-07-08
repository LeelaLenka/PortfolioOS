/**
 * health.repository.ts — Data access layer for health checks
 *
 * WHY (Repository Pattern):
 * - Controllers never write raw SQL or Prisma queries
 * - Swapping PostgreSQL for another DB only changes repositories
 * - Unit tests mock repositories, not the database
 *
 * HOW Express + Prisma flow:
 *   Controller → Service → Repository → prisma.$queryRaw → PostgreSQL
 *
 * Microsoft analogy: Same as IUserRepository in .NET Clean Architecture.
 */

import { prisma } from '../lib/prisma.js';

export const healthRepository = {
  /** Ping database — returns true if connection is alive */
  async pingDatabase(): Promise<boolean> {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  },
};
