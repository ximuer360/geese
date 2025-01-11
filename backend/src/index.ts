import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

// 增加请求体大小限制
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 错误处理中间件
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// CORS 配置
app.use(cors({
  origin: ['http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json());

// 健康检查
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// 获取项目列表
app.get('/projects', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('Fetching projects...');
    const projects = await prisma.project.findMany({
      include: {
        tags: true,
        images: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    console.log('Found projects:', projects);
    return res.json(projects);
  } catch (error) {
    return next(error);
  }
});

// 获取单个项目
app.get('/projects/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        tags: true,
        images: true
      }
    });

    if (!project) {
      return res.status(404).json({ error: '项目不存在' });
    }

    return res.json(project);
  } catch (error) {
    return next(error);
  }
});

// 创建新项目
app.post('/projects', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, repoUrl, language, tags = [], images = [] } = req.body;
    
    // 确保至少有一张图片作为封面
    const coverImage = images[0]?.url || null;
    
    const project = await prisma.project.create({
      data: {
        name,
        description,
        repoUrl,
        language,
        coverImage,
        tags: {
          connectOrCreate: tags.map((tag: string) => ({
            where: { name: tag },
            create: {
              name: tag,
              nameEn: tag,
              slug: tag.toLowerCase()
            }
          }))
        },
        images: {
          create: images.map((image: { url: string }, index: number) => ({
            url: image.url,
            order: index,
            isCover: index === 0 // 第一张图片作为封面
          }))
        }
      },
      include: {
        tags: true,
        images: true
      }
    });

    return res.json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    return next(error);
  }
});

// 更新项目
app.put('/projects/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, description, repoUrl, language, tags = [], images = [] } = req.body;

    // 更新封面图
    const coverImage = images[0]?.url || null;

    // 先删除所有现有图片
    await prisma.image.deleteMany({
      where: { projectId: id }
    });

    const project = await prisma.project.update({
      where: { id },
      data: {
        name,
        description,
        repoUrl,
        language,
        coverImage,
        tags: {
          set: [], // 先清除所有标签
          connectOrCreate: tags.map((tag: string) => ({
            where: { name: tag },
            create: {
              name: tag,
              nameEn: tag,
              slug: tag.toLowerCase()
            }
          }))
        },
        images: {
          create: images.map((image: { url: string }, index: number) => ({
            url: image.url,
            order: index,
            isCover: index === 0
          }))
        }
      },
      include: {
        tags: true,
        images: true
      }
    });

    return res.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    return next(error);
  }
});

// 删除项目
app.delete('/projects/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    console.log('Deleting project:', id);

    await prisma.project.delete({
      where: { id }
    });

    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
});

// 添加测试数据接口
app.post('/api/test-data', async (_req: Request, res: Response) => {
  try {
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

    // 创建测试项目
    const project = await prisma.project.create({
      data: {
        name: '测试项目',
        description: '这是一个测试项目的描述',
        repoUrl: 'https://github.com/test/project',
        language: 'TypeScript',
        stars: 100,
        tags: {
          connect: [{ name: 'Vue' }, { name: 'TypeScript' }]
        },
        images: {
          create: [
            {
              url: 'https://picsum.photos/800/600',
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

    res.json(project);
  } catch (error: any) {
    console.error('Error creating test data:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}).on('error', (error: any) => {
  console.error('Server failed to start:', error);
  process.exit(1);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing HTTP server...');
  prisma.$disconnect();
  process.exit(0);
}); 