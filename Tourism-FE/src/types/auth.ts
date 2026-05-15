export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface Account {
  id: string;
  email: string;
  roles: Role[];
  fullName?: string;
  username?: string;
  avatar?: string;
}

export interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  avatar?: string;
  phone?: string;
  address?: string;
  roles: Role[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  account: Account;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T = unknown> {
  code: number;
  status: string;
  message: string;
  data?: T;
}

export interface VerifyRegistrationPayload {
  email: string;
  otp: string;
}

export interface ResendCodePayload {
  email: string;
}

export interface AuthVerificationProps {
  type: 'register' | 'forgot-password';
  email: string;
  onVerified: () => void;
  onBack: () => void;
}
