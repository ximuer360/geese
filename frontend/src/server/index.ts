import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { createProject, getProjects } from './api/projects';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// 项目相关路由
app.post('/api/projects', createProject);
app.get('/api/projects', getProjects);

// 错误处理中间件
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 