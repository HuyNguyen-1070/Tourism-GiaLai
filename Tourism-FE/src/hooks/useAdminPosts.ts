import { useState, useCallback } from 'react';
import { adminApi } from '../services/api/adminApi';
import { Post } from '@/types/post';
import { useToast } from '@/components/common/ToastNotification';

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && error !== null) {
    const apiError = error as { response?: { data?: { message?: string } } };
    return apiError.response?.data?.message || fallback;
  }
  return fallback;
};

export const useAdminPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  });
  const { showToast } = useToast();

  const fetchPendingPosts = useCallback(
    async (page = 0, keyword?: string, tags?: string) => {
      setLoading(true);
      try {
        const res = await adminApi.getPendingPosts({
          page,
          size: 10,
          status: 'PENDING',
          keyword,
          tags,
        });
        setPosts(res.data.content);
        setPagination({
          page: res.data.page,
          size: res.data.size,
          totalElements: res.data.totalElements,
          totalPages: res.data.totalPages,
        });
      } catch (err: unknown) {
        const message = getErrorMessage(err, 'Không thể tải danh sách bài chờ duyệt');
        showToast(message, 'error');
      } finally {
        setLoading(false);
      }
    },
    [showToast]
  );

  const approvePost = useCallback(
    async (postId: string) => {
      try {
        await adminApi.approvePost(postId);
        showToast('Đã phê duyệt bài viết', 'success');
        await fetchPendingPosts();
        return true;
      } catch (err: unknown) {
        const message = getErrorMessage(err, 'Phê duyệt thất bại');
        showToast(message, 'error');
        return false;
      }
    },
    [fetchPendingPosts, showToast]
  );

  const rejectPost = useCallback(
    async (postId: string, reason: string) => {
      try {
        await adminApi.rejectPost(postId, reason);
        showToast('Đã từ chối bài viết', 'success');
        await fetchPendingPosts();
        return true;
      } catch (err: unknown) {
        const message = getErrorMessage(err, 'Từ chối thất bại');
        showToast(message, 'error');
        return false;
      }
    },
    [fetchPendingPosts, showToast]
  );

  return { posts, loading, pagination, fetchPendingPosts, approvePost, rejectPost };
};
