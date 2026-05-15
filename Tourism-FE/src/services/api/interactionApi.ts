import api from '../axiosClient';
import {
  CommentResponse,
  PageResponse,
  LikeResponse,
  FavoriteResponse,
  RatingResponse,
  InteractionStatusResponse,
  CommentRequest,
  RatingRequest,
  PostSummaryResponse,
} from '@/types/interaction';

export const interactionApi = {
  // Like
  toggleLike: (postId: string) => api.post<LikeResponse>(`/posts/${postId}/like`),

  // Favorite
  toggleFavorite: (postId: string) => api.post<FavoriteResponse>(`/posts/${postId}/favorite`),
  getUserFavorites: (params?: { page?: number; size?: number; keyword?: string }) =>
    api.get<PageResponse<PostSummaryResponse>>('/posts/favorites/me', { params }),

  getComments: (postId: string, params?: { page?: number; size?: number }) =>
    api.get<PageResponse<CommentResponse>>(`/posts/${postId}/comments`, { params }),
  addComment: (postId: string, data: CommentRequest) =>
    api.post<CommentResponse>(`/posts/${postId}/comments`, data),
  updateComment: (commentId: string, data: CommentRequest) =>
    api.put<CommentResponse>(`/comments/${commentId}`, data),
  deleteComment: (commentId: string) => api.delete(`/comments/${commentId}`),

  upsertRating: (postId: string, data: RatingRequest) =>
    api.post<RatingResponse>(`/posts/${postId}/rating`, data),
  getMyRating: (postId: string) => api.get<RatingResponse>(`/posts/${postId}/rating/me`),

  getInteractionStatus: (postId: string) =>
    api.get<InteractionStatusResponse>(`/posts/${postId}/interaction-status`),
};
