import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { interactionApi } from '@/services/api/interactionApi';
import { CommentResponse } from '@/types/interaction';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface CommentItemProps {
  comment: CommentResponse;
  postId: string;
}

export const CommentItem = ({ comment, postId }: CommentItemProps) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const queryClient = useQueryClient();

  const isOwner = user?.username === comment.authorUsername;
  const isAdmin = user?.roles?.includes('ADMIN');

  const updateMutation = useMutation({
    mutationFn: (content: string) => interactionApi.updateComment(comment.id, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      setIsEditing(false);
      toast.success('Đã cập nhật bình luận');
    },
    onError: () => toast.error('Cập nhật thất bại'),
  });

  const deleteMutation = useMutation({
    mutationFn: () => interactionApi.deleteComment(comment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      toast.success('Đã xóa bình luận');
    },
    onError: () => toast.error('Xóa thất bại'),
  });

  return (
    <div className="flex gap-4 p-4 rounded-xl bg-surface-container-low">
      <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
        {comment.authorAvatar ? (
          <img
            src={comment.authorAvatar}
            alt={comment.authorUsername}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="material-symbols-outlined text-secondary">account_circle</span>
        )}
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-primary">{comment.authorUsername}</span>
          <span className="text-xs text-outline">
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: vi })}
          </span>
          {comment.isEdited && <span className="text-xs text-outline">(đã chỉnh sửa)</span>}
        </div>

        {isEditing ? (
          <div className="space-y-3">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={3}
              className="w-full"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => updateMutation.mutate(editContent)}
                disabled={updateMutation.isPending}
              >
                <Check size={14} className="mr-1" /> Lưu
              </Button>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                <X size={14} className="mr-1" /> Hủy
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-on-surface">{comment.content}</p>
        )}

        {(isOwner || isAdmin) && !isEditing && (
          <div className="flex gap-3 mt-2">
            {isOwner && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs text-secondary hover:underline flex items-center gap-1"
              >
                <Pencil size={12} /> Sửa
              </button>
            )}
            <button
              onClick={() => deleteMutation.mutate()}
              className="text-xs text-error hover:underline flex items-center gap-1"
            >
              <Trash2 size={12} /> Xóa
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
