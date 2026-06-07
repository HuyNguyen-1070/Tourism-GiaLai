import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postApi } from '@/services/api/postApi';
import { interactionApi } from '@/services/api/interactionApi';
import { useAuth } from '@/hooks/useAuth';
import { PostStatusBadge } from '../post/components/PostStatusBadge';
import { RatingStars } from '@/components/common/CustomUi/RatingStars';
import { RatingInput } from '../post/components/RatingInput';
import { CommentSection } from '../post/components/CommentSection';
import {
  Calendar,
  Eye,
  Heart,
  Bookmark,
  User,
  Link as LinkIcon,
  Loader2,
  Map as MapIcon,
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'sonner';


export const PostDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch post detail
  const { data: post, isLoading: postLoading } = useQuery({
    queryKey: ['post', id],
    queryFn: () => postApi.getPostById(id!),
    enabled: !!id,
  });

  // Fetch interaction status
  const { data: interaction } = useQuery({
    queryKey: ['interaction', id],
    queryFn: () => interactionApi.getInteractionStatus(id!),
    enabled: !!id && !!user,
  });

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: () => interactionApi.toggleLike(id!),
    onSuccess: (res) => {
      queryClient.setQueryData(['interaction', id], (old: any) => ({
        ...old,
        data: {
          ...old?.data,
          liked: res.data.liked,
          likeCount: res.data.likeCount,
        },
      }));
      toast.success(res.data.liked ? 'Đã thích bài viết' : 'Bỏ thích thành công');
    },
    onError: () => toast.error('Có lỗi xảy ra'),
  });

  // Favorite mutation
  const favMutation = useMutation({
    mutationFn: () => interactionApi.toggleFavorite(id!),
    onSuccess: (res) => {
      queryClient.setQueryData(['interaction', id], (old: any) => ({
        ...old,
        data: {
          ...old?.data,
          favorited: res.data.favorited,
          favoriteCount: res.data.favoriteCount,
        },
      }));
      toast.success(res.data.favorited ? 'Đã lưu bài viết' : 'Đã bỏ lưu');
    },
    onError: () => toast.error('Có lỗi xảy ra'),
  });

  // Rating upsert
  const ratingMutation = useMutation({
    mutationFn: (score: number) => interactionApi.upsertRating(id!, { score }),
    onSuccess: (res) => {
      queryClient.setQueryData(['interaction', id], (old: any) => ({
        ...old,
        data: {
          ...old?.data,
          myScore: res.data.myScore,
          averageRating: res.data.averageRating,
          ratingCount: res.data.ratingCount,
        },
      }));
      toast.success('Cảm ơn bạn đã đánh giá!');
    },
    onError: () => toast.error('Đánh giá thất bại'),
  });

  if (postLoading) {
    return (
      <div className="max-w-4xl mx-auto py-12 flex justify-center">
        <Loader2 className="animate-spin text-secondary" size={48} />
      </div>
    );
  }

  if (!post?.data) {
    return <div className="text-center py-32 text-on-surface-variant">Không tìm thấy bài viết</div>;
  }

  const p = post.data;
  const isLiked = interaction?.data?.liked || false;
  const isFavorited = interaction?.data?.favorited || false;
  const myScore = interaction?.data?.myScore ?? null;
  const avgRating = interaction?.data?.averageRating ?? p.averageRating ?? 0;
  const ratingCount = interaction?.data?.ratingCount ?? p.ratingCount ?? 0;

  const handleRate = (score: number) => {
    if (!user) {
      toast.info('Vui lòng đăng nhập để đánh giá');
      return;
    }
    ratingMutation.mutate(score);
  };

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {p.tags.map((tag) => (
          <span
            key={tag}
            className="bg-forest-leaf/10 text-forest-leaf px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border border-forest-leaf/20"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Title */}
      <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-basalt-soil leading-tight mb-6">
        {p.title}
      </h1>

      {/* Meta bar */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pb-6 mb-8 border-b border-outline-variant/20">
        <div className="flex items-center gap-2 text-sm text-on-surface-variant">
          <div className="w-8 h-8 rounded-full bg-forest-leaf/10 flex items-center justify-center">
            <User className="w-4 h-4 text-forest-leaf" />
          </div>
          <span className="font-medium text-on-surface">{p.authorUsername}</span>
        </div>
        <span className="flex items-center gap-1.5 text-sm text-on-surface-variant">
          <Calendar className="w-4 h-4" />
          {format(new Date(p.createdAt), 'dd MMMM yyyy', { locale: vi })}
        </span>
        <span className="flex items-center gap-1.5 text-sm text-on-surface-variant">
          <Eye className="w-4 h-4" />
          {p.viewCount.toLocaleString()} lượt xem
        </span>
        <PostStatusBadge status={p.status} />
        {p.sourceType === 'EXTERNAL' && p.sourceName && (
          <div className="flex items-center gap-1.5 text-sm text-forest-leaf">
            <LinkIcon className="w-4 h-4" />
            <span>Nguồn: {p.sourceName}</span>
          </div>
        )}
        {/* View on Map button - shown for location-type posts */}
        {p.tags.some((t) => ['LOCATION', 'ACCOMMODATION', 'FOOD', 'CULTURE'].includes(t)) && (
          <Link
            to={`/map?postId=${p.id}`}
            className="ml-auto flex items-center gap-2 px-4 py-2 bg-forest-leaf text-white rounded-xl text-sm font-bold hover:bg-forest-leaf/90 transition-all shadow-sm hover:shadow-md"
          >
            <MapIcon className="w-4 h-4" />
            Xem trên bản đồ
          </Link>
        )}
      </div>

      {/* Hero image */}
      {p.thumbnail && (
        <div className="relative rounded-2xl overflow-hidden mb-10 shadow-lg">
          <img src={p.thumbnail} alt={p.title} className="w-full aspect-video object-cover" />
        </div>
      )}

      {/* Summary highlight */}
      {p.summary && (
        <div className="bg-forest-leaf/5 border-l-4 border-forest-leaf rounded-r-xl px-6 py-4 mb-8">
          <p className="text-on-surface text-lg font-medium leading-relaxed italic">{p.summary}</p>
        </div>
      )}

      {/* Content */}
      <div className="prose prose-lg max-w-none prose-headings:font-headline-md prose-headings:text-basalt-soil prose-a:text-forest-leaf prose-img:rounded-xl">
        <div dangerouslySetInnerHTML={{ __html: p.content }} />
      </div>

      {/* Image gallery */}
      {p.images && p.images.length > 1 && (
        <div className="mt-10">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-outline mb-4">
            Thư viện ảnh
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {p.images.slice(1).map((img, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden">
                <img
                  src={img}
                  alt=""
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interaction Bar */}
      <div className="mt-12 pt-8 border-t border-outline-variant/20">
        <div className="flex flex-wrap gap-4 items-center">
          <button
            onClick={() => likeMutation.mutate()}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border transition-all text-sm font-medium ${
              isLiked
                ? 'border-rose-300 bg-rose-50 text-rose-500'
                : 'border-outline-variant/30 text-on-surface-variant hover:border-rose-300 hover:text-rose-500 hover:bg-rose-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            {interaction?.data?.likeCount ?? p.likeCount} Thích
          </button>

          <button
            onClick={() => favMutation.mutate()}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border transition-all text-sm font-medium ${
              isFavorited
                ? 'border-amber-300 bg-amber-50 text-amber-500'
                : 'border-outline-variant/30 text-on-surface-variant hover:border-amber-300 hover:text-amber-500 hover:bg-amber-50'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
            Lưu bài
          </button>

          <div className="flex items-center gap-4 ml-auto">
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold">{avgRating.toFixed(1)}</span>
                <RatingStars rating={avgRating} size={16} />
              </div>
              <span className="text-[11px] text-outline">({ratingCount} lượt đánh giá)</span>
            </div>

            {user && (
              <>
                <div className="w-px h-8 bg-outline-variant/30 hidden sm:block"></div>
                <div className="flex flex-col items-center">
                  <span className="text-[11px] font-medium text-on-surface-variant mb-1">
                    Đánh giá của bạn
                  </span>
                  <RatingInput value={myScore} onChange={handleRate} size={20} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Comment Section */}
      <CommentSection postId={id!} />
    </article>
  );
};
