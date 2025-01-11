import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 清理现有数据
  console.log('Cleaning existing data...');
  await prisma.image.deleteMany();
  await prisma.project.deleteMany();
  await prisma.tag.deleteMany();
  
  console.log('Creating test data...');
  
  // 创建测试标签
  const tags = ['Vue', 'React', 'TypeScript'].map(name => ({
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

  // 创建多个测试项目
  const projects = [
    {
      name: '测试项目1',
      description: '这是第一个测试项目的描述',
      repoUrl: 'https://github.com/test/project1',
      language: 'TypeScript',
      stars: 100,
      tags: ['Vue', 'TypeScript'],
      imageUrl: 'https://picsum.photos/800/600?random=1'
    },
    {
      name: '测试项目2',
      description: '这是第二个测试项目的描述',
      repoUrl: 'https://github.com/test/project2',
      language: 'JavaScript',
      stars: 200,
      tags: ['React'],
      imageUrl: 'https://picsum.photos/800/600?random=2'
    }
  ];

  for (const projectData of projects) {
    const project = await prisma.project.create({
      data: {
        name: projectData.name,
        description: projectData.description,
        repoUrl: projectData.repoUrl,
        language: projectData.language,
        stars: projectData.stars,
        tags: {
          connect: projectData.tags.map(tag => ({ name: tag }))
        },
        images: {
          create: [
            {
              url: projectData.imageUrl,
              order: 0
            }
          ]
        }
      },
      include: {
        tags: true,
        images: true
      }
    });

    console.log(`Created project: ${project.name}`);
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 