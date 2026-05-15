import { MainLayout as Layout } from '@/layouts/MainLayout';
import { Dashboard } from '@/pages/home/Dashboard';
import { Login } from '@/pages/auth/Login';
import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { Register } from '@/pages/auth/Register';
import { ForgotPassword } from '@/pages/auth/ForgotPassword';
import { ProfilePage } from '@/pages/profile/ProfilePage';
import { CreatePostPage } from '@/pages/post/CreatePostPage';
import { MyPostsPage } from '@/pages/post/MyPostsPage';
import { EditPostPage } from '@/pages/post/EditPostPage';
import { NotificationListPage } from '@/pages/notification/NotificationListPage';
import { AdminPostListPage } from '@/pages/post/AdminPostListPage';
import { RootRedirect } from './RootRedirect';
import { UnauthorizedPage } from '@/pages/error/UnauthorizedPage';
import { FavoritesPage } from '@/pages/post/FavoritesPage';
import { PostDetailPage } from '@/pages/post/PostDetailPage';

export const router = createBrowserRouter([
  { path: '/', element: <RootRedirect /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/unauthorized', element: <UnauthorizedPage /> },

  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { path: '', element: <Dashboard /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'my-posts', element: <MyPostsPage /> },
      { path: 'create-post', element: <CreatePostPage /> },
      { path: 'edit-post/:id', element: <EditPostPage /> },
      { path: 'notifications', element: <NotificationListPage /> },
      { path: 'posts', element: <AdminPostListPage /> },
      {
        path: 'favorites',
        element: <FavoritesPage />,
      },
      {
        path: '/posts/:id',
        element: <PostDetailPage />,
      },
    ],
  },
  {
    path: '/',
    element: (
      <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'my-posts', element: <MyPostsPage /> },
      { path: 'create-post', element: <CreatePostPage /> },
      { path: 'edit-post/:id', element: <EditPostPage /> },
      { path: 'notifications', element: <NotificationListPage /> },
      {
        path: 'favorites',
        element: <FavoritesPage />,
      },
      {
        path: '/posts/:id',
        element: <PostDetailPage />,
      },
    ],
  },
]);
