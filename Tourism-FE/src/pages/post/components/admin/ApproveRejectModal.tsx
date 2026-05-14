import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Post } from '@/types/post';

interface ApproveRejectModalProps {
  open: boolean;
  onClose: () => void;
  post: Post | null;
  onApprove: (postId: string) => Promise<void>;
  onReject: (postId: string, reason: string) => Promise<void>;
}

export const ApproveRejectModal = ({
  open,
  onClose,
  post,
  onApprove,
  onReject,
}: ApproveRejectModalProps) => {
  const [reason, setReason] = useState('');
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);

  const handleSubmit = async () => {
    if (!post) return;
    if (action === 'approve') {
      await onApprove(post.id);
    } else if (action === 'reject') {
      if (!reason.trim()) {
        alert('Vui lòng nhập lý do từ chối');
        return;
      }
      await onReject(post.id, reason);
    }
    onClose();
    setReason('');
    setAction(null);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Duyệt bài viết</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>
            <strong>Tiêu đề:</strong> {post?.title}
          </p>
          <p>
            <strong>Tác giả:</strong> {post?.authorUsername}
          </p>
          <div className="flex gap-4 mt-4">
            <Button
              variant={action === 'approve' ? 'default' : 'outline'}
              onClick={() => setAction('approve')}
              className={action === 'approve' ? 'bg-forest-leaf' : ''}
            >
              Phê duyệt
            </Button>
            <Button
              variant={action === 'reject' ? 'destructive' : 'outline'}
              onClick={() => setAction('reject')}
            >
              Từ chối
            </Button>
          </div>
          {action === 'reject' && (
            <div>
              <label className="block font-label-md mb-2">Lý do từ chối *</label>
              <Textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Nhập lý do cụ thể để tác giả biết và chỉnh sửa..."
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={!action}>
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
