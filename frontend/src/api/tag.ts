import axios from '@/api/axios';

export interface Tag {
  id: string;
  name: string;
  nameEn: string;
  slug: string;
  _count?: {
    projects: number;
  };
}

export interface TagCategory {
  name: string;
  items: {
    id: string;
    name: string;
    count: number;
  }[];
}

// 获取所有标签
export const getTags = async () => {
  const response = await axios.get<Tag[]>('/tags');
  return response.data;
};

// 获取标签分类统计（用于前台展示）
export const getTagCategories = async () => {
  const response = await axios.get<TagCategory[]>('/tags/categories');
  return response.data;
};

// 创建标签
export const createTag = async (data: Omit<Tag, 'id'>) => {
  const response = await axios.post<Tag>('/tags', data);
  return response.data;
};

// 更新标签
export const updateTag = async (id: string, data: Partial<Tag>) => {
  const response = await axios.put<Tag>(`/tags/${id}`, data);
  return response.data;
};

// 删除标签
export const deleteTag = async (id: string) => {
  const response = await axios.delete(`/tags/${id}`);
  return response.data;
};

// 获取管理后台的标签分类
export const getAdminTags = async () => {
  const response = await axios.get<TagCategory[]>('/tags/admin');
  return response.data;
}; 