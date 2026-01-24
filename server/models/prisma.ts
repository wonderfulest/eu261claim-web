import { PrismaClient } from '@prisma/client';

// Prisma Client 单例模式
// 避免在开发环境中创建多个实例

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// 优雅关闭
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;
