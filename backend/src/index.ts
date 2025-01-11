import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

// 更详细的 CORS 配置
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], // 允许的前端地址
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json());

// 添加健康检查接口
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// 获取项目列表
app.get('/api/projects', async (_req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        tags: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(projects);
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: error.message });
  }
});

// 创建新项目
app.post('/api/projects', async (req: Request, res: Response) => {
  try {
    const { name, description, repoUrl, language, tags = [] } = req.body;
    console.log('Creating project:', { name, description, repoUrl, language, tags });

    const project = await prisma.project.create({
      data: {
        name,
        description,
        repoUrl,
        language,
        tags: {
          connectOrCreate: tags.map((tag: string) => ({
            where: { name: tag },
            create: {
              name: tag,
              nameEn: tag,
              slug: tag.toLowerCase()
            }
          }))
        }
      },
      include: {
        tags: true
      }
    });

    res.json(project);
  } catch (error: any) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: error.message });
  }
});

// 更新项目
app.put('/api/projects/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, repoUrl, language, tags = [] } = req.body;
    console.log('Updating project:', id, { name, description, repoUrl, language, tags });

    const project = await prisma.project.update({
      where: { id },
      data: {
        name,
        description,
        repoUrl,
        language,
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
        }
      },
      include: {
        tags: true
      }
    });

    res.json(project);
  } catch (error: any) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: error.message });
  }
});

// 删除项目
app.delete('/api/projects/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log('Deleting project:', id);

    await prisma.project.delete({
      where: { id }
    });

    res.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}); 