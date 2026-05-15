import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Menu, X, User, LogOut, FileText } from 'lucide-react';

export const Header = () => {
  const { user, isAuthenticated, logout } = useAuth(); // đổi tên
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAdmin = user?.roles?.some((role) => role === 'ADMIN');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 w-full bg-mist-beige/95 backdrop-blur-md shadow-sm z-50 border-b border-basalt-soil/10">
      <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop h-20 w-full max-w-container-max mx-auto">
        {/* Logo SVG */}
        <Link to="/" className="flex items-center gap-2">
          <svg
            width="auto"
            height="100%"
            viewBox="0 0 400 80"
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-auto"
          >
            <path
              d="M40 50L70 15L100 50M55 50L70 30L85 50"
              stroke="#205609"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M30 60H110" stroke="#8B5E3C" strokeWidth="3" strokeLinecap="round" />
            <text
              x="130"
              y="48"
              fontFamily="Playfair Display, serif"
              fontSize="32"
              fontWeight="700"
              fill="#205609"
            >
              Gia Lai
            </text>
            <text
              x="130"
              y="68"
              fontFamily="Inter, sans-serif"
              fontSize="13"
              fontWeight="500"
              letterSpacing="3"
              fill="#8B5E3C"
              style={{ textTransform: 'uppercase' }}
            >
              Heritage
            </text>
          </svg>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className="text-on-surface-variant font-label-md hover:text-forest-leaf transition-colors"
          >
            Trang chủ
          </Link>
          <Link
            to="/my-posts"
            className="text-on-surface-variant font-label-md hover:text-forest-leaf transition-colors"
          >
            Bài viết của tôi
          </Link>
          <Link
            to="/create-post"
            className="text-on-surface-variant font-label-md hover:text-forest-leaf transition-colors"
          >
            Đăng bài
          </Link>
          {isAdmin && (
            <Link
              to="/admin/posts"
              className="text-on-surface-variant font-label-md hover:text-forest-leaf transition-colors"
            >
              Quản lý duyệt
            </Link>
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Notifications icon */}
          <Link to="/notifications" className="relative">
            <Bell className="w-5 h-5 text-forest-leaf cursor-pointer" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-tertiary rounded-full"></span>
          </Link>

          {/* User menu */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="bg-primary-fixed text-on-primary-fixed">
                      {user?.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user?.fullName || user?.username}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" /> Hồ sơ
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/my-posts')}>
                  <FileText className="mr-2 h-4 w-4" /> Bài viết của tôi
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={() => navigate('/login')}
              className="bg-forest-leaf text-on-primary hover:opacity-90"
            >
              Đăng nhập
            </Button>
          )}

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-mist-beige border-t border-basalt-soil/10 py-4 px-margin-mobile">
          <nav className="flex flex-col gap-4">
            <Link
              to="/"
              className="text-on-surface-variant"
              onClick={() => setMobileMenuOpen(false)}
            >
              Trang chủ
            </Link>
            <Link
              to="/my-posts"
              className="text-on-surface-variant"
              onClick={() => setMobileMenuOpen(false)}
            >
              Bài viết của tôi
            </Link>
            <Link
              to="/create-post"
              className="text-on-surface-variant"
              onClick={() => setMobileMenuOpen(false)}
            >
              Đăng bài
            </Link>
            {isAdmin && (
              <Link
                to="/admin/posts"
                className="text-on-surface-variant"
                onClick={() => setMobileMenuOpen(false)}
              >
                Quản lý duyệt
              </Link>
            )}
            <Link
              to="/notifications"
              className="text-on-surface-variant"
              onClick={() => setMobileMenuOpen(false)}
            >
              Thông báo
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
