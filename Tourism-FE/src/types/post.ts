export type PostStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'DELETED';
export type SourceType = 'AUTHOR' | 'EXTERNAL';
export type Tag =
  | 'LOCATION'
  | 'CULTURE'
  | 'HISTORY'
  | 'FESTIVAL'
  | 'FOOD'
  | 'ACCOMMODATION'
  | 'TRANSPORT';

export interface Post {
  id: string;
  title: string;
  content: string;
  summary?: string;
  thumbnail?: string;
  images: string[];
  tags: Tag[];
  sourceType: SourceType;
  sourceName?: string | null;
  authorUsername: string;
  authorFullName?: string;
  status: PostStatus;
  viewCount: number;
  likeCount: number;
  favoriteCount: number;
  averageRating: number;
  ratingCount: number;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectedReason?: string;
}

export interface CreatePostPayload {
  title: string;
  content: string;
  summary?: string;
  tags: Tag[];
  images?: string[];
  sourceType: SourceType;
  sourceName?: string | null;
}

export type UpdatePostPayload = Partial<CreatePostPayload>;

export interface PostListResponse {
  content: Post[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
