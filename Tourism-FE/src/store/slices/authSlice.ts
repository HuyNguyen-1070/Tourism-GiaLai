import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { USER_KEY, TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/utils/constants';
import { User } from '@/types/auth';

interface AuthState {
  isAuthenticated: boolean;
  account: User | null;
  accessToken: string | null;
  refreshToken: string | null;
}

/**
 * Decode JWT payload without verifying signature
 */
const decodeJwtPayload = (token: string): { exp?: number } | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload;
  } catch {
    return null;
  }
};

/**
 * Check if JWT token is expired
 */
const isTokenExpired = (token: string): boolean => {
  const payload = decodeJwtPayload(token);
  if (!payload || !payload.exp) return true;
  // Add 10 second buffer
  return Date.now() / 1000 > payload.exp - 10;
};

/**
 * Load trạng thái auth từ localStorage khi app khởi động.
 * Kiểm tra JWT expiry: nếu accessToken hết hạn → chỉ giữ refreshToken để auto-refresh.
 * Nếu không có refreshToken → xóa storage và trả về trạng thái chưa đăng nhập.
 */
const loadFromStorage = (): AuthState => {
  const accessToken = localStorage.getItem(TOKEN_KEY);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  const accountStr = localStorage.getItem(USER_KEY);

  if (accessToken && refreshToken && accountStr) {
    try {
      const account = JSON.parse(accountStr);
      // Keep state if either access or refresh token exists (axiosClient handles refresh)
      if (!isTokenExpired(accessToken)) {
        return { isAuthenticated: true, account, accessToken, refreshToken };
      }
      // Access token expired but refresh token may still work
      // Keep isAuthenticated=true so axiosClient can refresh on first API call
      if (refreshToken) {
        return { isAuthenticated: true, account, accessToken, refreshToken };
      }
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  }
  return { isAuthenticated: false, account: null, accessToken: null, refreshToken: null };
};

const initialState: AuthState = loadFromStorage();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string; account: User }>
    ) => {
      state.isAuthenticated = true;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.account = action.payload.account;
      localStorage.setItem(TOKEN_KEY, action.payload.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, action.payload.refreshToken);
      localStorage.setItem(USER_KEY, JSON.stringify(action.payload.account));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.accessToken = null;
      state.refreshToken = null;
      state.account = null;
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    },
    updateUserInfo: (state, action: PayloadAction<Partial<User>>) => {
      if (state.account) {
        state.account = { ...state.account, ...action.payload };
        localStorage.setItem(USER_KEY, JSON.stringify(state.account));
      }
    },
  },
});

export const { setCredentials, logout, updateUserInfo } = authSlice.actions;
export default authSlice.reducer;
