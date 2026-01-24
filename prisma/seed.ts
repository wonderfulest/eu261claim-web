import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

async function main() {
  console.log('开始插入测试数据...');

  // 创建测试短链接
  const shortLink1 = await prisma.shortLink.create({
    data: {
      shortId: 'test123',
      longUrl: 'https://example.com/very-long-url-for-testing',
    },
  });

  console.log('创建短链接:', shortLink1);

  // 创建测试点击事件
  const clickEvent1 = await prisma.clickEvent.create({
    data: {
      shortId: 'test123',
      ipAddress: '192.168.1.0',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      referrer: 'https://google.com',
      utmSource: 'email',
      utmMedium: 'newsletter',
      utmCampaign: 'spring_sale',
    },
  });

  console.log('创建点击事件:', clickEvent1);

  // 创建测试按钮点击
  const buttonClick1 = await prisma.buttonClick.create({
    data: {
      clickEventId: clickEvent1.id,
      shortId: 'test123',
    },
  });

  console.log('创建按钮点击:', buttonClick1);

  console.log('测试数据插入完成！');
}

main()
  .catch((e) => {
    console.error('插入测试数据时出错:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
