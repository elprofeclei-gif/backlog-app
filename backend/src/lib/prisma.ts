import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// 1. Crear el adaptador pasándole la URL de tu .env
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });

// 2. Pasar el adaptador a PrismaClient
export const prisma = new PrismaClient({ adapter });
