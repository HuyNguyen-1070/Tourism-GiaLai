import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store/store';
import { logout } from '@/store/slices/authSlice';
import { Role } from '@/types/auth';
import { isTokenExpired } from '@/utils/tokenUtils';

interface ProtectedRouteProps {
  allowedRoles: Role[];
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const dispatch = useDispatch();
  const { account, accessToken, refreshToken } = useSelector((state: RootState) => state.auth);

  // Không có token → chuyển về login
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // Kiểm tra refreshToken hết hạn (refreshToken là token "sống" lâu nhất).
  // Nếu refreshToken hết hạn → toàn bộ session hết hạn → đăng xuất và về login
  if (isTokenExpired(refreshToken, 0)) {
    dispatch(logout());
    return <Navigate to="/login" replace />;
  }

  // Không có account hoặc không đúng role → đăng xuất
  if (!account || !account.roles?.some((role) => allowedRoles.includes(role))) {
    dispatch(logout());
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
