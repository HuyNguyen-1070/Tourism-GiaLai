import { Post } from './post';

export interface HistoryTimeline {
  id: string;
  year: number;
  title: string;
  description: string;
  locationName?: string;
  imageUrl?: string;
  relatedPost?: Partial<Post>;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TourismOverview {
  highlights: string[];
  revenueLastYear: number;
  revenueNote?: string;
  infrastructureInfo: string[];
  updatedAt?: string;
  updatedBy?: string;
}

export interface TagResponse {
  id: string;
  name: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
