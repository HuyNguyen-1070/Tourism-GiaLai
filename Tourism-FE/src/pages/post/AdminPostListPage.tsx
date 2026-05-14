import { useState } from 'react';
import { useAdminPosts } from '@/hooks/useAdminPosts';
import { PostCard } from '../post/components/PostCard';
import { ApproveRejectModal } from '../post/components/admin/ApproveRejectModal';
import { Post } from '@/types/post';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';

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
      <div className="border-l-4 border-forest-leaf pl-6">
        <h1 className="font-headline-lg text-headline-lg text-basalt-soil">Duyệt bài viết</h1>
        <p className="text-on-surface-variant mt-2">
          Phê duyệt hoặc từ chối các bài viết đang chờ.
        </p>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Tìm theo tiêu đề hoặc tác giả..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => fetchPendingPosts(0, keyword)}>
          <Search className="w-4 h-4" />
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-forest-leaf" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed">
          Không có bài viết nào chờ duyệt.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="relative">
              <PostCard post={post} />
              <div className="absolute bottom-6 right-6 flex gap-2">
                <Button
                  onClick={() => {
                    setSelectedPost(post);
                    setModalOpen(true);
                  }}
                  className="bg-forest-leaf text-white"
                >
                  Xét duyệt
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
