import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '@/store/store';

export const RootRedirect = () => {
  const { isAuthenticated, account } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const isAdmin = account?.roles?.includes('ADMIN');
  return <Navigate to={isAdmin ? '/admin/dashboard' : '/'} replace />;
};
