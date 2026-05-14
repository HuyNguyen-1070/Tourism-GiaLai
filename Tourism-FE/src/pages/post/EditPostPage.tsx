import { useParams, useNavigate } from 'react-router-dom';
import { usePostDetail, useUpdatePost } from '@/hooks/usePosts';
import { PostForm } from '../post/components/PostForm';
import { Loader2 } from 'lucide-react';
import { CreatePostPayload } from '@/types/post';

export const EditPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { post, loading: loadingDetail } = usePostDetail(id!);
  const { updatePost, loading: updating } = useUpdatePost();

  if (loadingDetail) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-forest-leaf" />
      </div>
    );
  }

  if (!post) {
    return <div className="text-center py-20">Không tìm thấy bài viết</div>;
  }

  const handleSubmit = async (data: {
    title: string;
    content: string;
    tags: string[];
    sourceType: 'AUTHOR' | 'EXTERNAL';
    summary?: string | undefined;
    images?: string[] | undefined;
    sourceName?: string | undefined;
  }) => {
    const payload: CreatePostPayload = {
      ...data,
      tags: data.tags.map((tag) => ({ name: tag })) as unknown as CreatePostPayload['tags'],
    };
    await updatePost(post.id, payload);
    navigate('/my-posts');
  };

  const defaultValues = {
    title: post.title,
    content: post.content,
    summary: post.summary,
    tags: post.tags,
    images: post.images,
    sourceType: post.sourceType,
    sourceName: post.sourceName || '',
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="border-l-4 border-forest-leaf pl-6">
        <h1 className="font-headline-lg text-headline-lg text-basalt-soil">Chỉnh sửa bài viết</h1>
        <p className="text-on-surface-variant mt-2">
          Sau khi sửa, bài viết sẽ được chuyển về trạng thái chờ duyệt.
        </p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <PostForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          isLoading={updating}
          submitLabel="Cập nhật và gửi duyệt"
        />
      </div>
    </div>
  );
};
