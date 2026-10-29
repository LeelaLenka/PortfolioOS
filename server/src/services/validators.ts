import { z } from 'zod';

/** Optional text: trimmed, length-capped, empty string when missing */
const text = (max: number) => z.string().trim().max(max).default('');
/** Optional link: empty, or a full http(s) URL */
const link = z
  .string()
  .trim()
  .max(300)
  .refine((v) => v === '' || /^https?:\/\/\S+$/i.test(v), 'must be a full link starting with https://')
  .default('');
const list = (maxItems: number, maxLen: number) =>
  z.array(z.string().trim().min(1).max(maxLen)).max(maxItems).default([]);

export const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9](?:[a-z0-9-]{1,28}[a-z0-9])$/, 'use 3–30 lowercase letters, numbers or hyphens');

export const profileSchema = z.object({
  fullName: z.string().trim().min(1, 'is required').max(80),
  headline: text(100),
  location: text(60),
  tagline: text(160),
  intro: text(600),
  about: text(2000),
  focus: text(80),
  stack: text(80),
  signal: text(80),
  status: text(80),
  tags: list(8, 40),
  openTo: list(5, 60),
  currentPosition: text(160),
  roles: z
    .array(z.object({ title: z.string().trim().min(1).max(60), description: text(300) }))
    .max(6)
    .default([]),
  avatarUrl: link,
  email: z.union([z.literal(''), z.string().trim().email().max(120)]).default(''),
  githubUsername: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9-]{0,39}$/, 'must be a GitHub username, not a link')
    .default(''),
  linkedinUrl: link,
  resumeUrl: link,
});

export const projectsSchema = z
  .array(
    z.object({
      title: z.string().trim().min(1, 'is required').max(80),
      category: z.string().trim().toLowerCase().min(1).max(20).default('web'),
      summary: text(400),
      before: text(400),
      built: text(400),
      after: text(400),
      tech: list(12, 30),
      repoUrl: link,
      liveUrl: link,
    }),
  )
  .max(20);

export const skillGroupsSchema = z
  .array(
    z.object({
      name: z.string().trim().min(1, 'is required').max(40),
      description: text(200),
      items: list(15, 40),
    }),
  )
  .max(10);

export const experiencesSchema = z
  .array(
    z.object({
      role: z.string().trim().min(1, 'is required').max(80),
      organization: z.string().trim().min(1, 'is required').max(80),
      location: text(60),
      period: text(40),
      points: list(6, 300),
    }),
  )
  .max(10);

export const certificatesSchema = z
  .array(
    z.object({
      name: z.string().trim().min(1, 'is required').max(100),
      issuer: text(80),
      date: text(30),
      url: link,
      imageUrl: link,
    }),
  )
  .max(20);

export const contactSchema = z.object({
  name: z.string().trim().min(1, 'is required').max(80),
  email: z.string().trim().email().max(120),
  message: z.string().trim().min(5, 'is too short').max(2000),
});

export const accessRequestSchema = z.object({
  name: z.string().trim().min(1, 'is required').max(80),
  email: z.string().trim().toLowerCase().email().max(120),
  slug: slugSchema,
  reason: text(500),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  accessKey: z.string().trim().min(10).max(100),
});
