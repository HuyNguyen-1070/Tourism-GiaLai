import { PostStatus } from '@/types/post';
import { CheckCircle, Clock, XCircle, Trash2 } from 'lucide-react';

interface PostStatusBadgeProps {
  status: PostStatus;
}

export const PostStatusBadge = ({ status }: PostStatusBadgeProps) => {
  const config = {
    PENDING: {
      label: 'Chờ duyệt',
      icon: Clock,
      className: 'bg-secondary-container text-on-secondary-container',
    },
    APPROVED: { label: 'Đã duyệt', icon: CheckCircle, className: 'bg-forest-leaf text-white' },
    REJECTED: { label: 'Bị từ chối', icon: XCircle, className: 'bg-error text-white' },
    DELETED: { label: 'Đã xóa', icon: Trash2, className: 'bg-outline text-white' },
  };
  const { label, icon: Icon, className } = config[status];
  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-label-sm font-semibold ${className}`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </span>
  );
};
