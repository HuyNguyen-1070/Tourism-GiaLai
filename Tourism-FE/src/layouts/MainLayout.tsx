import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  LogIn,
  UserPlus,
  LogOut,
  User as UserIcon,
  Bell,
  Menu,
  X,
  Search as SearchIcon,
  Map as MapIcon,
} from 'lucide-react';
import { Role } from '@/types/auth';
import { useState } from 'react';

export const MainLayout = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Lịch sử - Văn hóa', path: '/history' },
    { name: 'Tổng quan', path: '/overview' },
    { name: 'Sự kiện', path: '/events' },
    { name: 'Điểm tham quan', path: '/attractions' },
    { name: 'Tìm kiếm', path: '/search' },
    { name: 'Bản đồ', path: '/map' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-mist-beige flex flex-col">
      {/* Top Nav */}
      <header className="bg-white/80 backdrop-blur-md border-b border-basalt-soil/10 sticky top-0 z-50 shadow-sm">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <svg
              width="auto"
              height="100%"
              viewBox="0 0 400 80"
              xmlns="http://www.w3.org/2000/svg"
              className="h-14 w-auto"
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

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-label-md text-label-md transition-all relative py-1 ${
                  isActive(link.path)
                    ? 'text-forest-leaf font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-forest-leaf'
                    : 'text-on-surface-variant hover:text-forest-leaf'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 md:gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  to={
                    user?.roles?.includes(Role.ADMIN)
                      ? '/admin/notifications'
                      : '/user/notifications'
                  }
                  className="p-2 text-on-surface-variant hover:text-forest-leaf transition-colors relative"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
                </Link>

                <div className="h-8 w-[1px] bg-basalt-soil/10 hidden md:block"></div>

                <Link
                  to={user?.roles?.includes(Role.ADMIN) ? '/admin/profile' : '/user/profile'}
                  className="flex items-center gap-2 font-label-md text-label-md text-on-surface-variant hover:text-forest-leaf transition-all px-2 py-1 rounded-full hover:bg-forest-leaf/5"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="avatar"
                      className="w-8 h-8 rounded-full object-cover border border-forest-leaf/20"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-forest-leaf/10 flex items-center justify-center">
                      <UserIcon className="w-4 h-4 text-forest-leaf" />
                    </div>
                  )}
                  <span className="hidden sm:inline font-semibold">
                    {user?.fullName || user?.username}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-on-surface-variant hover:text-error transition-colors"
                  title="Đăng xuất"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-bold text-on-surface-variant hover:text-forest-leaf transition-colors flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Đăng nhập</span>
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 bg-forest-leaf text-white rounded-full text-sm font-bold hover:bg-forest-leaf/90 transition-all shadow-md shadow-forest-leaf/20 flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Đăng ký</span>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-on-surface-variant"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-basalt-soil/10 p-4 animate-in slide-in-from-top duration-300">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`font-label-md text-label-md p-2 rounded-lg transition-colors ${
                    isActive(link.path)
                      ? 'bg-forest-leaf/10 text-forest-leaf font-bold'
                      : 'text-on-surface-variant hover:bg-surface-variant'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {isAuthenticated && (
                <div className="pt-4 mt-4 border-t border-basalt-soil/10 flex flex-col gap-4">
                  <Link to="/dashboard" className="text-on-surface-variant p-2 font-bold">
                    Dashboard
                  </Link>
                  <Link to="/user/my-posts" className="text-on-surface-variant p-2 font-bold">
                    Bài viết của tôi
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Page content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-charcoal-ink text-white py-12 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="col-span-1 md:col-span-2">
              <Link to="/" className="mb-6 block">
                <svg
                  width="auto"
                  height="48"
                  viewBox="0 0 400 80"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-auto"
                >
                  <path
                    d="M40 50L70 15L100 50M55 50L70 30L85 50"
                    stroke="#4B940A"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M30 60H110" stroke="#ffdcbe" strokeWidth="3" strokeLinecap="round" />
                  <text
                    x="130"
                    y="48"
                    fontFamily="Playfair Display, serif"
                    fontSize="32"
                    fontWeight="700"
                    fill="#4B940A"
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
                    fill="#ffdcbe"
                    style={{ textTransform: 'uppercase' }}
                  >
                    Heritage
                  </text>
                </svg>
              </Link>
              <p className="text-white/60 max-w-md leading-relaxed">
                Khám phá vẻ đẹp tiềm ẩn, lịch sử hào hùng và nền văn hóa rực rỡ của vùng đất Gia Lai
                - Trái tim của Tây Nguyên đại ngàn.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6 uppercase tracking-wider text-sm text-forest-leaf">
                Liên kết
              </h4>
              <ul className="flex flex-col gap-4 text-white/60 text-sm">
                {navLinks.map((l) => (
                  <li key={l.path}>
                    <Link to={l.path} className="hover:text-white transition-colors">
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 uppercase tracking-wider text-sm text-forest-leaf">
                Thông tin
              </h4>
              <ul className="flex flex-col gap-4 text-white/60 text-sm">
                <li>Sở Văn hóa, Thể thao và Du lịch tỉnh Gia Lai</li>
                <li>Địa chỉ: 06 Hai Bà Trưng, TP. Pleiku, Gia Lai</li>
                <li>Email: contact@gialaitourism.vn</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-white/40 text-xs">
              © 2026 Gia Lai Tourism & History Department. All rights reserved.
            </span>
            <div className="flex gap-6">
              <div className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center cursor-pointer">
                <span className="text-xs font-bold">FB</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center cursor-pointer">
                <span className="text-xs font-bold">YT</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
