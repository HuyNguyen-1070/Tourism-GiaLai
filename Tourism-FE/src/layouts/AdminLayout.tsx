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
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Quản lý người dùng', icon: Users, path: '/admin/users' },
    { name: 'Quản lý bài viết', icon: FileText, path: '/admin/posts' },
    { name: 'Quản lý Tag', icon: Tags, path: '/admin/tags' },
    { name: 'Quản lý Địa điểm', icon: MapPin, path: '/admin/locations' },
    { name: 'Lịch sử hệ thống', icon: History, path: '/admin/logs' },
    { name: 'Cài đặt', icon: Settings, path: '/admin/settings' },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside
        className={`bg-basalt-soil text-white transition-all duration-300 flex flex-col z-50 fixed lg:static h-full ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && (
            <Link to="/" className="font-headline-md text-xl text-forest-leaf tracking-tight">
              Gia Lai <span className="text-white">Admin</span>
            </Link>
          )}
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1 mt-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${
                  isActive
                    ? 'bg-forest-leaf text-white shadow-lg shadow-forest-leaf/20'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 ${isActive ? '' : 'group-hover:scale-110 transition-transform'}`}
                />
                {isSidebarOpen && <span className="font-bold text-sm">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors group"
          >
            <LogOut className="w-5 h-5 shrink-0 group-hover:-translate-x-1 transition-transform" />
            {isSidebarOpen && <span className="font-bold text-sm">Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-0' : ''}`}
      >
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-headline-md text-basalt-soil hidden md:block">
              {menuItems.find((i) => i.path === location.pathname)?.name || 'Hệ thống Quản trị'}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm nhanh..."
                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-forest-leaf/20 w-64 transition-all"
              />
            </div>

            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-basalt-soil">{user?.fullName}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  {user?.roles?.join(', ')}
                </p>
              </div>
              <img
                src={user?.avatar || 'https://via.placeholder.com/40'}
                alt="admin"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-forest-leaf/10"
              />
            </div>
          </div>
        </header>

        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
