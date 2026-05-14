import { CreatePostPayload, Post, PostListResponse, UpdatePostPayload } from '@/types/post';
import api from '../axiosClient';

export const postApi = {
  createPost: (data: CreatePostPayload) => api.post<Post>('/posts', data),
  updatePost: (postId: string, data: UpdatePostPayload) => api.put<Post>(`/posts/${postId}`, data),
  deletePost: (postId: string) => api.delete(`/posts/${postId}`),
  getMyPosts: (params?: { page?: number; size?: number; status?: string; keyword?: string }) =>
    api.get<PostListResponse>('/posts/me', { params }),
  getPostById: (postId: string) => api.get<Post>(`/posts/${postId}`),
};
