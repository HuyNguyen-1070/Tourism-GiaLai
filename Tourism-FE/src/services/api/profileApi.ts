import api from '@/services/axiosClient';
import { Profile, ProfileUpdatePayload } from '@/types/profile';

export const profileApi = {
  getMyProfile: () => api.get<Profile>('/profile/me'),
  updateMyProfile: (data: ProfileUpdatePayload) => api.patch<Profile>('/profile/me', data),
  updateAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatarFile', file);
    return api.patch<{ avatar: string }>('/profile/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
