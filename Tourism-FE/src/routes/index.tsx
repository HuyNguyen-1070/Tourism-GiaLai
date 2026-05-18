import { MainLayout as Layout } from '@/layouts/MainLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { HomePage } from '@/pages/home/HomePage';
import { HistoryPage } from '@/pages/history/HistoryPage';
import { OverviewPage } from '@/pages/overview/OverviewPage';
import { EventsPage } from '@/pages/events/EventsPage';
import { AttractionsPage } from '@/pages/attractions/AttractionsPage';
import { Login } from '@/pages/auth/Login';
import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { Register } from '@/pages/auth/Register';
import { RootRedirect } from './RootRedirect';
import { ForgotPassword } from '@/pages/auth/ForgotPassword';
import { ProfilePage } from '@/pages/profile/ProfilePage';
import { CreatePostPage } from '@/pages/post/CreatePostPage';
import { MyPostsPage } from '@/pages/post/MyPostsPage';
import { EditPostPage } from '@/pages/post/EditPostPage';
import { NotificationListPage } from '@/pages/notification/NotificationListPage';
import { UnauthorizedPage } from '@/pages/error/UnauthorizedPage';
import { FavoritesPage } from '@/pages/post/FavoritesPage';
import { PostDetailPage } from '@/pages/post/PostDetailPage';
import { Role } from '@/types/auth';

// Epic 5 Pages
import { SearchPage } from '@/pages/search/SearchPage';
import { MapPage } from '@/pages/map/MapPage';

// Admin Pages
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminUserList } from '@/pages/admin/AdminUserList';
import { AdminPostList } from '@/pages/admin/AdminPostList';
import { AdminTagList } from '@/pages/admin/AdminTagList';
import { AdminLogList } from '@/pages/admin/AdminLogList';
import { AdminLocationManagement } from '@/pages/admin/AdminLocationManagement';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '', element: <HomePage /> },
      { path: 'history', element: <HistoryPage /> },
      { path: 'overview', element: <OverviewPage /> },
      { path: 'events', element: <EventsPage /> },
      { path: 'attractions', element: <AttractionsPage /> },
      { path: 'posts/:id', element: <PostDetailPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'map', element: <MapPage /> },
    ],
  },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/unauthorized', element: <UnauthorizedPage /> },
  { path: '/dashboard', element: <RootRedirect /> },

  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={[Role.ADMIN]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '', element: <AdminDashboard /> },
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'users', element: <AdminUserList /> },
      { path: 'posts', element: <AdminPostList /> },
      { path: 'tags', element: <AdminTagList /> },
      { path: 'logs', element: <AdminLogList /> },
      { path: 'locations', element: <AdminLocationManagement /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'notifications', element: <NotificationListPage /> },
    ],
  },
  {
    path: '/user',
    element: (
      <ProtectedRoute allowedRoles={[Role.USER, Role.ADMIN]}>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'profile', element: <ProfilePage /> },
      { path: 'my-posts', element: <MyPostsPage /> },
      { path: 'create-post', element: <CreatePostPage /> },
      { path: 'edit-post/:id', element: <EditPostPage /> },
      { path: 'notifications', element: <NotificationListPage /> },
      { path: 'favorites', element: <FavoritesPage /> },
    ],
  },
]);
