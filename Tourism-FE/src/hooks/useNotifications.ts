import { useState, useEffect, useCallback } from 'react';
import { notificationApi } from '../services/api/notificationApi';
import { Notification } from '../types/notification';
import { useToast } from '@/components/common/ToastNotification';

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && error !== null) {
    const apiError = error as { response?: { data?: { message?: string } } };
    return apiError.response?.data?.message || fallback;
  }
  return fallback;
};

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { showToast } = useToast();

  const fetchNotifications = useCallback(
    async (page = 0) => {
      setLoading(true);
      try {
        const res = await notificationApi.getMyNotifications({ page, size: 20 });
        setNotifications(res.data.content);
        setUnreadCount(res.data.content.filter((n) => !n.isRead).length);
      } catch (err: unknown) {
        const message = getErrorMessage(err, 'Không thể tải thông báo');
        showToast(message, 'error');
      } finally {
        setLoading(false);
      }
    },
    [showToast]
  );

  const markAsRead = useCallback(
    async (notificationId: string) => {
      try {
        await notificationApi.markAsRead(notificationId);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (err: unknown) {
        const message = getErrorMessage(err, 'Không thể đánh dấu đã đọc');
        showToast(message, 'error');
      }
    },
    [showToast]
  );

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return { notifications, loading, unreadCount, fetchNotifications, markAsRead };
};
