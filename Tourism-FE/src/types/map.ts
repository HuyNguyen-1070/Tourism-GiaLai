export interface LatLng {
  lat: number;
  lng: number;
}

export interface NearbyLocationItem {
  locationId: string;
  postId: string;
  postTitle: string;
  postThumbnailUrl: string | null;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  placeId: string | null;
  distance: number;
  tags: string[];
  averageRating: number;
  likeCount: number;
}

export interface AllLocationItem {
  locationId: string;
  postId: string;
  postTitle: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  placeId: string | null;
  thumbnailUrl: string | null;
  tags: string[];
  averageRating: number;
}

export interface NearbyLocationResponse {
  userLocation: LatLng;
  radius: number;
  totalFound: number;
  locations: NearbyLocationItem[];
}

export interface AllLocationResponse {
  total: number;
  locations: AllLocationItem[];
}

export interface LocationDetail {
  locationId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  placeId: string | null;
  post: {
    id: string;
    title: string;
    summary: string;
    thumbnail: string | null;
    images: string[];
    tags: string[];
    authorUsername: string | null;
    sourceName: string | null;
    viewCount: number;
    likeCount: number;
    averageRating: number;
    ratingCount: number;
  };
}
