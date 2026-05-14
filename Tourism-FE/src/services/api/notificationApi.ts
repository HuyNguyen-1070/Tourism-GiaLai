import api from '@/services/axiosClient';
import { Notification } from '@/types/notification';

export const notificationApi = {
  getMyNotifications: (params?: { page?: number; size?: number; isRead?: boolean }) =>
    api.get<{ content: Notification[]; totalElements: number; totalPages: number }>(
      '/notifications/me',
      { params }
    ),
  markAsRead: (notificationId: string) => api.patch(`/notifications/${notificationId}/read`),
};
