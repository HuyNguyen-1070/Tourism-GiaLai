import api from '../axiosClient';
import {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  LoginResponse,
  ApiResponse,
  RefreshTokenResponse,
  VerifyRegistrationPayload,
  ResendCodePayload,
} from '@/types/auth';

export const authApi = {
  register: (data: RegisterRequest) => api.post<ApiResponse>('/auth/register', data),

  login: (data: LoginRequest) => api.post<ApiResponse<LoginResponse>>('/auth/login', data),
  googleLogin: (idToken: string) =>
    api.post<ApiResponse<LoginResponse>>('/auth/google', { idToken }),

  logout: (refreshToken: string) =>
    api.post<ApiResponse>('/auth/logout', {}, { headers: { 'Refresh-Token': refreshToken } }),

  refreshToken: (refreshToken: string) =>
    api.post<ApiResponse<RefreshTokenResponse>>(
      '/auth/refresh-token',
      {},
      { headers: { 'Refresh-Token': refreshToken } }
    ),

  forgotPassword: (data: ForgotPasswordRequest) =>
    api.post<ApiResponse>('/auth/forgot-password', data),

  verifyCode: (data: { email: string; otp: string }) =>
    api.post<ApiResponse>('/auth/verify-otp', data),

  resetPassword: (data: ResetPasswordRequest) =>
    api.post<ApiResponse>('/auth/reset-password', data),

  verifyRegistration: (data: VerifyRegistrationPayload) =>
    api.post<ApiResponse>('/auth/verify-registration', data),

  resendCode: (data: ResendCodePayload) => api.post<ApiResponse>('/api/auth/resend-otp', data),
};
