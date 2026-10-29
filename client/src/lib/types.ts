export interface RoleCard { title: string; description: string }

export interface Profile {
  fullName: string;
  headline: string;
  location: string;
  tagline: string;
  intro: string;
  about: string;
  focus: string;
  stack: string;
  signal: string;
  status: string;
  tags: string[];
  openTo: string[];
  currentPosition: string;
  roles: RoleCard[];
  avatarUrl: string;
  email: string;
  githubUsername: string;
  linkedinUrl: string;
  resumeUrl: string;
}

export interface Project {
  title: string;
  category: string;
  summary: string;
  before: string;
  built: string;
  after: string;
  tech: string[];
  repoUrl: string;
  liveUrl: string;
}

export interface SkillGroup { name: string; description: string; items: string[] }

export interface Experience {
  role: string;
  organization: string;
  location: string;
  period: string;
  points: string[];
}

export interface Certificate { name: string; issuer: string; date: string; url: string; imageUrl: string }

export interface Portfolio {
  slug: string;
  role: 'OWNER' | 'MEMBER' | 'DEMO';
  profile: Profile;
  projects: Project[];
  skillGroups: SkillGroup[];
  experiences: Experience[];
  certificates: Certificate[];
}

export interface SessionUser { email: string; slug: string; role: 'OWNER' | 'MEMBER' | 'DEMO'; fullName: string }

export interface Message { id: string; name: string; email: string; message: string; read: boolean; createdAt: string }

export interface AccessRequest {
  id: string;
  name: string;
  email: string;
  slug: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface Member {
  id: string;
  email: string;
  slug: string;
  role: 'OWNER' | 'MEMBER';
  createdAt: string;
  profile: { fullName: string } | null;
}
