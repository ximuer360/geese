import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 创建一些初始标签
  const tags = ['JavaScript', 'Python', 'Vue', 'React', 'Node.js'].map(name => ({
    name,
    nameEn: name,
    slug: name.toLowerCase()
  }));

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { name: tag.name },
      update: {},
      create: tag,
    });
  }

  // 创建一些示例项目
  const projects = [
    {
      name: 'Vue.js',
      description: 'Vue.js 是一套用于构建用户界面的渐进式框架。',
      repoUrl: 'https://github.com/vuejs/core',
      language: 'TypeScript',
      stars: 200000,
      tags: ['JavaScript', 'Vue']
    },
    {
      name: 'React',
      description: 'React 是一个用于构建用户界面的 JavaScript 库。',
      repoUrl: 'https://github.com/facebook/react',
      language: 'JavaScript',
      stars: 180000,
      tags: ['JavaScript', 'React']
    }
  ];

  for (const project of projects) {
    await prisma.project.create({
      data: {
        name: project.name,
        description: project.description,
        repoUrl: project.repoUrl,
        language: project.language,
        stars: project.stars,
        tags: {
          connect: project.tags.map(tag => ({ name: tag }))
        }
      }
    });
  }

  console.log('Seed data created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 