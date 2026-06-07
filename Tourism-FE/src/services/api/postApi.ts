import { CreatePostPayload, Post, PostListResponse, UpdatePostPayload } from '@/types/post';
import api from '../axiosClient';
import { ApiResponse } from '@/types/auth';

export interface PublicTagResponse {
  id: string;
  name: string;
}

export const postApi = {
  createPost: (data: CreatePostPayload) => api.post<Post>('/posts', data),
  updatePost: (postId: string, data: UpdatePostPayload) => api.put<Post>(`/posts/${postId}`, data),
  deletePost: (postId: string) => api.delete(`/posts/${postId}`),
  getMyPosts: (params?: { page?: number; size?: number; status?: string; keyword?: string }) =>
    api.get<PostListResponse>('/posts/me', { params }),
  getPostById: (postId: string) => api.get<Post>(`/posts/${postId}`),

  // Public tag API - no auth required, accessible by all roles
  getPublicTags: (): Promise<ApiResponse<PublicTagResponse[]>> =>
    api.get('/tags') as any,
};
