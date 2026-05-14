import api from '@/services/axiosClient';
import { PostListResponse } from '@/types/post';

export const adminApi = {
  getPendingPosts: (params?: {
    page?: number;
    size?: number;
    status?: string;
    keyword?: string;
    tags?: string;
  }) => api.get<PostListResponse>('/admin/posts', { params }),
  approvePost: (postId: string) => api.patch(`/admin/posts/${postId}/approve`),
  rejectPost: (postId: string, reason: string) =>
    api.patch(`/admin/posts/${postId}/reject`, { reason }),
  adminDeletePost: (postId: string) => api.delete(`/admin/posts/${postId}`),
};
