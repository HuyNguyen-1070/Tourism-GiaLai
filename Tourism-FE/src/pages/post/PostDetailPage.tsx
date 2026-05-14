import { useParams } from 'react-router-dom';
import { usePostDetail } from '@/hooks/usePosts';
import { PostStatusBadge } from '../post/components/PostStatusBadge';
import { Calendar, Eye, Heart, Star, Bookmark, User, Link as LinkIcon } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export const PostDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { post, loading } = usePostDetail(id!);

  if (loading) return <div className="text-center py-20">Đang tải...</div>;
  if (!post) return <div className="text-center py-20">Không tìm thấy bài viết</div>;

  return (
    <article className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="bg-surface-container px-3 py-1 rounded-full text-label-sm">
              {tag}
            </span>
          ))}
        </div>
        <h1 className="font-display-lg text-display-lg text-basalt-soil">{post.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-label-sm text-outline">
          <span className="flex items-center gap-1">
            <User className="w-4 h-4" /> {post.authorUsername}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />{' '}
            {format(new Date(post.createdAt), 'dd MMMM yyyy', { locale: vi })}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" /> {post.viewCount} lượt xem
          </span>
          <PostStatusBadge status={post.status} />
        </div>
        {post.sourceType === 'EXTERNAL' && post.sourceName && (
          <div className="flex items-center gap-2 text-label-sm text-forest-leaf">
            <LinkIcon className="w-4 h-4" /> Nguồn: {post.sourceName}
          </div>
        )}
      </div>

      {post.thumbnail && (
        <img src={post.thumbnail} alt={post.title} className="w-full rounded-xl shadow-md" />
      )}

      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <div className="flex flex-wrap gap-6 pt-8 border-t">
        <button className="flex items-center gap-2 text-on-surface-variant hover:text-forest-leaf">
          <Heart className="w-5 h-5" /> {post.likeCount} Thích
        </button>
        <button className="flex items-center gap-2 text-on-surface-variant hover:text-forest-leaf">
          <Star className="w-5 h-5" /> {post.averageRating.toFixed(1)} ({post.ratingCount} đánh giá)
        </button>
        <button className="flex items-center gap-2 text-on-surface-variant hover:text-forest-leaf">
          <Bookmark className="w-5 h-5" /> Lưu
        </button>
      </div>
    </article>
  );
};
