import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchApi, SearchPostResponse } from '@/services/api/searchApi';
import { TagResponse } from '@/types/content';
import { Search, Filter, ChevronRight, Loader2, LayoutGrid, List } from 'lucide-react';
import { PostCard } from '@/pages/post/components/PostCard';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [posts, setPosts] = useState<SearchPostResponse[]>([]);
  const [tags, setTags] = useState<TagResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Filter states
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(
    searchParams.get('tags')?.split(',').filter(Boolean) || []
  );
  const [sort, setSort] = useState(searchParams.get('sort') || 'createdAt');
  const [direction, setDirection] = useState(searchParams.get('direction') || 'desc');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 0);

  const fetchTags = async () => {
    try {
      const res = await searchApi.getAllTags();
      setTags(res.data);
    } catch (error) {
      console.error('Failed to fetch tags');
    }
  };

  const fetchResults = useCallback(async () => {
    setLoading(true);
    try {
      const res = await searchApi.searchPosts({
        keyword: keyword || undefined,
        tags: selectedTags.length > 0 ? selectedTags.join(',') : undefined,
        sort,
        direction,
        page,
        size: 12,
      });
      setPosts(res.data.content);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
    } catch (error) {
      toast.error('Không thể tìm kiếm bài viết');
    } finally {
      setLoading(false);
    }
  }, [keyword, selectedTags, sort, direction, page]);

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    const timer = setTimeout(fetchResults, 500);
    return () => clearTimeout(timer);
  }, [fetchResults]);

  const handleTagToggle = (tagName: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagName) ? prev.filter((t) => t !== tagName) : [...prev, tagName]
    );
    setPage(0);
  };

  const clearFilters = () => {
    setKeyword('');
    setSelectedTags([]);
    setPage(0);
  };

  return (
    <div className="min-h-screen bg-mist-beige pb-24">
      {/* Hero Banner */}
      <div className="bg-basalt-soil pt-32 pb-16 px-margin-mobile md:px-margin-desktop relative overflow-hidden">
        <div className="absolute inset-0 ethnic-pattern opacity-10" />
        <div className="max-w-container-max mx-auto relative z-10">
          <h1 className="font-headline-lg text-4xl md:text-5xl text-white mb-8 text-center">
            Khám phá Gia Lai
          </h1>
          <div className="max-w-3xl mx-auto relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-white/60 group-focus-within:text-white transition-colors" />
            <input
              type="text"
              placeholder="Nhập tên địa điểm, văn hóa, ẩm thực..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-16 pr-6 py-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-lg font-medium text-white placeholder:text-white/50 focus:bg-white/20 focus:outline-none focus:ring-4 focus:ring-forest-leaf/30 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mt-12 flex flex-col lg:flex-row gap-12">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-72 shrink-0 space-y-8">
          <div className="sticky top-24 bg-white p-6 rounded-3xl border border-basalt-soil/5 shadow-sm">
            <div className="flex justify-between items-center mb-6 border-b border-basalt-soil/5 pb-4">
              <h3 className="text-sm font-bold text-basalt-soil uppercase tracking-widest flex items-center gap-2">
                <Filter className="w-4 h-4 text-forest-leaf" />
                Bộ lọc
              </h3>
              {(selectedTags.length > 0 || keyword) && (
                <button
                  onClick={clearFilters}
                  className="text-xs font-bold text-error hover:underline px-2"
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>

            <div className="space-y-8">
              {/* Tags Filter */}
              <section>
                <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-4">
                  Chủ đề
                </h4>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => handleTagToggle(tag.name)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                        selectedTags.includes(tag.name)
                          ? 'bg-forest-leaf text-white border-forest-leaf shadow-md'
                          : 'bg-mist-beige text-on-surface-variant border-basalt-soil/5 hover:border-forest-leaf/30'
                      }`}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </section>

              {/* Sort Filter */}
              <section>
                <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-4">
                  Sắp xếp theo
                </h4>
                <div className="space-y-2">
                  {[
                    { label: 'Mới nhất', value: 'createdAt', dir: 'desc' },
                    { label: 'Lượt xem cao', value: 'viewCount', dir: 'desc' },
                    { label: 'Được thích nhiều', value: 'likeCount', dir: 'desc' },
                    { label: 'Đánh giá tốt', value: 'averageRating', dir: 'desc' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSort(option.value);
                        setDirection(option.dir);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex justify-between items-center ${
                        sort === option.value
                          ? 'bg-forest-leaf/10 text-forest-leaf border border-forest-leaf/20'
                          : 'text-on-surface-variant hover:bg-mist-beige border border-transparent'
                      }`}
                    >
                      {option.label}
                      {sort === option.value && <ChevronRight className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </aside>

        {/* Results Main Area */}
        <main className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <p className="text-sm text-on-surface-variant font-medium">
              Tìm thấy <span className="text-basalt-soil font-bold">{totalElements}</span> kết quả
            </p>
            <div className="flex bg-white p-1 rounded-xl border border-basalt-soil/5 shadow-sm">
              <button className="p-2 text-forest-leaf bg-mist-beige rounded-lg">
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button className="p-2 text-on-surface-variant hover:bg-mist-beige transition-colors rounded-lg">
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="py-32 flex flex-col items-center justify-center gap-4 bg-white rounded-3xl border border-basalt-soil/5 shadow-sm">
              <Loader2 className="w-10 h-10 text-forest-leaf animate-spin" />
              <p className="text-on-surface-variant font-bold animate-pulse">
                Đang tìm kiếm thông tin...
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={{
                      id: post.id,
                      title: post.title,
                      summary: post.summary,
                      tags: post.tags || [],
                      thumbnail: post.thumbnailUrl || undefined,
                      images: post.thumbnailUrl ? [post.thumbnailUrl] : [],
                      viewCount: post.viewCount,
                      likeCount: post.likeCount,
                      favoriteCount: post.favoriteCount,
                      averageRating: post.averageRating,
                      createdAt: post.createdAt,
                    }}
                  />
                ))}
              </div>

              {posts.length === 0 && (
                <div className="py-24 text-center bg-white rounded-3xl border border-basalt-soil/5 shadow-sm">
                  <div className="w-20 h-20 bg-mist-beige rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-8 h-8 text-outline/40" />
                  </div>
                  <h3 className="text-xl font-headline-md text-basalt-soil mb-2">
                    Không tìm thấy bài viết nào
                  </h3>
                  <p className="text-on-surface-variant max-w-sm mx-auto mb-8">
                    Thử thay đổi từ khóa hoặc xóa các bộ lọc để xem thêm nhiều bài viết thú vị khác
                    nhé.
                  </p>
                  <Button
                    onClick={clearFilters}
                    className="bg-forest-leaf hover:bg-forest-leaf/90 text-white rounded-xl font-bold px-8"
                  >
                    Xóa bộ lọc
                  </Button>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-16 flex justify-center gap-3">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i)}
                      className={`w-12 h-12 rounded-xl font-bold text-sm transition-all ${
                        page === i
                          ? 'bg-forest-leaf text-white shadow-lg'
                          : 'bg-white text-on-surface-variant hover:text-forest-leaf hover:border-forest-leaf/30 border border-basalt-soil/5'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};
