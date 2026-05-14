import { useNotifications } from '@/hooks/useNotifications';
import { NotificationItem } from '../notification/components/NotificationItem';
import { Loader2 } from 'lucide-react';

export const NotificationListPage = () => {
  const { notifications, loading, markAsRead } = useNotifications();

  return (
    <div className="space-y-8">
      <div className="border-l-4 border-forest-leaf pl-6">
        <h1 className="font-headline-lg text-headline-lg text-basalt-soil">Thông báo</h1>
        <p className="text-on-surface-variant mt-2">
          Cập nhật trạng thái bài viết và hoạt động của bạn.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-forest-leaf" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed">
          Không có thông báo nào.
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notif) => (
            <NotificationItem key={notif.id} notification={notif} onMarkAsRead={markAsRead} />
          ))}
        </div>
      )}
    </div>
  );
};
