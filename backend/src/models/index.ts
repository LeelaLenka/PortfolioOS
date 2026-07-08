/**
 * README — Models layer
 *
 * WHY this folder exists:
 * In a Prisma project, the schema (`prisma/schema.prisma`) IS your data model.
 * This folder holds:
 * - Domain type extensions (computed fields, DTOs)
 * - Re-exports of Prisma-generated types for convenience
 *
 * Example (Phase 4+):
 *   export type { Project, Skill } from '@prisma/client';
 *   export interface ProjectWithMedia extends Project { screenshots: string[]; }
 *
 * ALTERNATIVE: Mongoose models (MongoDB) — we use Prisma for PostgreSQL.
 */

export {};
