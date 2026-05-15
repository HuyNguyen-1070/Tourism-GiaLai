import api from '../axiosClient';
import { NearbyLocationResponse, AllLocationResponse, LocationDetail } from '@/types/map';

export interface NearbyParams {
  lat: number;
  lng: number;
  radius?: number;
  limit?: number;
  tags?: string;
}

export interface AllLocationParams {
  tags?: string;
  keyword?: string;
}

export const mapApi = {
  getNearbyLocations: (params: NearbyParams) =>
    api.get<NearbyLocationResponse>('/map/nearby', { params }),

  getAllLocations: (params?: AllLocationParams) =>
    api.get<AllLocationResponse>('/map/all-locations', { params }),

  getLocationDetail: (locationId: string) =>
    api.get<LocationDetail>(`/map/locations/${locationId}`),
};
