import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { setCredentials, logout } from '@/store/slices/authSlice';
import { authApi } from '@/services/api/authApi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import type { RegisterRequest } from '@/types/auth';

type ApiErrorPayload = { message?: string };

const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorPayload | undefined;
    return data?.message ?? fallback;
  }

  if (error instanceof Error) return error.message;

  return fallback;
};

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isAuthenticated, user, token } = useSelector((state: RootState) => state.auth);

  const login = async (username: string, password: string) => {
    try {
      const response = await authApi.login({ username, password });
      const { token, userId, username: userName, role } = response.data;
      dispatch(
        setCredentials({
          token,
          user: { userId, username: userName, role },
        })
      );
      return { success: true };
    } catch (error: unknown) {
      return {
        success: false,
        message: getApiErrorMessage(error, 'Đăng nhập thất bại'),
      };
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      await authApi.register(data);
      return { success: true };
    } catch (error: unknown) {
      return {
        success: false,
        message: getApiErrorMessage(error, 'Đăng ký thất bại'),
      };
    }
  };

  const logoutUser = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore
    } finally {
      dispatch(logout());
      navigate('/login');
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await authApi.forgotPassword({ email });
      return { success: true };
    } catch (error: unknown) {
      return {
        success: false,
        message: getApiErrorMessage(error, 'Gửi yêu cầu thất bại'),
      };
    }
  };

  const resetPassword = async (email: string, otp: string, newPassword: string) => {
    try {
      await authApi.resetPassword({ email, otp, newPassword });
      return { success: true };
    } catch (error: unknown) {
      return {
        success: false,
        message: getApiErrorMessage(error, 'Đặt lại mật khẩu thất bại'),
      };
    }
  };

  return {
    isAuthenticated,
    user,
    token,
    login,
    register,
    logoutUser,
    forgotPassword,
    resetPassword,
  };
};
