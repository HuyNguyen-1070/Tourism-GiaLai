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
    <div className="min-h-screen bg-slate-50 pt-20">
      {/* Search Header */}
      <div className="bg-white border-b border-slate-200 sticky top-20 z-30">
        <div className="container-custom py-6">
          <div className="max-w-4xl mx-auto relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Khám phá Gia Lai: tiêu đề, nội dung, địa điểm..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-16 pr-6 py-5 bg-slate-100 border-none rounded-3xl text-lg font-medium focus:ring-4 focus:ring-forest-leaf/10 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="container-custom py-12 flex flex-col lg:flex-row gap-12">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-72 shrink-0 space-y-8">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-basalt-soil uppercase tracking-widest flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Bộ lọc
              </h3>
              {(selectedTags.length > 0 || keyword) && (
                <button
                  onClick={clearFilters}
                  className="text-xs font-bold text-forest-leaf hover:underline"
                >
                  Xoá tất cả
                </button>
              )}
            </div>

            <div className="space-y-6">
              {/* Tags Filter */}
              <section>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                  Chủ đề
                </h4>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => handleTagToggle(tag.name)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        selectedTags.includes(tag.name)
                          ? 'bg-forest-leaf text-white shadow-lg shadow-forest-leaf/20'
                          : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </section>

              {/* Sort Filter */}
              <section>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
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
                          ? 'bg-forest-leaf/5 text-forest-leaf'
                          : 'text-slate-500 hover:bg-slate-100'
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
          <div className="flex justify-between items-center mb-8">
            <p className="text-sm text-slate-500 font-medium">
              Tìm thấy <span className="text-basalt-soil font-bold">{totalElements}</span> kết quả
            </p>
            <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
              <button className="p-2 text-forest-leaf bg-forest-leaf/5 rounded-lg">
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg">
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="py-40 flex flex-col items-center gap-6">
              <Loader2 className="w-12 h-12 text-forest-leaf animate-spin" />
              <p className="text-slate-400 font-medium animate-pulse">
                Đang truy vấn kho dữ liệu...
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={{
                      ...post,
                      thumbnail: post.thumbnailUrl || undefined,
                    }}
                  />
                ))}
              </div>

              {posts.length === 0 && (
                <div className="py-32 text-center bg-white rounded-[40px] border border-slate-100">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-basalt-soil mb-2">
                    Không tìm thấy bài viết nào
                  </h3>
                  <p className="text-slate-500 max-w-sm mx-auto">
                    Thử thay đổi từ khoá hoặc xoá các bộ lọc để có thêm kết quả bạn nhé.
                  </p>
                  <Button variant="outline" className="mt-8 rounded-full" onClick={clearFilters}>
                    Xoá tất cả bộ lọc
                  </Button>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-16 flex justify-center gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i)}
                      className={`w-12 h-12 rounded-2xl font-bold text-sm transition-all ${
                        page === i
                          ? 'bg-forest-leaf text-white shadow-xl shadow-forest-leaf/20 scale-110'
                          : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200 shadow-sm'
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
