import { useState, useEffect, useCallback } from 'react';
import { postApi } from '@/services/api/postApi';
import { Post, CreatePostPayload, UpdatePostPayload, PostListResponse } from '@/types/post';
import { useToast } from '@/components/common/ToastNotification';

interface ApiResponse<T> {
  code: number;
  status: string;
  message: string;
  data: T;
}

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && error !== null) {
    const apiError = error as { response?: { data?: { message?: string } } };
    return apiError.response?.data?.message || fallback;
  }
  return fallback;
};

export const usePosts = (initialPage = 0, initialSize = 10) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: initialPage,
    size: initialSize,
    totalElements: 0,
    totalPages: 0,
  });
  const { showToast } = useToast();

  const fetchMyPosts = useCallback(
    async (page?: number, status?: string, keyword?: string) => {
      setLoading(true);
      try {
        const res = await postApi.getMyPosts({
          page: page ?? pagination.page,
          size: pagination.size,
          status,
          keyword,
        });
        const apiResponse = res.data as unknown as ApiResponse<PostListResponse>;
        const responseData = apiResponse.data;
        setPosts(responseData.content || []);
        setPagination({
          page: responseData.page,
          size: responseData.size,
          totalElements: responseData.totalElements,
          totalPages: responseData.totalPages,
        });
        setError(null);
      } catch (err: unknown) {
        const message = getErrorMessage(err, 'Không thể tải danh sách bài viết');
        setError(message);
        showToast(message, 'error');
      } finally {
        setLoading(false);
      }
    },
    [pagination.page, pagination.size, showToast]
  );

  const deletePost = useCallback(
    async (postId: string) => {
      try {
        await postApi.deletePost(postId);
        showToast('Xóa bài viết thành công', 'success');
        await fetchMyPosts();
        return true;
      } catch (err: unknown) {
        const message = getErrorMessage(err, 'Xóa bài viết thất bại');
        showToast(message, 'error');
        return false;
      }
    },
    [fetchMyPosts, showToast]
  );

  useEffect(() => {
    fetchMyPosts();
  }, [fetchMyPosts]);

  return { posts, loading, error, pagination, fetchMyPosts, deletePost };
};

export const usePostDetail = (postId: string) => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchPost = useCallback(async () => {
    if (!postId) return;
    setLoading(true);
    try {
      const res = await postApi.getPostById(postId);
      const apiResponse = res.data as unknown as ApiResponse<Post>;
      setPost(apiResponse.data || null);
      setError(null);
    } catch (err: unknown) {
      const message = getErrorMessage(err, 'Không thể tải bài viết');
      setError(message);
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  }, [postId, showToast]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  return { post, loading, error, fetchPost };
};

export const useCreatePost = () => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const createPost = useCallback(
    async (data: CreatePostPayload) => {
      setLoading(true);
      try {
        const res = await postApi.createPost(data);
        const apiResponse = res.data as unknown as ApiResponse<Post>;
        showToast('Bài viết đã được gửi và đang chờ duyệt', 'success');
        return apiResponse.data;
      } catch (err: unknown) {
        const message = getErrorMessage(err, 'Đăng bài thất bại');
        showToast(message, 'error');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [showToast]
  );

  return { createPost, loading };
};

export const useUpdatePost = () => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const updatePost = useCallback(
    async (postId: string, data: UpdatePostPayload) => {
      setLoading(true);
      try {
        const res = await postApi.updatePost(postId, data);
        const apiResponse = res.data as unknown as ApiResponse<Post>;
        showToast('Cập nhật bài viết thành công, bài viết sẽ được duyệt lại', 'success');
        return apiResponse.data;
      } catch (err: unknown) {
        const message = getErrorMessage(err, 'Cập nhật thất bại');
        showToast(message, 'error');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [showToast]
  );

  return { updatePost, loading };
};
