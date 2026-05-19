import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  Tags,
  MapPin,
  History,
  Settings,
  ChevronLeft,
  Menu,
  LogOut,
  Bell,
  Search,
  UserCircle,
  Landmark,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Hồ sơ cá nhân', icon: UserCircle, path: '/admin/profile' },
    { name: 'Quản lý người dùng', icon: Users, path: '/admin/users' },
    { name: 'Quản lý bài viết', icon: FileText, path: '/admin/posts' },
    { name: 'Quản lý Tag', icon: Tags, path: '/admin/tags' },
    { name: 'Quản lý Địa điểm', icon: MapPin, path: '/admin/locations' },
    { name: 'Lịch sử & Văn hoá', icon: Landmark, path: '/admin/history-timeline' },
    { name: 'Lịch sử hệ thống', icon: History, path: '/admin/logs' },
    { name: 'Cài đặt', icon: Settings, path: '/admin/settings' },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-mist-beige flex">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-basalt-soil/40 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`bg-basalt-soil text-white transition-all duration-300 flex flex-col z-50 
          fixed top-0 left-0 h-screen overflow-hidden shadow-2xl lg:shadow-none
          ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-20 lg:w-20 -translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Sidebar Logo Area */}
        <div className="p-4 flex items-center justify-between shrink-0 h-20 border-b border-white/5 overflow-hidden">
          {isSidebarOpen ? (
            <Link to="/" className="flex items-center gap-2 animate-in fade-in duration-300">
              <svg
                width="auto"
                height="100%"
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
                  fill="#ffffff"
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
          ) : (
            <div className="mx-auto animate-in zoom-in duration-300">
              <svg width="32" height="32" viewBox="30 10 80 60" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M40 50L70 15L100 50M55 50L70 30L85 50"
                  stroke="#4B940A"
                  strokeWidth="5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M30 60H110" stroke="#ffdcbe" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="hidden lg:flex p-1 rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-all"
          >
            {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Sidebar Navigation - Scrollable */}
        <nav className="flex-1 px-3 space-y-1 mt-6 overflow-y-auto scrollbar-hide">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative ${
                  isActive
                    ? 'bg-forest-leaf text-white shadow-md'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                } ${!isSidebarOpen ? 'justify-center px-0' : ''}`}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-transform ${isActive ? '' : 'group-hover:scale-110'}`}
                />
                {isSidebarOpen && (
                  <span className="font-bold text-sm whitespace-nowrap animate-in fade-in duration-300">
                    {item.name}
                  </span>
                )}
                {!isSidebarOpen && (
                  <div className="absolute left-full ml-4 px-2 py-1 bg-basalt-soil text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl border border-white/10 z-50">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer Area */}
        <div className="p-4 border-t border-white/5 shrink-0 bg-black/5">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full px-3 py-3 rounded-xl text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all group ${!isSidebarOpen ? 'justify-center px-0' : ''}`}
          >
            <LogOut className="w-5 h-5 shrink-0 group-hover:-translate-x-1 transition-transform" />
            {isSidebarOpen && (
              <span className="font-bold text-sm animate-in fade-in duration-300">Đăng xuất</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 flex flex-col min-w-0 min-h-screen transition-all duration-300 ${isSidebarOpen ? 'lg:pl-64' : 'lg:pl-20'}`}
      >
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-basalt-soil hover:bg-slate-100 rounded-xl"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-headline-md text-basalt-soil flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-forest-leaf"></span>
              {menuItems.find((i) => i.path === location.pathname)?.name || 'Hệ thống Quản trị'}
            </h2>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm nhanh..."
                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-forest-leaf/20 w-48 lg:w-64 transition-all"
              />
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
              </button>

              <div className="h-8 w-[1px] bg-slate-200 hidden sm:block"></div>

              <Link
                to="/admin/profile"
                className="flex items-center gap-3 group hover:bg-slate-100 p-1.5 rounded-2xl transition-all cursor-pointer"
              >
                <div className="text-right hidden md:block">
                  <p className="text-sm font-bold text-basalt-soil leading-tight group-hover:text-forest-leaf transition-colors">
                    {user?.fullName}
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                    {user?.roles?.[0] || 'Administrator'}
                  </p>
                </div>
                <img
                  src={user?.avatar || 'https://via.placeholder.com/40'}
                  alt="admin"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-forest-leaf/10 group-hover:ring-forest-leaf transition-all shadow-sm"
                />
              </Link>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-10 animate-in fade-in duration-500">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
