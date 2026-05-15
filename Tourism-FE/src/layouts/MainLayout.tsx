import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-mist-beige flex flex-col">
      {/* Top Nav */}
      <header className="bg-surface-container-lowest border-b border-secondary/20 sticky top-0 z-50 shadow-sm">
        <div className="max-w-container-max mx-auto px-margin-desktop py-4 flex items-center justify-between">
          <Link
            to="/dashboard"
            className="font-headline-md text-headline-md text-forest-leaf italic"
          >
            Gia Lai Heritage
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/dashboard"
              className="font-label-md text-label-md text-on-surface-variant hover:text-forest-leaf transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/my-posts"
              className="font-label-md text-label-md text-on-surface-variant hover:text-forest-leaf transition-colors"
            >
              My Posts
            </Link>
            <Link
              to="/create-post"
              className="font-label-md text-label-md text-on-surface-variant hover:text-forest-leaf transition-colors"
            >
              Write Post
            </Link>
            <Link
              to="/notifications"
              className="font-label-md text-label-md text-on-surface-variant hover:text-forest-leaf transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              to="/profile"
              className="flex items-center gap-2 font-label-md text-label-md text-on-surface-variant hover:text-forest-leaf transition-colors"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-[22px]">account_circle</span>
              )}
              <span className="hidden md:inline">{user?.fullName || user?.username}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="font-label-md text-label-md text-on-surface-variant hover:text-error transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-highest border-t border-secondary/20 py-6 px-margin-desktop">
        <div className="max-w-container-max mx-auto flex justify-between items-center">
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            © 2024 Gia Lai Tourism & Culture Department
          </span>
          <span className="font-headline-md text-headline-md text-forest-leaf italic">
            Gia Lai Heritage
          </span>
        </div>
      </footer>
    </div>
  );
};
