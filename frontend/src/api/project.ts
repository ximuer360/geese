import axios from 'axios';

// 创建 axios 实例并配置基础 URL
const api = axios.create({
  baseURL: 'http://localhost:5001', // 直接使用后端服务器地址
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 添加请求拦截器
api.interceptors.request.use(
  config => {
    console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
    return config;
  },
  error => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// 添加响应拦截器
api.interceptors.response.use(
  response => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  error => {
    if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused. Is the backend server running?');
      return Promise.reject(new Error('无法连接到服务器，请确保后端服务正在运行'));
    }
    console.error('API Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export interface ProjectsResponse {
  data: any[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface ProjectsParams {
  page?: number;
  pageSize?: number;
  tag?: string;
  search?: string;
}

// API 接口
export const getProjects = async (params: ProjectsParams = {}) => {
  const response = await api.get<ProjectsResponse>('/projects', { params });
  return response.data;
};

export const getProject = async (id: string) => {
  const response = await api.get(`/projects/${id}`);
  return response.data;
};

export const createProject = async (data: any) => {
  const response = await api.post('/projects', data);
  return response.data;
};

export const updateProject = async (id: string, data: any) => {
  const response = await api.put(`/projects/${id}`, data);
  return response.data;
};

export const deleteProject = async (id: string) => {
  const response = await api.delete(`/projects/${id}`);
  return response.data;
};

export const getProjectsByTag = async (tagId: string) => {
  const response = await api.get(`/tags/${tagId}/projects`);
  return response.data;
}; 