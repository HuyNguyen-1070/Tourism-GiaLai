import api from '../axiosClient';
import {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  LoginResponse,
  ApiResponse,
} from '@/types/auth';

export const authApi = {
  register: (data: RegisterRequest) => api.post<ApiResponse>('/api/auth/register', data),

  login: (data: LoginRequest) => api.post<LoginResponse>('/api/auth/login', data),

  logout: () => api.post<ApiResponse>('/api/auth/logout'),

  forgotPassword: (data: ForgotPasswordRequest) =>
    api.post<ApiResponse>('/api/auth/forgot-password', data),

  verifyCode: (data: { email: string; otp: string }) =>
    api.post<ApiResponse>('/api/auth/verify-otp', data),

  resetPassword: (data: { email: string; newPassword: string }) =>
    api.post<ApiResponse>('/api/auth/reset-password', data),
};
