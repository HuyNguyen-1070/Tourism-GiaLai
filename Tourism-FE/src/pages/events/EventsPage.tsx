import { useEffect, useState, useCallback } from 'react';
import { contentApi } from '@/services/api/contentApi';
import { Post } from '@/types/post';
import { PostCard } from '@/pages/post/components/PostCard';
import {
  Loader2,
  Search,
  Filter,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { PaginatedResponse } from '@/types/content';

export const EventsPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<Omit<PaginatedResponse<Post>, 'content'> | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [activeTag, setActiveTag] = useState<string>('');

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        size: 12,
        keyword: keyword || undefined,
        tags: activeTag || 'FESTIVAL,EVENT', // Default to both if none selected
        sort: 'createdAt,desc',
      };

      const res = await contentApi.getEventsAndFestivals(params);
      setPosts(res.data.content);
      setPagination({
        page: res.data.page,
        size: res.data.size,
        totalElements: res.data.totalElements,
        totalPages: res.data.totalPages,
      });
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  }, [page, keyword, activeTag]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEvents();
    }, 500); // Debounce search
    return () => clearTimeout(timer);
  }, [fetchEvents]);

  const tags = [
    { label: 'Tất cả', value: '' },
    { label: 'Lễ hội', value: 'FESTIVAL' },
    { label: 'Sự kiện', value: 'EVENT' },
    { label: 'Văn hóa', value: 'CULTURE' },
  ];

  return (
    <div className="min-h-screen bg-mist-beige pb-24">
      {/* Header */}
      <div className="bg-white border-b border-basalt-soil/5 pt-12 pb-12 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="font-headline-lg text-3xl md:text-4xl text-basalt-soil mb-2">
                Sự kiện & Lễ hội
              </h1>
              <p className="text-on-surface-variant flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-forest-leaf" />
                Cập nhật những hoạt động văn hóa đặc sắc nhất tại Gia Lai
              </p>
            </div>

            {/* Search Bar */}
            <div className="w-full md:w-96 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
              <input
                type="text"
                placeholder="Tìm kiếm sự kiện..."
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                  setPage(0); // Reset page on search
                }}
                className="w-full pl-12 pr-4 py-3 bg-mist-beige border border-basalt-soil/10 rounded-2xl focus:ring-2 focus:ring-forest-leaf/20 focus:border-forest-leaf transition-all text-sm font-body-md"
              />
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap items-center gap-3 mt-8">
            <div className="flex items-center gap-2 mr-2 text-sm font-bold text-basalt-soil">
              <Filter className="w-4 h-4" />
              <span>Lọc bài viết:</span>
            </div>
            {tags.map((tag) => (
              <button
                key={tag.label}
                onClick={() => {
                  setActiveTag(tag.value);
                  setPage(0);
                }}
                className={`px-6 py-2 rounded-full text-xs font-bold transition-all border ${
                  activeTag === tag.value
                    ? 'bg-forest-leaf text-white border-forest-leaf shadow-md shadow-forest-leaf/20 scale-105'
                    : 'bg-white text-on-surface-variant border-basalt-soil/10 hover:border-forest-leaf/30'
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mt-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-10 h-10 text-forest-leaf animate-spin" />
            <p className="text-on-surface-variant animate-pulse">
              Đang tìm kiếm sự kiện phù hợp...
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {posts.length === 0 && (
              <div className="py-24 text-center bg-white rounded-3xl border border-basalt-soil/5 shadow-sm">
                <Search className="w-16 h-16 text-outline/20 mx-auto mb-6" />
                <h3 className="text-xl font-headline-md text-basalt-soil mb-2">
                  Không tìm thấy sự kiện nào
                </h3>
                <p className="text-on-surface-variant">
                  Hãy thử đổi từ khóa hoặc bộ lọc khác bạn nhé.
                </p>
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-16 flex items-center justify-center gap-4">
                <button
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                  className="p-3 rounded-full bg-white border border-basalt-soil/10 disabled:opacity-30 disabled:cursor-not-allowed hover:text-forest-leaf hover:border-forest-leaf transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: pagination.totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i)}
                      className={`w-10 h-10 rounded-full font-bold text-sm transition-all ${
                        page === i
                          ? 'bg-forest-leaf text-white shadow-lg shadow-forest-leaf/20'
                          : 'bg-white text-on-surface-variant border border-basalt-soil/10 hover:border-forest-leaf/30'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  disabled={page === pagination.totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                  className="p-3 rounded-full bg-white border border-basalt-soil/10 disabled:opacity-30 disabled:cursor-not-allowed hover:text-forest-leaf hover:border-forest-leaf transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
