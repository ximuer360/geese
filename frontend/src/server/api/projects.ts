import { PrismaClient } from '@prisma/client';
import type { Request, Response } from 'express';

const prisma = new PrismaClient();

export const createProject = async (req: Request, res: Response) => {
  try {
    const { name, description, repoUrl, language, tags = [] } = req.body;

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
    res.status(500).json({ error: error.message });
  }
};

export const getProjects = async (req: Request, res: Response) => {
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
    res.status(500).json({ error: error.message });
  }
}; 