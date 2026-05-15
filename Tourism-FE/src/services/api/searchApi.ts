import api from '../axiosClient';
import { PaginatedResponse, TagResponse } from '@/types/content';

export interface SearchPostResponse {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  thumbnailUrl: string | null;
  sourceType: 'AUTHOR' | 'EXTERNAL';
  authorUsername: string | null;
  sourceName: string | null;
  viewCount: number;
  likeCount: number;
  favoriteCount: number;
  averageRating: number;
  createdAt: string;
}

export interface SearchParams {
  keyword?: string;
  tags?: string;
  fromDate?: string;
  toDate?: string;
  sort?: string;
  direction?: string;
  page?: number;
  size?: number;
}

export const searchApi = {
  searchPosts: (params: SearchParams) =>
    api.get<PaginatedResponse<SearchPostResponse>>('/posts/search', { params }),

  getAllTags: () => api.get<TagResponse[]>('/tags'),
};
