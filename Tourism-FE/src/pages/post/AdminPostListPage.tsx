import { useState } from 'react';
import { useAdminPosts } from '@/hooks/useAdminPosts';
import { PostCard } from '../post/components/PostCard';
import { ApproveRejectModal } from '../post/components/admin/ApproveRejectModal';
import { Post } from '@/types/post';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2, ShieldCheck, Clock } from 'lucide-react';

export const AdminPostListPage = () => {
  const { posts, loading, fetchPendingPosts, approvePost, rejectPost } = useAdminPosts();
  const [keyword, setKeyword] = useState('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleApprove = async (postId: string) => {
    await approvePost(postId);
    setModalOpen(false);
  };

  const handleReject = async (postId: string, reason: string) => {
    await rejectPost(postId, reason);
    setModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-forest-leaf px-8 py-10 text-white">
        <div className="relative z-10 flex items-start gap-5">
          <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary-fixed/70 mb-1">
              Quản trị viên
            </p>
            <h1 className="font-headline-lg text-headline-lg mb-1">Duyệt bài viết</h1>
            <p className="text-white/70 text-sm">
              Xét duyệt các bài viết đang chờ trước khi xuất bản lên cộng đồng.
            </p>
          </div>
        </div>
        <div
          className="absolute right-0 top-0 bottom-0 w-2/5 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, #b4f395 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        {/* Pending count badge */}
        {!loading && posts.length > 0 && (
          <div className="absolute top-6 right-8 flex items-center gap-2 bg-amber-400/20 border border-amber-300/30 backdrop-blur-sm px-4 py-2 rounded-full">
            <Clock className="w-4 h-4 text-amber-200" />
            <span className="text-sm font-semibold text-white">{posts.length} bài chờ duyệt</span>
          </div>
        )}
      </div>

      {/* Search bar */}
      <div className="bg-white rounded-2xl border border-outline-variant/20 p-5">
        <div className="flex gap-3 max-w-lg">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
            <Input
              placeholder="Tìm theo tiêu đề hoặc tác giả..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchPendingPosts(0, keyword)}
              className="pl-10"
            />
          </div>
          <Button
            onClick={() => fetchPendingPosts(0, keyword)}
            className="bg-forest-leaf hover:bg-forest-leaf/90 gap-2"
          >
            <Search className="w-4 h-4" />
            Tìm kiếm
          </Button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-forest-leaf" />
          <p className="text-sm text-on-surface-variant">Đang tải danh sách...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-outline-variant/40">
          <div className="w-16 h-16 rounded-full bg-forest-leaf/10 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-forest-leaf/50" />
          </div>
          <p className="font-medium text-on-surface mb-1">Không có bài viết nào chờ duyệt</p>
          <p className="text-sm text-on-surface-variant">Tất cả bài viết đã được xét duyệt.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="relative">
              <PostCard post={post} showStatusBadge={true} />
              <div className="px-6 pb-5 -mt-2 bg-white rounded-b-2xl border-x border-b border-outline-variant/20">
                <Button
                  onClick={() => {
                    setSelectedPost(post);
                    setModalOpen(true);
                  }}
                  className="w-full bg-forest-leaf hover:bg-forest-leaf/90 gap-2"
                  size="sm"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Xét duyệt bài này
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ApproveRejectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        post={selectedPost}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};
