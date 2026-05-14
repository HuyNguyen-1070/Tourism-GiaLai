export type NotificationType =
  | 'POST_APPROVED'
  | 'POST_REJECTED'
  | 'POST_PENDING'
  | 'COMMENT'
  | 'SYSTEM';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  relatedPostId?: string;
  createdAt: string;
}
