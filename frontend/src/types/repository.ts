export interface Repository {
  id: string;
  name: string;
  fullName: string;
  description: string;
  descriptionEn: string;
  url: string;
  stars: number;
  language: string;
  author: string;
  authorAvatar: string;
  isHot: boolean;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  nameEn: string;
  slug: string;
} 