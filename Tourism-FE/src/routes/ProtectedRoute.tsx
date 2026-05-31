import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store/store';
import { logout } from '@/store/slices/authSlice';
import { Role } from '@/types/auth';

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

  // Không có account hoặc không đúng role → chuyển trang unauthorized (không logout)
  if (!account || !account.roles?.some((role) => allowedRoles.includes(role as Role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
