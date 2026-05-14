import { useState, useEffect, useCallback } from 'react';
import { profileApi } from '@/services/api/profileApi';
import { Profile, ProfileUpdatePayload } from '@/types/profile';
import { useToast } from '@/components/common/ToastNotification';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { updateUserInfo } from '@/store/slices/authSlice';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const getErrorMessage = (err: unknown, fallback: string): string => {
  if (err && typeof err === 'object' && 'response' in err) {
    const apiErr = err as ApiError;
    return apiErr.response?.data?.message || fallback;
  }
  if (err instanceof Error) return err.message;
  return fallback;
};

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const dispatch = useDispatch<AppDispatch>();

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const res = await profileApi.getMyProfile();
      setProfile(res.data);
      dispatch(
        updateUserInfo({
          fullName: res.data.fullName,
          avatar: res.data.avatar,
          phone: res.data.phone,
          address: res.data.address,
        })
      );
    } catch (err: unknown) {
      const message = getErrorMessage(err, 'Không thể tải thông tin hồ sơ');
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  }, [dispatch, showToast]);

  const updateProfile = useCallback(
    async (data: ProfileUpdatePayload) => {
      setLoading(true);
      try {
        const res = await profileApi.updateMyProfile(data);
        setProfile(res.data);
        dispatch(
          updateUserInfo({
            fullName: res.data.fullName,
            phone: res.data.phone,
            address: res.data.address,
          })
        );
        showToast('Cập nhật hồ sơ thành công', 'success');
        return true;
      } catch (err: unknown) {
        const message = getErrorMessage(err, 'Cập nhật thất bại');
        showToast(message, 'error');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [dispatch, showToast]
  );

  const updateAvatar = useCallback(
    async (file: File) => {
      setLoading(true);
      try {
        const res = await profileApi.updateAvatar(file);
        const newAvatarUrl = res.data.avatar;
        setProfile((prev) => (prev ? { ...prev, avatar: newAvatarUrl } : null));
        dispatch(updateUserInfo({ avatar: newAvatarUrl }));
        showToast('Cập nhật ảnh đại diện thành công', 'success');
        return newAvatarUrl;
      } catch (err: unknown) {
        const message = getErrorMessage(err, 'Cập nhật ảnh thất bại');
        showToast(message, 'error');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [dispatch, showToast]
  );

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, fetchProfile, updateProfile, updateAvatar };
};
