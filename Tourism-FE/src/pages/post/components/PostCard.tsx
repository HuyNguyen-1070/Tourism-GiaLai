import { Link } from 'react-router-dom';
import { Post } from '@/types/post';
import { PostStatusBadge } from './PostStatusBadge';
import { Eye, Heart, Star, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface PostCardProps {
  post: Post;
  showActions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const PostCard = ({ post, showActions = false, onEdit, onDelete }: PostCardProps) => {
  return (
    <article className="bg-white rounded-xl overflow-hidden shadow-sm border border-outline-variant/20 hover:shadow-md transition-all group">
      {post.thumbnail && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={post.thumbnail}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4">
            <PostStatusBadge status={post.status} />
          </div>
        </div>
      )}
      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-label-sm bg-surface-container text-outline px-2 py-0.5 rounded uppercase tracking-tighter"
            >
              {tag}
            </span>
          ))}
        </div>
        <Link to={`/posts/${post.id}`}>
          <h3 className="font-headline-md text-headline-md text-primary mb-2 hover:text-forest-leaf transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>
        {post.summary && (
          <p className="text-on-surface-variant line-clamp-2 mb-4">{post.summary}</p>
        )}
        <div className="flex flex-wrap items-center gap-4 text-label-sm text-outline mb-4">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />{' '}
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: vi })}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" /> {post.viewCount}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="w-3 h-3" /> {post.likeCount}
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3" /> {post.averageRating.toFixed(1)}
          </span>
        </div>
        {showActions && (
          <div className="flex gap-3 pt-4 border-t border-outline-variant/10">
            <button
              onClick={onEdit}
              className="text-primary hover:text-forest-leaf font-label-md transition-colors"
            >
              Sửa
            </button>
            <button
              onClick={onDelete}
              className="text-tertiary hover:opacity-70 font-label-md transition-colors"
            >
              Xóa
            </button>
          </div>
        )}
      </div>
    </article>
  );
};
