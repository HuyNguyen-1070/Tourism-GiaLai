// ============= Base Pagination =============
export interface PageResponse<T> {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

// ============= Like & Favorite =============
export interface LikeResponse {
    postId: string;
    liked: boolean;
    likeCount: number;
}

export interface FavoriteResponse {
    postId: string;
    favorited: boolean;
    favoriteCount: number;
}

// ============= Post Summary (used in favorites list) =============
export interface PostSummaryResponse {
    id: string;
    title: string;
    summary: string;
    tags: string[];
    authorUsername: string;
    status: string; // 'PENDING' | 'APPROVED' | 'REJECTED' | 'DELETED'
    viewCount: number;
    likeCount: number;
    favoriteCount: number;
    averageRating: number;
    createdAt: string;
    updatedAt: string;
    favoritedAt?: string; // when the user favorited this post
}

// ============= Comments =============
export interface CommentRequest {
    content: string;
}

export interface CommentResponse {
    id: string;
    content: string;
    authorUsername: string;
    authorAvatar?: string;
    createdAt: string;
    updatedAt?: string;
    isEdited: boolean;
}

// ============= Rating =============
export interface RatingRequest {
    score: number; // 0.0, 0.5, 1.0, ... 5.0
}

export interface RatingResponse {
    postId: string;
    myScore: number | null;
    averageRating: number;
    ratingCount: number;
}

// ============= Combined Interaction Status =============
export interface InteractionStatusResponse {
    postId: string;
    liked: boolean;
    favorited: boolean;
    myScore: number | null;
    likeCount: number;
    favoriteCount: number;
    averageRating: number;
    ratingCount: number;
}