import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { authApi } from '@/services/api/authApi';
import { TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/utils/constants';
import { store } from '@/store/store';
import { logout } from '@/store/slices/authSlice';

const EXCLUDED_AUTH_URLS = ['/api/auth/login', '/api/auth/refresh-token'];

const isAuthExcluded = (url?: string): boolean => {
  if (!url) return false;
  return EXCLUDED_AUTH_URLS.some((excluded) => url.includes(excluded));
};

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  const isExcluded = isAuthExcluded(config.url);
  if (token && !isExcluded) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const response = error.response;

    if (response) {
      switch (response.status) {
        case 401: {
          const isExcluded = isAuthExcluded(originalRequest.url);
          if (!originalRequest._retry && !isExcluded) {
            if (isRefreshing) {
              return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
              })
                .then((token) => {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                  return api(originalRequest);
                })
                .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
              const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
              if (refreshToken) {
                const res = await authApi.refreshToken(refreshToken);
                const newAccessToken = res.data.data?.accessToken;
                const newRefreshToken = res.data.data?.refreshToken;

                if (newAccessToken && newRefreshToken) {
                  localStorage.setItem(TOKEN_KEY, newAccessToken);
                  localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
                  api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
                  processQueue(null, newAccessToken);
                  originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                  return api(originalRequest);
                }
              }
              throw new Error('No refresh token');
            } catch (refreshError) {
              processQueue(refreshError, null);
              localStorage.removeItem(TOKEN_KEY);
              localStorage.removeItem(REFRESH_TOKEN_KEY);
              store.dispatch(logout());
              window.location.href = '/login';
              return Promise.reject(refreshError);
            } finally {
              isRefreshing = false;
            }
          }
          break;
        }
        default:
          // Có thể xử lý toast message cho các lỗi 400, 403, 404, 500 ở đây
          break;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
