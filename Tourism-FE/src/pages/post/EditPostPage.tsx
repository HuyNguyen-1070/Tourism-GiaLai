import { useParams, useNavigate } from 'react-router-dom';
import { usePostDetail, useUpdatePost } from '@/hooks/usePosts';
import { PostForm } from '../post/components/PostForm';
import { Loader2, Pencil, ArrowLeft, AlertTriangle } from 'lucide-react';
import { CreatePostPayload } from '@/types/post';

export const EditPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { post, loading: loadingDetail } = usePostDetail(id!);
  const { updatePost, loading: updating } = useUpdatePost();

  if (loadingDetail) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-forest-leaf" />
        <p className="text-on-surface-variant text-sm">Đang tải bài viết...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-32">
        <p className="text-on-surface-variant">Không tìm thấy bài viết</p>
      </div>
    );
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
      {/* Back nav */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-forest-leaf transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại
      </button>

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-basalt-soil to-secondary px-8 py-10 text-white">
        <div className="relative z-10 flex items-start gap-5">
          <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center flex-shrink-0">
            <Pencil className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-secondary-fixed/70 mb-1">
              Chỉnh sửa nội dung
            </p>
            <h1 className="font-headline-lg text-headline-lg mb-1">Cập nhật bài viết</h1>
            <p className="text-white/70 text-sm line-clamp-1 max-w-lg">{post.title}</p>
          </div>
        </div>
        <div
          className="absolute right-0 top-0 bottom-0 w-2/5 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, #fdb56c 1px, transparent 1px)',
            backgroundSize: '18px 18px',
          }}
        />
      </div>

      {/* Warning banner */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
        <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">
          Sau khi lưu thay đổi, bài viết sẽ được chuyển về trạng thái <strong>Chờ duyệt</strong> và
          cần được ban quản trị xét duyệt lại trước khi xuất bản.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/20 p-8">
        <PostForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          isLoading={updating}
          submitLabel="Lưu và gửi xét duyệt"
        />
      </div>
    </div>
  );
};
