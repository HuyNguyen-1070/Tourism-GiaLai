/**
 * Utility functions để kiểm tra JWT token có còn hợp lệ hay không.
 * Decode phần payload của JWT (base64) mà không cần thư viện bên ngoài.
 */

interface JwtPayload {
  exp?: number;
  sub?: string;
  iat?: number;
  [key: string]: unknown;
}

/**
 * Decode JWT payload từ token string.
 * Trả về null nếu token không hợp lệ hoặc không decode được.
 */
export const decodeJwtPayload = (token: string): JwtPayload | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    // Base64url → Base64 → decode
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const decoded = atob(padded);
    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
};

/**
 * Kiểm tra token có hết hạn chưa.
 * Trả về true nếu token hết hạn HOẶC không decode được.
 * @param token - JWT access token
 * @param bufferSeconds - thêm buffer (giây) để tránh race condition, mặc định 30s
 */
export const isTokenExpired = (token: string | null, bufferSeconds = 30): boolean => {
  if (!token) return true;

  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== 'number') {
    // Không có exp → coi như không hợp lệ
    return true;
  }

  const nowInSeconds = Math.floor(Date.now() / 1000);
  return payload.exp < nowInSeconds + bufferSeconds;
};

/**
 * Lấy thời gian hết hạn của token (dạng Date).
 * Trả về null nếu không decode được.
 */
export const getTokenExpiry = (token: string | null): Date | null => {
  if (!token) return null;
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== 'number') return null;
  return new Date(payload.exp * 1000);
};
