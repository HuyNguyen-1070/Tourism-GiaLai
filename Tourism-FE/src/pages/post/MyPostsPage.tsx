import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePosts } from '@/hooks/usePosts';
import { PostCard } from '../post/components/PostCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Plus, Search } from 'lucide-react';
import { PostStatus } from '@/types/post';

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

  return (
    <div className="space-y-8">
      <div className="border-l-4 border-forest-leaf pl-6">
        <h1 className="font-headline-lg text-headline-lg text-basalt-soil">Bài viết của tôi</h1>
        <p className="text-on-surface-variant mt-2">
          Quản lý các bài viết bạn đã đóng góp cho cộng đồng.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={statusFilter === 'ALL' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('ALL')}
            className={statusFilter === 'ALL' ? 'bg-forest-leaf' : ''}
          >
            Tất cả
          </Button>
          <Button
            variant={statusFilter === 'PENDING' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('PENDING')}
          >
            Chờ duyệt
          </Button>
          <Button
            variant={statusFilter === 'APPROVED' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('APPROVED')}
          >
            Đã duyệt
          </Button>
          <Button
            variant={statusFilter === 'REJECTED' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('REJECTED')}
          >
            Bị từ chối
          </Button>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Input
            placeholder="Tìm theo tiêu đề..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-64"
          />
          <Button onClick={handleSearch}>
            <Search className="w-4 h-4" />
          </Button>
          <Button onClick={() => navigate('/create-post')} className="bg-forest-leaf">
            <Plus className="w-4 h-4 mr-1" /> Đăng bài mới
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-forest-leaf" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed">
          <p className="text-on-surface-variant">Bạn chưa có bài viết nào.</p>
          <Button onClick={() => navigate('/create-post')} className="mt-4 bg-forest-leaf">
            Đăng bài ngay
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
