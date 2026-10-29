import { prisma } from '../lib/prisma.js';
import type { Prisma } from '../generated/prisma/client.js';
import { HttpError } from '../utils/http.js';
import type { z } from 'zod';
import type {
  certificatesSchema,
  experiencesSchema,
  profileSchema,
  projectsSchema,
  skillGroupsSchema,
} from './validators.js';

const byOrder = { orderBy: { order: 'asc' as const } };

const portfolioInclude = {
  profile: true,
  projects: byOrder,
  skillGroups: byOrder,
  experiences: byOrder,
  certificates: byOrder,
} satisfies Prisma.UserInclude;

type UserWithPortfolio = Prisma.UserGetPayload<{ include: typeof portfolioInclude }>;

/** The shape the frontend renders; strips ids, hashes and internal fields */
function toPublic(user: UserWithPortfolio) {
  const strip = <T extends { id: string; userId: string; order?: number }>(rows: T[]) =>
    rows.map(({ id: _id, userId: _u, order: _o, ...rest }) => rest);
  const { id: _pid, userId: _puid, updatedAt: _upd, ...profile } = user.profile ?? {
    id: '',
    userId: '',
    updatedAt: new Date(),
    fullName: user.slug,
  };
  return {
    slug: user.slug,
    role: user.role,
    profile,
    projects: strip(user.projects),
    skillGroups: strip(user.skillGroups),
    experiences: strip(user.experiences),
    certificates: strip(user.certificates),
  };
}

export const portfolioService = {
  async getOwner() {
    const user = await prisma.user.findFirst({ where: { role: 'OWNER' }, include: portfolioInclude });
    if (!user) throw new HttpError(404, 'This site has not been set up yet.');
    return toPublic(user);
  },

  async getBySlug(slug: string) {
    const user = await prisma.user.findUnique({ where: { slug }, include: portfolioInclude });
    if (!user) throw new HttpError(404, 'No portfolio exists at this address.');
    return toPublic(user);
  },

  async getById(id: string) {
    const user = await prisma.user.findUnique({ where: { id }, include: portfolioInclude });
    if (!user) throw new HttpError(404, 'Account not found.');
    return toPublic(user);
  },

  async saveProfile(userId: string, data: z.infer<typeof profileSchema>) {
    await prisma.profile.upsert({
      where: { userId },
      create: { ...data, userId },
      update: data,
    });
  },

  // Each list section is saved as a whole: the editor sends the full, ordered list.
  async saveProjects(userId: string, items: z.infer<typeof projectsSchema>) {
    await prisma.$transaction([
      prisma.project.deleteMany({ where: { userId } }),
      prisma.project.createMany({ data: items.map((p, order) => ({ ...p, userId, order })) }),
    ]);
  },

  async saveSkillGroups(userId: string, items: z.infer<typeof skillGroupsSchema>) {
    await prisma.$transaction([
      prisma.skillGroup.deleteMany({ where: { userId } }),
      prisma.skillGroup.createMany({ data: items.map((s, order) => ({ ...s, userId, order })) }),
    ]);
  },

  async saveExperiences(userId: string, items: z.infer<typeof experiencesSchema>) {
    await prisma.$transaction([
      prisma.experience.deleteMany({ where: { userId } }),
      prisma.experience.createMany({ data: items.map((e, order) => ({ ...e, userId, order })) }),
    ]);
  },

  async saveCertificates(userId: string, items: z.infer<typeof certificatesSchema>) {
    await prisma.$transaction([
      prisma.certificate.deleteMany({ where: { userId } }),
      prisma.certificate.createMany({ data: items.map((c, order) => ({ ...c, userId, order })) }),
    ]);
  },

  /** Gives a newly approved member a copy of the demo portfolio to edit */
  async cloneDemoInto(tx: Prisma.TransactionClient, userId: string, fullName: string, email: string) {
    const demo = await tx.user.findFirst({ where: { role: 'DEMO' }, include: portfolioInclude });
    const p = demo?.profile;
    await tx.profile.create({
      data: {
        userId,
        fullName,
        email,
        headline: p?.headline ?? '',
        location: p?.location ?? '',
        // The example tagline names the demo person; swap in the new member's name
        tagline: p ? p.tagline.replace(p.fullName, fullName) : '',
        intro: p?.intro ?? '',
        about: p?.about ?? '',
        focus: p?.focus ?? '',
        stack: p?.stack ?? '',
        signal: p?.signal ?? '',
        status: p?.status ?? '',
        tags: p?.tags ?? [],
        roles: (p?.roles ?? []) as Prisma.InputJsonValue,
      },
    });
    if (!demo) return;
    const copy = <T extends { id: string; userId: string }>(rows: T[]) =>
      rows.map(({ id: _id, ...rest }) => ({ ...rest, userId }));
    await tx.project.createMany({ data: copy(demo.projects) });
    await tx.skillGroup.createMany({ data: copy(demo.skillGroups) });
    await tx.experience.createMany({ data: copy(demo.experiences) });
    await tx.certificate.createMany({ data: copy(demo.certificates) });
  },
};
