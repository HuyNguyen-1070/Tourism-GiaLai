import { PostStatus } from '@/types/post';
import { CheckCircle2, Clock, XCircle, Trash2 } from 'lucide-react';

interface PostStatusBadgeProps {
  status: PostStatus;
}

export const PostStatusBadge = ({ status }: PostStatusBadgeProps) => {
  const config = {
    PENDING: {
      label: 'Chờ duyệt',
      icon: Clock,
      className: 'bg-amber-100 text-amber-800 border border-amber-200',
    },
    APPROVED: {
      label: 'Đã duyệt',
      icon: CheckCircle2,
      className: 'bg-forest-leaf/90 text-white',
    },
    REJECTED: {
      label: 'Từ chối',
      icon: XCircle,
      className: 'bg-red-500/90 text-white',
    },
    DELETED: {
      label: 'Đã xóa',
      icon: Trash2,
      className: 'bg-gray-400/90 text-white',
    },
  };

  const currentConfig = config[status as keyof typeof config];

  if (!currentConfig) return null;

  const { label, icon: Icon, className } = currentConfig;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${className}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  );
};
