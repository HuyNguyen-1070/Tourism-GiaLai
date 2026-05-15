import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY } from '@/utils/constants';
import { User } from '@/types/auth';

interface AuthState {
  isAuthenticated: boolean;
  account: User | null;
  accessToken: string | null;
  refreshToken: string | null;
}

const loadFromStorage = (): AuthState => {
  const accessToken = localStorage.getItem(TOKEN_KEY);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  const accountStr = localStorage.getItem(USER_KEY);

  if (accessToken && refreshToken && accountStr) {
    try {
      const account = JSON.parse(accountStr);
      return { isAuthenticated: true, account, accessToken, refreshToken };
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
