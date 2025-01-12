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
app.get('/projects', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const tag = req.query.tag as string;
    const search = req.query.search as string; // 添加搜索参数
    const skip = (page - 1) * pageSize;

    // 构建查询条件
    const where: any = {};
    
    // 标签过滤
    if (tag) {
      where.tags = {
        some: {
          name: tag
        }
      };
    }

    // 搜索条件
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { language: { contains: search } },
        { tags: { some: { name: { contains: search } } } }
      ];
    }

    const projects = await prisma.project.findMany({
      where,
      skip,
      take: pageSize,
      include: {
        tags: {
          select: {
            id: true,
            name: true,
            nameEn: true,
            slug: true
          }
        },
        images: {
          orderBy: {
            order: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // 处理封面图片
    const projectsWithCover = projects.map(project => ({
      ...project,
      coverImage: project.images.length > 0 ? project.images[0].url : null
    }));

    const total = await prisma.project.count({ where });

    return res.json({
      data: projectsWithCover,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    });
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
    const { tags, images, ...projectData } = req.body;
    
    const project = await prisma.project.create({
      data: {
        ...projectData,
        tags: {
          connect: tags.map((tag: any) => ({ id: tag.id }))
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
    return next(error);
  }
});

// 更新项目
app.put('/projects/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { tags, images, ...projectData } = req.body;

    // 先断开所有标签关系
    await prisma.project.update({
      where: { id },
      data: {
        tags: {
          set: [] // 清空现有标签关系
        }
      }
    });

    // 删除现有图片
    await prisma.image.deleteMany({
      where: { projectId: id }
    });

    // 更新项目、重新建立标签关系和添加新图片
    const project = await prisma.project.update({
      where: { id },
      data: {
        ...projectData,
        tags: {
          connect: tags.map((tag: any) => ({ id: tag.id }))
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

// 获取标签及其使用次数
app.get('/tags/count', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const tags = await prisma.tag.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            projects: true
          }
        }
      }
    });

    const tagsWithCount = tags.map(tag => ({
      id: tag.id,
      name: tag.name,
      count: tag._count.projects
    }));

    // 按使用次数排序
    tagsWithCount.sort((a, b) => b.count - a.count);

    return res.json(tagsWithCount);
  } catch (error) {
    return next(error);
  }
});

// 获取标签下的所有项目
app.get('/tags/:id/projects', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    console.log('Fetching projects for tag:', id);
    
    // 修改查询逻辑，使用 prisma 的关系查询
    const projects = await prisma.project.findMany({
      where: {
        tags: {
          some: {
            id: id
          }
        }
      },
      include: {
        tags: true,
        images: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // 获取标签信息
    const tag = await prisma.tag.findUnique({
      where: { id }
    });

    if (!tag) {
      console.log('Tag not found:', id);
      return res.status(404).json({ error: '标签不存在' });
    }

    const response = {
      tag: {
        id: tag.id,
        name: tag.name
      },
      projects: projects
    };
    
    console.log('Found projects:', response.projects.length);
    return res.json(response);
  } catch (error) {
    console.error('Error fetching tag projects:', error);
    return next(error);
  }
});

// 获取标签分类统计
app.get('/tags/categories', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    // 获取所有标签及其使用次数
    const tags = await prisma.tag.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            projects: true
          }
        }
      }
    });

    // 遍历所有标签，根据名称特征进行分类
    const categorizedTags = tags.reduce((acc, tag) => {
      let category = '其他';
      
      // 资源类型
      if (/资源|网盘|B站|壁纸|课程/.test(tag.name)) {
        category = '资源类型';
      }
      // 技术栈
      else if (/Vue|React|TypeScript|JavaScript|Java|Python|Go|Ruby|PHP|C\+\+|Swift|Kotlin|test/.test(tag.name)) {
        category = '技术栈';
      }
      // 地区
      else if (/欧洲|美洲|亚洲|非洲|大洋洲|中国|日本|韩国|英国|法国|德国|魔法英语/.test(tag.name)) {
        category = '地区';
      }

      if (!acc[category]) {
        acc[category] = [];
      }
      
      acc[category].push({
        id: tag.id,
        name: tag.name,
        count: tag._count.projects
      });

      return acc;
    }, {} as Record<string, any[]>);

    // 转换为数组格式并按项目数量排序
    const categories = Object.entries(categorizedTags).map(([name, items]) => ({
      name,
      items: items.sort((a, b) => b.count - a.count)
    }));

    // 按分类名称排序，确保"其他"分类在最后
    categories.sort((a, b) => {
      if (a.name === '其他') return 1;
      if (b.name === '其他') return -1;
      return a.name.localeCompare(b.name);
    });

    return res.json(categories);
  } catch (error) {
    return next(error);
  }
});

// 获取所有标签
app.get('/tags', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const tags = await prisma.tag.findMany({
      select: {
        id: true,
        name: true,
        nameEn: true,
        slug: true,
        _count: {
          select: {
            projects: true
          }
        }
      }
    });
    return res.json(tags);
  } catch (error) {
    return next(error);
  }
});

// 创建标签
app.post('/tags', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, nameEn, slug } = req.body;
    const tag = await prisma.tag.create({
      data: {
        name,
        nameEn,
        slug
      }
    });
    return res.json(tag);
  } catch (error) {
    return next(error);
  }
});

// 更新标签
app.put('/tags/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, nameEn, slug } = req.body;
    const tag = await prisma.tag.update({
      where: { id },
      data: {
        name,
        nameEn,
        slug
      }
    });
    return res.json(tag);
  } catch (error) {
    return next(error);
  }
});

// 删除标签
app.delete('/tags/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.tag.delete({
      where: { id }
    });
    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
});

// 修改获取所有标签的接口，添加分类信息
app.get('/tags/admin', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    // 获取所有标签及其使用次数
    const tags = await prisma.tag.findMany({
      select: {
        id: true,
        name: true,
        nameEn: true,
        slug: true,
        _count: {
          select: {
            projects: true
          }
        }
      }
    });

    // 遍历所有标签，根据名称特征进行分类
    const categorizedTags = tags.reduce((acc, tag) => {
      let category = '其他';
      
      // 资源类型
      if (/资源|网盘|B站|壁纸|课程/.test(tag.name)) {
        category = '资源类型';
      }
      // 技术栈
      else if (/Vue|React|TypeScript|JavaScript|Java|Python|Go|Ruby|PHP|C\+\+|Swift|Kotlin|test/.test(tag.name)) {
        category = '技术栈';
      }
      // 地区
      else if (/欧洲|美洲|亚洲|非洲|大洋洲|中国|日本|韩国|英国|法国|德国|魔法英语/.test(tag.name)) {
        category = '地区';
      }

      if (!acc[category]) {
        acc[category] = [];
      }
      
      acc[category].push({
        id: tag.id,
        name: tag.name,
        nameEn: tag.nameEn,
        slug: tag.slug,
        count: tag._count.projects
      });

      return acc;
    }, {} as Record<string, any[]>);

    // 转换为数组格式
    const categories = Object.entries(categorizedTags).map(([name, items]) => ({
      name,
      items: items.sort((a, b) => b.count - a.count) // 按项目数量排序
    }));

    // 按分类名称排序，确保"其他"分类在最后
    categories.sort((a, b) => {
      if (a.name === '其他') return 1;
      if (b.name === '其他') return -1;
      return a.name.localeCompare(b.name);
    });

    return res.json(categories);
  } catch (error) {
    return next(error);
  }
});

// 添加登录验证接口
app.post('/auth/login', (req: Request, res: Response) => {
  const { password } = req.body;
  const correctPassword = process.env.ADMIN_PASSWORD;

  if (password === correctPassword) {
    res.json({ 
      success: true,
      token: 'admin_token' // 在实际生产环境中应该使用 JWT
    });
  } else {
    res.status(401).json({ 
      success: false,
      error: '密码错误' 
    });
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