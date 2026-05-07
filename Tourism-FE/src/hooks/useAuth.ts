import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { setCredentials, logout } from '@/store/slices/authSlice';
import { authApi } from '@/services/api/authApi';
import { useNavigate } from 'react-router-dom';
import { RegisterRequest } from '@/types/auth';

interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

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
      const err = error as ErrorResponse;
      return {
        success: false,
        message: err.response?.data?.message || 'Đăng nhập thất bại',
      };
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      await authApi.register(data);
      return { success: true };
    } catch (error: unknown) {
      const err = error as ErrorResponse;
      return {
        success: false,
        message: err.response?.data?.message || 'Đăng ký thất bại',
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
      const err = error as ErrorResponse;
      return {
        success: false,
        message: err.response?.data?.message || 'Gửi yêu cầu thất bại',
      };
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    try {
      await authApi.verifyCode({ email, otp });
      return { success: true };
    } catch (error: unknown) {
      const err = error as ErrorResponse;
      return {
        success: false,
        message: err.response?.data?.message || 'Mã OTP không hợp lệ',
      };
    }
  };

  const resetPassword = async (email: string, newPassword: string) => {
    try {
      await authApi.resetPassword({ email, newPassword });
      return { success: true };
    } catch (error: unknown) {
      const err = error as ErrorResponse;
      return {
        success: false,
        message: err.response?.data?.message || 'Đặt lại mật khẩu thất bại',
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
    verifyOtp,
    resetPassword,
  };
};
