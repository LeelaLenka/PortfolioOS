import { createApp } from './app.js';
import { env } from './config/env.js';
import { prisma } from './lib/prisma.js';

async function main() {
  await prisma.$connect();
  console.log('Database connected');
  createApp().listen(env.PORT, () => console.log(`PortfolioOS API listening on port ${env.PORT}`));
}

main().catch((err: unknown) => {
  console.error('Failed to start:', err instanceof Error ? err.message : err);
  process.exit(1);
});

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, () => void prisma.$disconnect().finally(() => process.exit(0)));
}
