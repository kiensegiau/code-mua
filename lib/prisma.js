import { PrismaClient } from '@prisma/client';

// Tạo một instance PrismaClient toàn cục để tránh nhiều kết nối trong development
const globalForPrisma = global;

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma; 