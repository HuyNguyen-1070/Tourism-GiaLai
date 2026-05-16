import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { setCredentials, logout } from '@/store/slices/authSlice';
import { authApi } from '@/services/api/authApi';
import { useNavigate } from 'react-router-dom';
import { RegisterRequest, User, Role } from '@/types/auth';

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
  const { isAuthenticated, account, accessToken, refreshToken } = useSelector(
    (state: RootState) => state.auth
  );

  const login = async (username: string, password: string) => {
    try {
      const response = await authApi.login({ username, password });
      const loginData = response.data;
      if (!loginData) throw new Error('Invalid response structure');

      const { accessToken, refreshToken, account: accountDto } = loginData;

      const user: User = {
        id: accountDto.id,
        fullName: accountDto.fullName || '',
        username: accountDto.username || username,
        email: accountDto.email,
        avatar: accountDto.avatar,
        roles: accountDto.roles as Role[],
        phone: '',
        address: '',
      };

      dispatch(setCredentials({ accessToken, refreshToken, account: user }));
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
      const errorData = err.response?.data;
      let errorMessage = 'Đăng ký thất bại';
      if (errorData) {
        if (typeof errorData.message === 'string') {
          errorMessage = errorData.message;
        } else if (errorData.message && typeof errorData.message === 'object') {
          const firstKey = Object.keys(errorData.message)[0];
          errorMessage = errorData.message[firstKey] || 'Đăng ký thất bại';
        }
      }
      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  const logoutUser = async () => {
    try {
      const currentRefreshToken = refreshToken;
      if (currentRefreshToken) await authApi.logout(currentRefreshToken);
    } catch (error) {
      console.error('Logout API error:', error);
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

  const verifyOtp = async (
    email: string,
    otp: string,
    type: 'register' | 'forgot-password' = 'forgot-password'
  ) => {
    try {
      if (type === 'register') {
        await authApi.verifyRegistration({ email, otp });
      } else {
        await authApi.verifyCode({ email, otp });
      }
      return { success: true };
    } catch (error: unknown) {
      const err = error as ErrorResponse;
      return {
        success: false,
        message: err.response?.data?.message || 'Mã OTP không hợp lệ',
      };
    }
  };

  const resetPassword = async (email: string, otp: string, newPassword: string) => {
    try {
      await authApi.resetPassword({ email, otp, newPassword });
      return { success: true };
    } catch (error: unknown) {
      const err = error as ErrorResponse;
      return {
        success: false,
        message: err.response?.data?.message || 'Đặt lại mật khẩu thất bại',
      };
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const resendCode = async (email: string, _type: 'register' | 'forgot-password') => {
    try {
      await authApi.forgotPassword({ email });
      return { success: true };
    } catch (error: unknown) {
      const err = error as ErrorResponse;
      return {
        success: false,
        message: err.response?.data?.message || 'Gửi lại mã thất bại',
      };
    }
  };

  const loginGoogle = async (idToken: string) => {
    try {
      const response = await authApi.googleLogin(idToken);
      const loginData = response.data;
      if (!loginData) throw new Error('Invalid response structure');

      const { accessToken, refreshToken, account: accountDto } = loginData;

      const user: User = {
        id: accountDto.id,
        fullName: accountDto.fullName || '',
        username: accountDto.username || '',
        email: accountDto.email,
        avatar: accountDto.avatar,
        roles: accountDto.roles as Role[],
        phone: '',
        address: '',
      };

      dispatch(setCredentials({ accessToken, refreshToken, account: user }));
      return { success: true };
    } catch (error: unknown) {
      const err = error as ErrorResponse;
      return {
        success: false,
        message: err.response?.data?.message || 'Đăng nhập Google thất bại',
      };
    }
  };

  return {
    isAuthenticated,
    user: account,
    accessToken,
    refreshToken,
    login,
    register,
    loginGoogle,
    logout: logoutUser,
    forgotPassword,
    verifyOtp,
    resetPassword,
    resendCode,
  };
};
