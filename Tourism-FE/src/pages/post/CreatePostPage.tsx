import type { ComponentProps } from 'react';
import { useNavigate } from 'react-router-dom';
import { PostForm } from '../post/components/PostForm';
import { useCreatePost } from '@/hooks/usePosts';

type CreatePostData = Parameters<NonNullable<ComponentProps<typeof PostForm>['onSubmit']>>[0];

export const CreatePostPage = () => {
  const navigate = useNavigate();
  const { createPost, loading } = useCreatePost();

  const handleSubmit = async (data: CreatePostData) => {
    await createPost(data);
    navigate('/my-posts');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="border-l-4 border-forest-leaf pl-6">
        <h1 className="font-headline-lg text-headline-lg text-basalt-soil">Đăng bài viết mới</h1>
        <p className="text-on-surface-variant mt-2">
          Chia sẻ câu chuyện, địa điểm hoặc nét văn hóa về Gia Lai.
        </p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <PostForm onSubmit={handleSubmit} isLoading={loading} submitLabel="Gửi duyệt" />
      </div>
    </div>
  );
};
