import 'dotenv/config';
import { createApp } from './app.js';
import { env } from './config/env.js';
import { prisma } from './lib/prisma.js';

const app = createApp();

async function startServer() {
  try {
    await prisma.$connect();

    app.listen(env.PORT, () => {
      console.log(`PortfolioOS API running on http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

void startServer();

process.on('SIGINT', () => {
  void prisma.$disconnect().finally(() => process.exit(0));
});

process.on('SIGTERM', () => {
  void prisma.$disconnect().finally(() => process.exit(0));
});
