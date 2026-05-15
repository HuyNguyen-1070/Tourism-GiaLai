import { useEffect, useState, useCallback } from 'react';
import { contentApi } from '@/services/api/contentApi';
import { Post } from '@/types/post';
import { PostCard } from '@/pages/post/components/PostCard';
import {
  Loader2,
  Search,
  Filter,
  MapPin,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Map as MapIcon,
} from 'lucide-react';
import { PaginatedResponse } from '@/types/content';

export const AttractionsPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<Omit<PaginatedResponse<Post>, 'content'> | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  const fetchAttractions = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        size: 12,
        keyword: keyword || undefined,
        tags: activeTags.length > 0 ? activeTags.join(',') : undefined,
        sort: 'engagementScore,desc',
      };

      const res = await contentApi.getAttractions(params);
      setPosts(res.data.content);
      setPagination({
        page: res.data.page,
        size: res.data.size,
        totalElements: res.data.totalElements,
        totalPages: res.data.totalPages,
      });
    } catch (error) {
      console.error('Error fetching attractions:', error);
    } finally {
      setLoading(false);
    }
  }, [page, keyword, activeTags]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAttractions();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchAttractions]);

  const toggleTag = (tag: string) => {
    setActiveTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
    setPage(0);
  };

  const filterTags = [
    { label: 'Ẩm thực', value: 'FOOD' },
    { label: 'Lưu trú', value: 'ACCOMMODATION' },
    { label: 'Văn hóa', value: 'CULTURE' },
    { label: 'Di chuyển', value: 'TRANSPORT' },
  ];

  return (
    <div className="min-h-screen bg-mist-beige pb-24">
      {/* Header */}
      <div className="bg-basalt-soil text-white pt-16 pb-16 px-margin-mobile md:px-margin-desktop relative overflow-hidden">
        <div className="absolute inset-0 ethnic-pattern opacity-10" />
        <div className="max-w-container-max mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10">
            <div className="max-w-2xl">
              <h1 className="font-headline-lg text-4xl md:text-5xl mb-4">Điểm tham quan</h1>
              <p className="text-white/60 font-body-lg">
                Gia Lai - Nơi hội tụ của những thác nước hùng vĩ, núi rừng đại ngàn và những công
                trình văn hóa tâm linh đặc sắc.
              </p>
            </div>

            <div className="flex gap-2 p-1.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${viewMode === 'grid' ? 'bg-white text-basalt-soil shadow-lg' : 'text-white hover:bg-white/5'}`}
              >
                <LayoutGrid className="w-4 h-4" />
                Lưới
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${viewMode === 'map' ? 'bg-white text-basalt-soil shadow-lg' : 'text-white hover:bg-white/5'}`}
              >
                <MapIcon className="w-4 h-4" />
                Bản đồ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border-b border-basalt-soil/5 py-6 px-margin-mobile md:px-margin-desktop sticky top-20 z-40 shadow-sm">
        <div className="max-w-container-max mx-auto flex flex-col lg:flex-row justify-between gap-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 mr-4 text-sm font-bold text-basalt-soil">
              <Filter className="w-4 h-4 text-forest-leaf" />
              <span>Lọc theo:</span>
            </div>
            {filterTags.map((tag) => (
              <button
                key={tag.value}
                onClick={() => toggleTag(tag.value)}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all border ${
                  activeTags.includes(tag.value)
                    ? 'bg-forest-leaf text-white border-forest-leaf shadow-md'
                    : 'bg-mist-beige text-on-surface-variant border-basalt-soil/5 hover:border-forest-leaf/30'
                }`}
              >
                {tag.label}
              </button>
            ))}
            {activeTags.length > 0 && (
              <button
                onClick={() => setActiveTags([])}
                className="text-xs font-bold text-error hover:underline px-2"
              >
                Xóa tất cả
              </button>
            )}
          </div>

          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
            <input
              type="text"
              placeholder="Tên địa điểm, khu vực..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-mist-beige border border-basalt-soil/5 rounded-xl focus:ring-2 focus:ring-forest-leaf/20 focus:border-forest-leaf transition-all text-sm"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mt-12">
        {viewMode === 'map' ? (
          <div className="w-full h-[600px] bg-white rounded-3xl border border-basalt-soil/5 shadow-xl flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-slate-100 animate-pulse flex items-center justify-center">
              <div className="text-center">
                <MapIcon className="w-12 h-12 text-outline/30 mx-auto mb-4" />
                <p className="text-on-surface-variant font-bold">
                  Tính năng bản đồ đang được tích hợp...
                </p>
              </div>
            </div>
            {/* Map Integration Placeholder */}
          </div>
        ) : (
          <>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Loader2 className="w-10 h-10 text-forest-leaf animate-spin" />
                <p className="text-on-surface-variant">Đang tìm kiếm tọa độ đẹp nhất...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>

                {posts.length === 0 && (
                  <div className="py-24 text-center bg-white rounded-3xl border border-basalt-soil/5">
                    <MapPin className="w-16 h-16 text-outline/20 mx-auto mb-6" />
                    <h3 className="text-xl font-headline-md text-basalt-soil mb-2">
                      Chưa tìm thấy địa điểm nào
                    </h3>
                    <p className="text-on-surface-variant">
                      Hãy thử khám phá với từ khóa khác nhé.
                    </p>
                  </div>
                )}

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="mt-16 flex items-center justify-center gap-4">
                    <button
                      disabled={page === 0}
                      onClick={() => setPage((p) => p - 1)}
                      className="p-3 rounded-xl bg-white border border-basalt-soil/10 disabled:opacity-30 hover:text-forest-leaf hover:border-forest-leaf transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-bold text-basalt-soil">
                      Trang {page + 1} / {pagination.totalPages}
                    </span>
                    <button
                      disabled={page === pagination.totalPages - 1}
                      onClick={() => setPage((p) => p + 1)}
                      className="p-3 rounded-xl bg-white border border-basalt-soil/10 disabled:opacity-30 hover:text-forest-leaf hover:border-forest-leaf transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
