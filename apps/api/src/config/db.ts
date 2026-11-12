import { PrismaClient } from '@prisma/client';
import { env } from './env.js';

let prismaInstance: PrismaClient | null = null;

export function getDbClient(): PrismaClient {
  if (prismaInstance) {
    return prismaInstance;
  }

  if (!env.databaseUrl) {
    throw new Error(
      'DATABASE_URL is not set. Please configure DATABASE_URL in apps/api/.env to connect to Supabase PostgreSQL.'
    );
  }

  prismaInstance = new PrismaClient({
    log: env.isProduction ? ['error'] : ['query', 'info', 'warn', 'error'],
  });

  return prismaInstance;
}

