-- CreateEnum
CREATE TYPE "Role" AS ENUM ('OWNER', 'MEMBER', 'DEMO');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'MEMBER',
    "accessKeyHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "headline" TEXT NOT NULL DEFAULT '',
    "location" TEXT NOT NULL DEFAULT '',
    "tagline" TEXT NOT NULL DEFAULT '',
    "intro" TEXT NOT NULL DEFAULT '',
    "about" TEXT NOT NULL DEFAULT '',
    "focus" TEXT NOT NULL DEFAULT '',
    "stack" TEXT NOT NULL DEFAULT '',
    "signal" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT '',
    "tags" TEXT[],
    "roles" JSONB NOT NULL DEFAULT '[]',
    "avatarUrl" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "githubUsername" TEXT NOT NULL DEFAULT '',
    "linkedinUrl" TEXT NOT NULL DEFAULT '',
    "resumeUrl" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'web',
    "summary" TEXT NOT NULL DEFAULT '',
    "before" TEXT NOT NULL DEFAULT '',
    "built" TEXT NOT NULL DEFAULT '',
    "after" TEXT NOT NULL DEFAULT '',
    "tech" TEXT[],
    "repoUrl" TEXT NOT NULL DEFAULT '',
    "liveUrl" TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillGroup" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "items" TEXT[],
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SkillGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experience" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "location" TEXT NOT NULL DEFAULT '',
    "period" TEXT NOT NULL DEFAULT '',
    "points" TEXT[],
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certificate" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "issuer" TEXT NOT NULL DEFAULT '',
    "date" TEXT NOT NULL DEFAULT '',
    "url" TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessRequest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "reason" TEXT NOT NULL DEFAULT '',
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "AccessRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_slug_key" ON "User"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE INDEX "Project_userId_idx" ON "Project"("userId");

-- CreateIndex
CREATE INDEX "SkillGroup_userId_idx" ON "SkillGroup"("userId");

-- CreateIndex
CREATE INDEX "Experience_userId_idx" ON "Experience"("userId");

-- CreateIndex
CREATE INDEX "Certificate_userId_idx" ON "Certificate"("userId");

-- CreateIndex
CREATE INDEX "ContactMessage_userId_idx" ON "ContactMessage"("userId");

-- CreateIndex
CREATE INDEX "AccessRequest_status_idx" ON "AccessRequest"("status");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillGroup" ADD CONSTRAINT "SkillGroup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactMessage" ADD CONSTRAINT "ContactMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
