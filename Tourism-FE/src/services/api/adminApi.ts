import api from '../axiosClient';
import {
  UserSummary,
  UserDetail,
  OverviewStats,
  PostActivity,
  TrendingTag,
  PostEngagement,
  AdminLog,
} from '@/types/admin';
import { PaginatedResponse } from '@/types/content';

export interface TagAdminResponse {
  id: string;
  name: string;
  postCount: number;
}

export interface LocationRequest {
  postId: string;
  name: string;
  address?: string;
  latitude: number;
  longitude: number;
  placeId?: string;
}

export const adminApi = {
  // User Management
  getUsers: (params: any) => api.get<PaginatedResponse<UserSummary>>('/admin/users', { params }),

  getUserDetail: (userId: string) => api.get<UserDetail>(`/admin/users/${userId}`),

  toggleActive: (userId: string) => api.patch(`/admin/users/${userId}/toggle-active`),

  assignRole: (userId: string, data: { roleName: string; action: 'GRANT' | 'REVOKE' }) =>
    api.patch(`/admin/users/${userId}/role`, data),

  // Post Management
  getPosts: (params: any) => api.get<PaginatedResponse<any>>('/admin/posts', { params }),

  approvePost: (postId: string) => api.patch(`/admin/posts/${postId}/approve`),

  rejectPost: (postId: string, data: { reason: string }) =>
    api.patch(`/admin/posts/${postId}/reject`, data),

  deletePost: (postId: string) => api.delete(`/admin/posts/${postId}`),

  // Tag Management
  getTags: (keyword?: string) =>
    api.get<TagAdminResponse[]>('/admin/tags', { params: { keyword } }),

  createTag: (name: string) => api.post('/admin/tags', { name }),

  updateTag: (tagId: string, name: string) => api.put(`/admin/tags/${tagId}`, { name }),

  deleteTag: (tagId: string) => api.delete(`/admin/tags/${tagId}`),

  // Location Management
  createLocation: (data: LocationRequest) => api.post('/admin/locations', data),

  updateLocation: (id: string, data: Partial<LocationRequest>) =>
    api.put(`/admin/locations/${id}`, data),

  deleteLocation: (id: string) => api.delete(`/admin/locations/${id}`),

  // Statistics
  getOverview: () => api.get<OverviewStats>('/admin/statistics/overview'),

  getPostActivity: (month: number, year: number) =>
    api.get<PostActivity>('/admin/statistics/posts-activity', { params: { month, year } }),

  getTrendingTags: (period: string, limit: number = 10) =>
    api.get<{ tags: TrendingTag[] }>('/admin/statistics/trending-tags', {
      params: { period, limit },
    }),

  getPostEngagement: (period: string, tags?: string[], limit: number = 10) =>
    api.get<{ posts: PostEngagement[] }>('/admin/statistics/post-engagement', {
      params: { period, tags: tags?.join(','), limit },
    }),

  // Admin Logs
  getLogs: (params: any) => api.get<PaginatedResponse<AdminLog>>('/admin/logs', { params }),
};
