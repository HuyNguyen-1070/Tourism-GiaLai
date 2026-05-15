import { useState } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { interactionApi } from '@/services/api/interactionApi';
import { CommentItem } from './CommentItem';
import { CommentForm } from './CommentForm';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface CommentSectionProps {
  postId: string;
}

export const CommentSection = ({ postId }: CommentSectionProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['comments', postId],
    queryFn: ({ pageParam = 0 }) =>
      interactionApi.getComments(postId, { page: pageParam, size: 10 }),
    getNextPageParam: (lastPage) => {
      if (lastPage.data.page < lastPage.data.totalPages - 1) return lastPage.data.page + 1;
      return undefined;
    },
    initialPageParam: 0,
  });

  const addMutation = useMutation({
    mutationFn: (content: string) => interactionApi.addComment(postId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      toast.success('Bình luận đã được đăng');
    },
    onError: () => toast.error('Không thể đăng bình luận'),
  });

  const comments = data?.pages.flatMap((p) => p.data.content) || [];

  return (
    <section className="mt-12 pt-8 border-t border-outline-variant/20">
      <h3 className="font-headline-md text-headline-md text-primary mb-6">
        Bình luận ({data?.pages[0]?.data.totalElements || 0})
      </h3>

      {user && (
        <CommentForm
          onSubmit={(content) => addMutation.mutate(content)}
          isSubmitting={addMutation.isPending}
        />
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-secondary" size={32} />
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} postId={postId} />
          ))}
          {hasNextPage && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? 'Đang tải...' : 'Xem thêm bình luận'}
              </Button>
            </div>
          )}
          {comments.length === 0 && (
            <p className="text-on-surface-variant text-center py-8">
              Chưa có bình luận nào. Hãy là người đầu tiên!
            </p>
          )}
        </div>
      )}
    </section>
  );
};
