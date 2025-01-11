import axios from 'axios';

// 创建 axios 实例并配置基础 URL
const api = axios.create({
  baseURL: 'http://localhost:5001',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 添加响应拦截器用于调试
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

interface ProjectForm {
  name: string;
  description: string;
  repoUrl: string;
  language: string;
  tags: string[];
}

export const createProject = async (data: ProjectForm) => {
  const response = await api.post('/api/projects', data);
  return response.data;
};

export const getProjects = async () => {
  const response = await api.get('/api/projects');
  return response.data;
};

export const updateProject = async (id: string, data: ProjectForm) => {
  const response = await api.put(`/api/projects/${id}`, data);
  return response.data;
};

export const deleteProject = async (id: string) => {
  const response = await api.delete(`/api/projects/${id}`);
  return response.data;
}; 