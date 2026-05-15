import api from '../axiosClient';
import { Post } from '@/types/post';
import { HistoryTimeline, TourismOverview, PaginatedResponse } from '@/types/content';

export const contentApi = {
  getFeaturedPosts: () => api.get<Post[]>('/homepage/featured-posts'),

  getAttractiveLocations: () => api.get<Post[]>('/homepage/attractive-locations'),

  getCulturalEvents: () => api.get<Post[]>('/homepage/cultural-events'),

  getHistoryTimeline: () => api.get<HistoryTimeline[]>('/history-timeline'),

  getTourismOverview: () => api.get<TourismOverview>('/tourism-overview'),

  getEventsAndFestivals: (params: any) =>
    api.get<PaginatedResponse<Post>>('/events-festivals', { params }),

  getAttractions: (params: any) => api.get<PaginatedResponse<Post>>('/attractions', { params }),

  getAttractionDetail: (postId: string) => api.get<Post>(`/attractions/${postId}`),
};
