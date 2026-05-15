import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePosts } from '@/hooks/usePosts';
import { PostCard } from '../post/components/PostCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Plus, Search, FileText, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { PostStatus } from '@/types/post';

const STATUS_TABS: { value: PostStatus | 'ALL'; label: string; icon: React.ReactNode }[] = [
  { value: 'ALL', label: 'Tất cả', icon: <FileText className="w-4 h-4" /> },
  { value: 'PENDING', label: 'Chờ duyệt', icon: <Clock className="w-4 h-4" /> },
  { value: 'APPROVED', label: 'Đã duyệt', icon: <CheckCircle2 className="w-4 h-4" /> },
  { value: 'REJECTED', label: 'Từ chối', icon: <XCircle className="w-4 h-4" /> },
];

export const MyPostsPage = () => {
  const navigate = useNavigate();
  const { posts, loading, fetchMyPosts, deletePost } = usePosts();
  const [statusFilter, setStatusFilter] = useState<PostStatus | 'ALL'>('ALL');
  const [keyword, setKeyword] = useState('');

  const handleSearch = () => {
    fetchMyPosts(0, statusFilter !== 'ALL' ? statusFilter : undefined, keyword);
  };

  const handleDelete = async (postId: string) => {
    if (confirm('Bạn có chắc muốn xóa bài viết này?')) {
      await deletePost(postId);
    }
  };

  const handleStatusFilter = (status: PostStatus | 'ALL') => {
    setStatusFilter(status);
    fetchMyPosts(0, status !== 'ALL' ? status : undefined, keyword);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-basalt-soil to-primary px-8 py-10 text-white">
        <div className="relative z-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary-fixed/70 mb-2">
            Di sản Gia Lai
          </p>
          <h1 className="font-headline-lg text-headline-lg mb-2">Bài viết của tôi</h1>
          <p className="text-white/70 max-w-xl">
            Quản lý những câu chuyện và khám phá bạn đã chia sẻ với cộng đồng.
          </p>
        </div>
        {/* Decorative pattern */}
        <div
          className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, #b4f395 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full border-2 border-white/10" />
        <div className="absolute right-8 -bottom-4 w-24 h-24 rounded-full border-2 border-white/10" />
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl border border-outline-variant/20 p-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          {/* Status filter tabs */}
          <div className="flex flex-wrap gap-2">
            {STATUS_TABS.map(({ value, label, icon }) => (
              <button
                key={value}
                onClick={() => handleStatusFilter(value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  statusFilter === value
                    ? 'bg-forest-leaf text-white shadow-sm'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>

          {/* Search & Create */}
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
              <Input
                placeholder="Tìm kiếm bài viết..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button
              onClick={() => navigate('/create-post')}
              className="bg-forest-leaf hover:bg-forest-leaf/90 gap-2 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Đăng bài mới
            </Button>
          </div>
        </div>
      </div>

      {/* Posts grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-forest-leaf" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-outline-variant/40">
          <div className="w-16 h-16 rounded-full bg-forest-leaf/10 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-forest-leaf/50" />
          </div>
          <p className="text-on-surface-variant mb-4">
            {statusFilter === 'ALL'
              ? 'Bạn chưa có bài viết nào.'
              : `Không có bài viết nào ở trạng thái này.`}
          </p>
          <Button
            onClick={() => navigate('/create-post')}
            className="bg-forest-leaf hover:bg-forest-leaf/90"
          >
            Đăng bài ngay
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              showActions
              onEdit={() => navigate(`/edit-post/${post.id}`)}
              onDelete={() => handleDelete(post.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
