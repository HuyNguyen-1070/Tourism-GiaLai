import api from '@/services/axiosClient';
import {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  LoginResponse,
  ApiResponse,
} from '@/types/auth';

export const authApi = {
  register: (data: RegisterRequest) => api.post<ApiResponse>('/api/auth/register', data),

  login: (data: LoginRequest) => api.post<LoginResponse>('/api/auth/login', data),

  logout: () => api.post<ApiResponse>('/api/auth/logout'),

  forgotPassword: (data: ForgotPasswordRequest) =>
    api.post<ApiResponse>('/api/auth/forgot-password', data),

  resetPassword: (data: ResetPasswordRequest) =>
    api.post<ApiResponse>('/api/auth/reset-password', data),
};
