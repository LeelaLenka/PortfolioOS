/**
 * Seed script: run once after the first migration.
 *   npm run db:seed              creates the owner + demo portfolios, prints the owner access key
 *   npm run db:seed -- --reset   also issues a NEW owner access key (if you lose yours)
 *
 * Safe to run again: it never overwrites the owner's edited content.
 */
import 'dotenv/config';
import { prisma } from '../src/lib/prisma.js';
import { generateAccessKey, hashAccessKey } from '../src/utils/keys.js';

const OWNER_EMAIL = (process.env.OWNER_EMAIL ?? '').trim().toLowerCase();
const OWNER_SLUG = (process.env.OWNER_SLUG ?? 'owner').trim().toLowerCase();
const RESET = process.argv.includes('--reset');

// ---------- Owner: starting content taken from the resume (edit it any time in the Studio) ----------
const owner = {
  profile: {
    fullName: 'Lenka Leela Krishna Sai Bharat',
    headline: 'Software Engineer and AI/ML Student',
    location: 'Andhra Pradesh, India',
    tagline: 'Bharat builds full-stack web apps on real databases.',
    intro:
      'I design REST APIs, data models and React interfaces, and ship them to the cloud. Currently a B.Tech CSE (AI & ML) student at SRM, graduating May 2028.',
    about:
      'I’m a Computer Science (AI & ML) student at SRM Institute of Science and Technology and a MongoDB Associate Developer. I like the part of software where data meets people: designing the schema, writing the API around it, and building an interface that makes it feel simple. I’ve built a campus social network on the MERN stack, a Spring Boot inventory system on MySQL and MongoDB, and this portfolio platform on PostgreSQL with Prisma.',
    focus: 'Full-stack web apps',
    stack: 'MERN, Spring Boot, Prisma',
    signal: 'MongoDB Associate Developer',
    status: 'Open to SWE internships, Jan 2027',
    tags: ['Full-stack', 'Backend', 'Databases'],
    openTo: ['Software Development Engineer', 'AI/ML Engineer', 'Database Engineer'],
    currentPosition: 'B.Tech CSE (AI & ML) student at SRM, building full-stack and AI projects',
    roles: [
      { title: 'Full-stack developer', description: 'Builds complete web apps: React front ends, Node.js and Express APIs, and the database underneath.' },
      { title: 'Backend engineer', description: 'Designs REST APIs, authentication and data models in Node.js and Java Spring Boot.' },
      { title: 'AI & data student', description: 'Studies machine learning and works with data preprocessing, feature engineering and model evaluation.' },
    ],
    email: OWNER_EMAIL,
    githubUsername: 'LeelaLenka',
    linkedinUrl: 'https://www.linkedin.com/in/lenka-leela-krishna-sai-bharat-83444933b',
  },
  skillGroups: [
    { name: 'Design', description: 'Plan the data structures, algorithms and architecture first.', items: ['Data Structures & Algorithms', 'OOP', 'Software Design', 'DBMS'] },
    { name: 'Store', description: 'Model data in the database that fits the problem.', items: ['MongoDB', 'MongoDB Atlas', 'Mongoose', 'PostgreSQL', 'MySQL', 'Prisma'] },
    { name: 'Serve', description: 'Expose it through secure, validated APIs.', items: ['Node.js', 'Express.js', 'Spring Boot', 'REST APIs', 'JWT'] },
    { name: 'Interface', description: 'Build the screens people actually use.', items: ['React.js', 'TypeScript', 'Vite', 'Tailwind CSS'] },
    { name: 'Ship', description: 'Version, test and deploy to the cloud.', items: ['Git', 'GitHub', 'Postman', 'Vercel', 'Render'] },
    { name: 'Learn from data', description: 'Turn data into predictions and insight.', items: ['Python', 'Scikit-learn', 'Feature Engineering', 'Gemini API'] },
  ],
  projects: [
    {
      title: 'UniLink',
      category: 'web',
      summary: 'A full-stack campus social network for students.',
      before: 'Students had no single place to find classmates, form groups and follow campus events.',
      built: 'React and Vite front end, Node.js and Express REST API, Mongoose models on MongoDB Atlas, JWT authentication and bcrypt hashing.',
      after: 'Students can post, connect, join groups and manage events in one deployed app.',
      tech: ['React', 'Node.js', 'Express', 'MongoDB Atlas', 'JWT'],
      repoUrl: 'https://github.com/LeelaLenka/Unilink',
      liveUrl: 'https://unilink-lrhv.vercel.app',
    },
    {
      title: 'PortfolioOS',
      category: 'web',
      summary: 'A multi-user portfolio platform: anyone can request a portfolio, and the owner approves access.',
      before: 'Updating a portfolio meant editing code and redeploying for every change.',
      built: 'React and TypeScript front end, Express API with Prisma on Neon PostgreSQL, access-key login and an approval workflow.',
      after: 'Content is edited from a browser, and each approved member gets their own public page.',
      tech: ['React', 'TypeScript', 'Express', 'Prisma', 'PostgreSQL'],
      repoUrl: 'https://github.com/LeelaLenka/PortfolioOS',
      liveUrl: '',
    },
    {
      title: 'Retail Inventory Management System',
      category: 'backend',
      summary: 'Final project of the IBM Java Developer program.',
      before: 'Stores needed one system to track products, stock levels and customer reviews.',
      built: 'Layered Spring Boot backend: entities, repositories, services and REST controllers, with MySQL through JPA/Hibernate and reviews in MongoDB.',
      after: 'Products, inventory and stores are managed through validated REST endpoints.',
      tech: ['Java', 'Spring Boot', 'MySQL', 'MongoDB'],
      repoUrl: 'https://github.com/LeelaLenka/java-database-final',
      liveUrl: '',
    },
    {
      title: 'Orbit',
      category: 'ai',
      summary: 'An AI travel companion built at the Voyage 3.0 hackathon.',
      before: 'Planning a trip meant juggling separate sites for itineraries, costs and local rules.',
      built: 'React and TypeScript app using the Gemini API for itineraries, cost breakdowns and local guidance, plus Google Maps.',
      after: 'Travellers get a plan for any city from one search.',
      tech: ['React', 'TypeScript', 'Gemini API'],
      repoUrl: 'https://github.com/LeelaLenka/Orbit-An-AI-Travel-Companion-',
      liveUrl: '',
    },
    {
      title: 'UNeeds',
      category: 'web',
      summary: 'A campus delivery web app built at the VibeCraft hackathon.',
      before: 'Students had no simple way to request deliveries around campus.',
      built: 'Responsive interfaces and a streamlined delivery request workflow.',
      after: 'Requests can be placed and tracked from a phone.',
      tech: ['JavaScript', 'HTML', 'CSS'],
      repoUrl: 'https://github.com/LeelaLenka/u-needs',
      liveUrl: 'https://u-needs.vercel.app',
    },
  ],
  experiences: [
    {
      role: 'AI & Data Science Intern',
      organization: 'IDRA',
      location: '',
      period: '',
      points: ['Completed an internship in AI and data science.'],
    },
  ],
  certificates: [
    { name: 'MongoDB Associate Developer', issuer: 'MongoDB, Inc.', date: '', url: '', imageUrl: '' },
    { name: 'Advanced Java Concepts', issuer: 'Coursera', date: '', url: '', imageUrl: '' },
  ],
};

// ---------- Demo: a fictional person whose portfolio new visitors see at /demo ----------
const demo = {
  profile: {
    fullName: 'Jordan Ellis',
    headline: 'Backend Engineer',
    location: 'Toronto, Canada',
    tagline: 'Jordan Ellis builds reliable APIs and data pipelines.',
    intro: 'I turn messy business processes into clean services: well-modelled data, predictable APIs and dashboards people trust.',
    about:
      'This is an example portfolio. Everything here is placeholder content you can replace once your access is approved: your name, your story, your projects and your skills.',
    focus: 'APIs and data systems',
    stack: 'Node.js, Go, PostgreSQL',
    signal: 'Ideas to production',
    status: 'Building',
    tags: ['Backend', 'Data', 'Cloud'],
    openTo: ['Backend Engineer', 'Data Engineer'],
    currentPosition: 'Backend Engineer at Example Corp',
    roles: [
      { title: 'Backend engineer', description: 'Designs services and APIs that stay fast as usage grows.' },
      { title: 'Data engineer', description: 'Builds pipelines that move and clean data on a schedule.' },
      { title: 'Team mentor', description: 'Reviews code and helps new engineers ship their first features.' },
    ],
    email: 'jordan@example.com',
  },
  skillGroups: [
    { name: 'Model', description: 'Design schemas that match the domain.', items: ['PostgreSQL', 'Redis', 'Data Modeling'] },
    { name: 'Serve', description: 'Expose data through fast, secure APIs.', items: ['Node.js', 'Go', 'REST', 'GraphQL'] },
    { name: 'Ship', description: 'Automate builds, tests and deploys.', items: ['Docker', 'GitHub Actions', 'AWS'] },
  ],
  projects: [
    {
      title: 'Invoice Pipeline',
      category: 'data',
      summary: 'An automated pipeline that reads, validates and stores supplier invoices.',
      before: 'Finance staff typed every invoice into a spreadsheet by hand.',
      built: 'A Node.js worker that parses uploaded PDFs, validates totals and writes to PostgreSQL.',
      after: 'Invoices are processed within minutes of arriving, with errors flagged for review.',
      tech: ['Node.js', 'PostgreSQL', 'Docker'],
      repoUrl: '',
      liveUrl: '',
    },
    {
      title: 'Clinic Booking API',
      category: 'backend',
      summary: 'A booking API for a network of small clinics.',
      before: 'Each clinic took appointments by phone, so double bookings were common.',
      built: 'A Go REST API with row-level locking for time slots and SMS reminders.',
      after: 'Patients book online and every clinic sees one shared calendar.',
      tech: ['Go', 'PostgreSQL', 'REST'],
      repoUrl: '',
      liveUrl: '',
    },
    {
      title: 'Team Metrics Dashboard',
      category: 'web',
      summary: 'A dashboard showing delivery metrics across engineering teams.',
      before: 'Managers pulled numbers from three tools every week.',
      built: 'A React dashboard fed by a nightly job that aggregates issue-tracker data.',
      after: 'One page answers the weekly status questions.',
      tech: ['React', 'TypeScript', 'GraphQL'],
      repoUrl: '',
      liveUrl: '',
    },
  ],
  experiences: [
    {
      role: 'Backend Engineer',
      organization: 'Example Corp',
      location: 'Toronto',
      period: '2023 – Present',
      points: ['Owns the payments API used by three product teams.', 'Cut nightly batch time by moving jobs to a queue.'],
    },
  ],
  certificates: [{ name: 'Example Cloud Certification', issuer: 'Example Institute', date: '2024', url: '', imageUrl: '' }],
};

type Content = typeof owner | typeof demo;

async function writeContent(userId: string, c: Content) {
  await prisma.profile.upsert({ where: { userId }, create: { ...c.profile, userId }, update: c.profile });
  await prisma.$transaction([
    prisma.project.deleteMany({ where: { userId } }),
    prisma.skillGroup.deleteMany({ where: { userId } }),
    prisma.experience.deleteMany({ where: { userId } }),
    prisma.certificate.deleteMany({ where: { userId } }),
    prisma.project.createMany({ data: c.projects.map((x, order) => ({ ...x, userId, order })) }),
    prisma.skillGroup.createMany({ data: c.skillGroups.map((x, order) => ({ ...x, userId, order })) }),
    prisma.experience.createMany({ data: c.experiences.map((x, order) => ({ ...x, userId, order })) }),
    prisma.certificate.createMany({ data: c.certificates.map((x, order) => ({ ...x, userId, order })) }),
  ]);
}

async function main() {
  if (!OWNER_EMAIL) throw new Error('Set OWNER_EMAIL in server/.env before seeding.');

  // Demo portfolio: always reset to the example content
  const demoUser = await prisma.user.upsert({
    where: { slug: 'demo' },
    create: { email: 'demo@portfolioos.example', slug: 'demo', role: 'DEMO' },
    update: {},
  });
  await writeContent(demoUser.id, demo);
  console.log('Demo portfolio ready at /demo');

  // Owner: create once; never overwrite content you've edited
  let ownerUser = await prisma.user.findUnique({ where: { email: OWNER_EMAIL } });
  let newKey: string | null = null;

  if (!ownerUser) {
    newKey = generateAccessKey();
    ownerUser = await prisma.user.create({
      data: { email: OWNER_EMAIL, slug: OWNER_SLUG, role: 'OWNER', accessKeyHash: await hashAccessKey(newKey) },
    });
    await writeContent(ownerUser.id, owner);
    console.log('Owner portfolio created with your starting content');
  } else if (RESET || !ownerUser.accessKeyHash) {
    newKey = generateAccessKey();
    await prisma.user.update({ where: { id: ownerUser.id }, data: { accessKeyHash: await hashAccessKey(newKey), role: 'OWNER' } });
  }

  if (newKey) {
    console.log('\n================ OWNER ACCESS KEY (shown once) ================');
    console.log(`Email: ${OWNER_EMAIL}`);
    console.log(`Key:   ${newKey}`);
    console.log('Save this in a password manager. Lost it? Run: npm run db:seed -- --reset');
    console.log('================================================================\n');
  } else {
    console.log('Owner already exists; access key unchanged. Use --reset for a new one.');
  }
}

main()
  .catch((err: unknown) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => void prisma.$disconnect());
