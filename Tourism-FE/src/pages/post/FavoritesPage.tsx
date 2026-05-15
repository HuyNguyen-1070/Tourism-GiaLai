import { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { interactionApi } from '@/services/api/interactionApi';
import { PostCard } from '../post/components/PostCard';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(keyword);
  };

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">
      <div className="mb-10">
        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-3">
          Bài viết yêu thích của tôi
        </h1>
        <p className="text-on-surface-variant max-w-2xl">Những bài viết bạn đã lưu để đọc sau</p>
        <div className="h-1 w-24 bg-secondary mt-6" />
      </div>

      <form onSubmit={handleSearch} className="max-w-md mb-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
          <Input
            placeholder="Tìm theo tiêu đề..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="pl-10"
          />
        </div>
      </form>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-secondary" size={40} />
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-6xl text-outline-variant">
            bookmark_outline
          </span>
          <p className="mt-4 text-on-surface-variant">Chưa có bài viết yêu thích nào.</p>
          <Button asChild className="mt-6">
            <a href="/dashboard">Khám phá bài viết</a>
          </Button>
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
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? 'Đang tải...' : 'Tải thêm'}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
