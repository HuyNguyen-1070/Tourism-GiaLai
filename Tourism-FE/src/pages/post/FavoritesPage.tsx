import { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { interactionApi } from '@/services/api/interactionApi';
import { PostCard } from '../post/components/PostCard';
import { Search, Loader2, Bookmark, BookmarkX, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FavoritesPage = () => {
  const [keyword, setKeyword] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['favorites', searchTerm],
    queryFn: ({ pageParam = 0 }) =>
      interactionApi.getUserFavorites({
        page: pageParam,
        size: 9,
        keyword: searchTerm || undefined,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage.data.page < lastPage.data.totalPages - 1) return lastPage.data.page + 1;
      return undefined;
    },
    initialPageParam: 0,
  });

  const favorites = data?.pages.flatMap((p) => p.data.content) || [];
  const total = data?.pages[0]?.data.totalElements ?? 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(keyword);
  };

  return (
    <div className="min-h-screen bg-[#f8f5f0]">
      {/* Header Banner */}
      <div
        className="relative h-52 flex items-end overflow-hidden"
        style={{
          background: 'linear-gradient(90deg, rgb(46, 99, 3) 0%, rgb(75, 148, 10) 100%)',
        }}
      >
        {/* Ethnic dot pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.6) 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="relative z-10 max-w-container-max w-full mx-auto px-margin-mobile md:px-margin-desktop pb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Bookmark className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Bài viết đã lưu</h1>
          </div>
          <p className="text-white/70 text-sm ml-[52px]">Những bài viết bạn đã lưu để đọc sau</p>
        </div>
      </div>

      {/* Stats + Search Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-[73px] z-30">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-4 flex flex-col sm:flex-row items-center gap-4">
          {/* Count badge */}
          <div className="flex items-center gap-2 text-sm font-semibold text-[#205609] bg-[#205609]/10 px-4 py-2 rounded-full whitespace-nowrap">
            <SlidersHorizontal className="w-4 h-4" />
            {isLoading ? '...' : `${total} bài viết`}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 w-full">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm theo tiêu đề..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full pl-11 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#205609]/30 focus:border-[#205609]/40 transition-all"
              />
              {keyword && (
                <button
                  type="button"
                  onClick={() => {
                    setKeyword('');
                    setSearchTerm('');
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl leading-none"
                >
                  ×
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="animate-spin text-[#205609]" size={40} />
            <p className="text-gray-500 text-sm">Đang tải bài viết...</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
            <div className="w-24 h-24 rounded-2xl bg-[#205609]/10 flex items-center justify-center mb-2">
              <BookmarkX className="w-12 h-12 text-[#205609]/40" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700">
              {searchTerm ? 'Không tìm thấy kết quả' : 'Chưa có bài viết đã lưu'}
            </h3>
            <p className="text-gray-400 text-sm max-w-xs">
              {searchTerm
                ? `Không có bài viết nào khớp với "${searchTerm}"`
                : 'Nhấn vào biểu tượng Lưu bài ở trang chi tiết để lưu bài viết yêu thích của bạn.'}
            </p>
            {!searchTerm && (
              <Link
                to="/"
                className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all shadow-lg hover:shadow-xl hover:opacity-90"
                style={{
                  background: 'linear-gradient(90deg, rgb(46, 99, 3) 0%, rgb(75, 148, 10) 100%)',
                }}
              >
                Khám phá bài viết
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {hasNextPage && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold text-white disabled:opacity-60 transition-all shadow-md hover:shadow-lg hover:opacity-90"
                  style={{
                    background: 'linear-gradient(90deg, rgb(46, 99, 3) 0%, rgb(75, 148, 10) 100%)',
                  }}
                >
                  {isFetchingNextPage ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Đang tải...
                    </>
                  ) : (
                    'Tải thêm bài viết'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
