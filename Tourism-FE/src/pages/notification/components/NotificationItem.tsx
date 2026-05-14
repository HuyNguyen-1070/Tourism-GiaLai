import { Notification } from '@/types/notification';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { CheckCircle, XCircle, MessageCircle, Bell, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const iconMap = {
  POST_APPROVED: <CheckCircle className="w-5 h-5 text-forest-leaf" />,
  POST_REJECTED: <XCircle className="w-5 h-5 text-error" />,
  POST_PENDING: <Bell className="w-5 h-5 text-secondary" />,
  COMMENT: <MessageCircle className="w-5 h-5 text-primary" />,
  SYSTEM: <Bell className="w-5 h-5 text-outline" />,
};

export const NotificationItem = ({
  notification,
  onMarkAsRead,
}: {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}) => {
  return (
    <div
      className={`bg-white p-6 rounded-xl border transition-all ${notification.isRead ? 'border-outline-variant/20 opacity-70' : 'border-forest-leaf/30 shadow-sm'}`}
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0">{iconMap[notification.type]}</div>
        <div className="flex-grow">
          <p className="text-on-surface-variant">{notification.message}</p>
          <p className="text-label-sm text-outline mt-1">
            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: vi })}
          </p>
          {notification.relatedPostId && (
            <Link
              to={`/posts/${notification.relatedPostId}`}
              className="inline-block mt-3 text-label-sm text-forest-leaf hover:underline"
            >
              Xem bài viết
            </Link>
          )}
        </div>
        {!notification.isRead && (
          <button
            onClick={() => onMarkAsRead(notification.id)}
            className="flex-shrink-0 text-outline hover:text-forest-leaf"
          >
            <Eye className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
