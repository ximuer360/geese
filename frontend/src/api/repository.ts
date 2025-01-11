import axios from 'axios';
import type { Repository } from '@/types/repository';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export interface RepositoryParams {
  page?: number;
  pageSize?: number;
  sort?: 'latest' | 'hot';
  tag?: string;
  search?: string;
}

export const repositoryApi = {
  async getRepositories(params: RepositoryParams) {
    const { data } = await api.get<{
      data: Repository[];
      total: number;
    }>('/repositories', { params });
    return data;
  },
}; 