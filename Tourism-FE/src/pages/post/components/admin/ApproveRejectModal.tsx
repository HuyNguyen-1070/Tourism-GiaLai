import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Post } from '@/types/post';
import { CheckCircle2, XCircle, User, Tag } from 'lucide-react';

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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!post) return;
    if (action === 'reject' && !reason.trim()) {
      alert('Vui lòng nhập lý do từ chối');
      return;
    }
    setLoading(true);
    try {
      if (action === 'approve') {
        await onApprove(post.id);
      } else if (action === 'reject') {
        await onReject(post.id, reason);
      }
    } finally {
      setLoading(false);
    }
    onClose();
    setReason('');
    setAction(null);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg rounded-2xl p-0 overflow-hidden gap-0">
        {/* Header */}
        <div className="bg-gradient-to-br from-basalt-soil to-primary px-8 py-6 text-white">
          <DialogTitle className="text-white font-headline-md text-headline-md mb-1">
            Xét duyệt bài viết
          </DialogTitle>
          <p className="text-white/60 text-sm">Phê duyệt hoặc từ chối nội dung này</p>
        </div>

        {/* Post info */}
        <div className="px-8 py-6 bg-surface-container/50 border-b border-outline-variant/10">
          <h4 className="font-semibold text-basalt-soil mb-3 line-clamp-2">{post?.title}</h4>
          <div className="flex flex-wrap gap-4 text-sm text-on-surface-variant">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-outline" />
              {post?.authorUsername}
            </span>
            {post?.tags && (
              <span className="flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-outline" />
                {post.tags.slice(0, 3).join(', ')}
              </span>
            )}
          </div>
        </div>

        {/* Action selection */}
        <div className="px-8 py-6 space-y-5">
          <div>
            <p className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-3">
              Chọn hành động
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setAction('approve')}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                  action === 'approve'
                    ? 'border-forest-leaf bg-forest-leaf/5 text-forest-leaf'
                    : 'border-outline-variant/30 hover:border-forest-leaf/40 text-on-surface-variant'
                }`}
              >
                <CheckCircle2
                  className={`w-5 h-5 flex-shrink-0 ${action === 'approve' ? 'text-forest-leaf' : 'text-outline'}`}
                />
                <div>
                  <p className="font-semibold text-sm">Phê duyệt</p>
                  <p className="text-xs opacity-60 mt-0.5">Xuất bản bài viết</p>
                </div>
              </button>
              <button
                onClick={() => setAction('reject')}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                  action === 'reject'
                    ? 'border-red-400 bg-red-50 text-red-600'
                    : 'border-outline-variant/30 hover:border-red-300 text-on-surface-variant'
                }`}
              >
                <XCircle
                  className={`w-5 h-5 flex-shrink-0 ${action === 'reject' ? 'text-red-500' : 'text-outline'}`}
                />
                <div>
                  <p className="font-semibold text-sm">Từ chối</p>
                  <p className="text-xs opacity-60 mt-0.5">Yêu cầu chỉnh sửa</p>
                </div>
              </button>
            </div>
          </div>

          {action === 'reject' && (
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-2">
                Lý do từ chối <span className="text-red-500">*</span>
              </label>
              <Textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Mô tả cụ thể để tác giả biết cần chỉnh sửa điều gì..."
                className="resize-none"
              />
            </div>
          )}

          {/* Footer actions */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!action || loading}
              className={`flex-1 ${
                action === 'approve'
                  ? 'bg-forest-leaf hover:bg-forest-leaf/90'
                  : action === 'reject'
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-outline/30'
              }`}
            >
              {loading
                ? 'Đang xử lý...'
                : action === 'approve'
                  ? 'Xác nhận phê duyệt'
                  : action === 'reject'
                    ? 'Xác nhận từ chối'
                    : 'Xác nhận'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
