import { Link } from 'react-router-dom';
import { PostDisplayData } from '@/types/post';
import { PostStatusBadge } from './PostStatusBadge';
import { Eye, Heart, Star, Calendar, MapPin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface PostCardProps {
  post: PostDisplayData;
  showActions?: boolean;
  showStatusBadge?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const PostCard = ({ post, showActions = false, showStatusBadge = false, onEdit, onDelete }: PostCardProps) => {
  return (
    <article className="bg-white rounded-2xl overflow-hidden border border-outline-variant/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
      <div className="relative h-52 overflow-hidden bg-surface-container">
        {post.thumbnail ? (
          <img
            src={post.thumbnail}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-forest-leaf/10 to-primary-container/20">
            <MapPin className="w-12 h-12 text-forest-leaf/30" />
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        {showStatusBadge && (
          <div className="absolute top-4 left-4">
            <PostStatusBadge status={post.status as any} />
          </div>
        )}
        {/* Tags on image */}
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-1.5">
          {(post.tags || []).slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-[10px] bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 rounded-full border border-white/30 uppercase tracking-wider font-semibold"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <Link to={`/posts/${post.id}`} className="block group/title mb-3">
          <h3 className="font-headline-md text-headline-md text-basalt-soil group-hover/title:text-forest-leaf transition-colors line-clamp-2 leading-tight">
            {post.title}
          </h3>
        </Link>

        {post.summary && (
          <p className="text-on-surface-variant text-sm line-clamp-2 mb-4 leading-relaxed flex-1">
            {post.summary}
          </p>
        )}

        <div className="mt-auto">
          <div className="flex items-center gap-3 text-[12px] text-outline mb-4 flex-wrap">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: vi })}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" /> {post.viewCount.toLocaleString()}
            </span>
            <span className="flex items-center gap-1 text-rose-400">
              <Heart className="w-3 h-3" /> {post.likeCount}
            </span>
            <span className="flex items-center gap-1 text-amber-500">
              <Star className="w-3 h-3 fill-current" /> {post.averageRating.toFixed(1)}
            </span>
          </div>

          {showActions && (
            <div className="flex gap-3 pt-4 border-t border-outline-variant/10">
              <button
                onClick={onEdit}
                className="flex-1 py-2 text-sm font-semibold text-forest-leaf border border-forest-leaf/30 rounded-lg hover:bg-forest-leaf hover:text-white transition-all"
              >
                Chỉnh sửa
              </button>
              <button
                onClick={onDelete}
                className="flex-1 py-2 text-sm font-semibold text-tertiary border border-tertiary/20 rounded-lg hover:bg-tertiary hover:text-white transition-all"
              >
                Xóa
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
