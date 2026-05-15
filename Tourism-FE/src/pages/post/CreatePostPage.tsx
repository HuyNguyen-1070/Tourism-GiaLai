import type { ComponentProps } from 'react';
import { useNavigate } from 'react-router-dom';
import { PostForm } from '../post/components/PostForm';
import { useCreatePost } from '@/hooks/usePosts';
import { PenLine, ArrowLeft } from 'lucide-react';

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
      {/* Back nav */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-forest-leaf transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại
      </button>

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-forest-leaf to-primary px-8 py-10 text-white">
        <div className="relative z-10 flex items-start gap-5">
          <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center flex-shrink-0">
            <PenLine className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary-fixed/70 mb-1">
              Đóng góp nội dung
            </p>
            <h1 className="font-headline-lg text-headline-lg mb-1">Đăng bài viết mới</h1>
            <p className="text-white/70 text-sm">
              Chia sẻ câu chuyện, địa điểm hoặc nét văn hóa đặc sắc của vùng đất Gia Lai.
            </p>
          </div>
        </div>
        <div
          className="absolute right-0 top-0 bottom-0 w-2/5 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, #b4f395 1px, transparent 1px)',
            backgroundSize: '18px 18px',
          }}
        />
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
        <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-white text-xs font-bold">i</span>
        </div>
        <p className="text-sm text-amber-800">
          Bài viết của bạn sẽ được gửi đến ban quản trị để xét duyệt trước khi xuất bản. Thời gian
          xét duyệt thường trong vòng 1–2 ngày làm việc.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/20 p-8">
        <PostForm onSubmit={handleSubmit} isLoading={loading} submitLabel="Gửi xét duyệt" />
      </div>
    </div>
  );
};
