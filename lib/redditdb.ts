import { PrismaClient } from '@prisma/client';

// Extend the global type
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Create prisma client or reuse existing one
const prisma = global.prisma || new PrismaClient({
  log: ['error'],
});

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma;
