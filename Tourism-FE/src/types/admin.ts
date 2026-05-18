import { Tag } from './post';
import { Role } from './auth';

export interface UserSummary {
  id: string;
  fullName: string;
  username: string;
  email: string;
  avatar: string | null;
  provider: 'LOCAL' | 'GOOGLE';
  isActive: boolean;
  roles: Role[];
  postCount: number;
  createdAt: string;
}

export interface UserStats {
  totalPosts: number;
  approvedPosts: number;
  pendingPosts: number;
  rejectedPosts: number;
}

export interface UserDetail extends Omit<UserSummary, 'postCount'> {
  stats: UserStats;
  updatedAt: string;
}

export interface OverviewStats {
  totalPosts: number;
  pendingPosts: number;
  approvedPosts: number;
  rejectedPosts: number;
  totalUsers: number;
  newUsersLast30Days: number;
  totalTags: number;
  totalLocations: number;
  totalComments: number;
  totalLikes: number;
}

export interface DailyActivity {
  date: string;
  newPosts: number;
  updatedPosts: number;
}

export interface PostActivity {
  month: number;
  year: number;
  totalNew: number;
  totalUpdated: number;
  daily: DailyActivity[];
}

export interface TrendingTag {
  rank: number;
  tagId: string;
  tagName: string;
  postCount: number;
  totalLikes: number;
  totalFavorites: number;
  avgRating: number;
  tagScore: number;
}

export interface PostEngagement {
  rank: number;
  postId: string;
  title: string;
  tags: Tag[];
  authorUsername: string;
  viewCount: number;
  likeCount: number;
  favoriteCount: number;
  averageRating: number;
  engagementScore: number;
}

export interface AdminLog {
  id: string;
  adminId: string;
  adminUsername: string;
  action: string;
  targetId: string;
  targetType: string;
  detail: string;
  createdAt: string;
}
