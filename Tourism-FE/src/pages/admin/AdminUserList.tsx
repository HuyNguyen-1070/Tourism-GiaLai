import { useEffect, useState, useCallback } from 'react';
import { adminApi } from '@/services/api/adminApi';
import { UserSummary } from '@/types/admin';
import {
  Search,
  Filter,
  MoreVertical,
  Lock,
  Unlock,
  Shield,
  Eye,
  Loader2,
  ChevronLeft,
  ChevronRight,
  UserPlus,
} from 'lucide-react';
import { toast } from 'sonner';
import { Role } from '@/types/auth';

export const AdminUserList = () => {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [role, setRole] = useState('');
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers({
        page,
        size: 10,
        keyword: keyword || undefined,
        role: role || undefined,
        isActive,
      });
      setUsers(res.data?.content || []);
      setTotalPages(res.data?.totalPages || 0);
    } catch (error) {
      toast.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  }, [page, keyword, role, isActive]);

  useEffect(() => {
    const timer = setTimeout(fetchUsers, 500);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const handleToggleActive = async (userId: string) => {
    try {
      await adminApi.toggleActive(userId);
      toast.success('Cập nhật trạng thái người dùng thành công');
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleAssignRole = async (userId: string, currentRoles: Role[]) => {
    const isCurrentlyAdmin = currentRoles.includes(Role.ADMIN);
    const newRole = Role.ADMIN;
    const action = isCurrentlyAdmin ? 'REVOKE' : 'GRANT';

    try {
      await adminApi.assignRole(userId, { roleName: newRole, action });
      toast.success(`Đã ${action === 'GRANT' ? 'cấp' : 'thu hồi'} quyền Admin`);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-headline-md text-basalt-soil">Quản lý người dùng</h1>
        <button className="flex items-center gap-2 px-6 py-3 bg-forest-leaf text-white rounded-2xl font-bold text-sm hover:shadow-lg hover:shadow-forest-leaf/20 transition-all">
          <UserPlus className="w-4 h-4" />
          Thêm quản trị viên
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên, email, username..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-forest-leaf/20"
          />
        </div>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="px-6 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-500 focus:ring-2 focus:ring-forest-leaf/20"
        >
          <option value="">Tất cả vai trò</option>
          <option value={Role.USER}>Người dùng</option>
          <option value={Role.ADMIN}>Quản trị viên</option>
        </select>

        <select
          value={isActive === undefined ? '' : String(isActive)}
          onChange={(e) =>
            setIsActive(e.target.value === '' ? undefined : e.target.value === 'true')
          }
          className="px-6 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-500 focus:ring-2 focus:ring-forest-leaf/20"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="true">Đang hoạt động</option>
          <option value="false">Đang bị khoá</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-forest-leaf animate-spin" />
            <p className="text-sm text-slate-400">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest font-bold border-b border-slate-100">
                    <th className="py-4 pl-6">Người dùng</th>
                    <th className="py-4">Vai trò</th>
                    <th className="py-4">Bài viết</th>
                    <th className="py-4">Ngày tham gia</th>
                    <th className="py-4">Trạng thái</th>
                    <th className="py-4 pr-6 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 pl-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar || 'https://via.placeholder.com/40'}
                            alt=""
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="text-sm font-bold text-basalt-soil">{user.fullName}</p>
                            <p className="text-xs text-slate-400">@{user.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex gap-1">
                          {user.roles.map((r) => (
                            <span
                              key={r}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${r === Role.ADMIN ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}
                            >
                              {r}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 text-sm font-bold text-slate-500">{user.postCount}</td>
                      <td className="py-4 text-xs text-slate-500">
                        {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${user.isActive ? 'bg-forest-leaf/10 text-forest-leaf' : 'bg-red-100 text-red-600'}`}
                        >
                          <span
                            className={`w-1 h-1 rounded-full ${user.isActive ? 'bg-forest-leaf' : 'bg-red-600'}`}
                          ></span>
                          {user.isActive ? 'Hoạt động' : 'Đã khoá'}
                        </span>
                      </td>
                      <td className="py-4 pr-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleAssignRole(user.id, user.roles)}
                            title={
                              user.roles.includes(Role.ADMIN) ? 'Thu hồi Admin' : 'Cấp quyền Admin'
                            }
                            className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          >
                            <Shield className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleActive(user.id)}
                            title={user.isActive ? 'Khoá tài khoản' : 'Mở khoá'}
                            className={`p-2 rounded-lg transition-colors ${user.isActive ? 'text-slate-400 hover:text-red-600 hover:bg-red-50' : 'text-forest-leaf hover:bg-forest-leaf/10'}`}
                          >
                            {user.isActive ? (
                              <Lock className="w-4 h-4" />
                            ) : (
                              <Unlock className="w-4 h-4" />
                            )}
                          </button>
                          <button className="p-2 text-slate-400 hover:text-forest-leaf hover:bg-forest-leaf/5 rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-6 border-t border-slate-100 flex items-center justify-between">
              <p className="text-xs text-slate-400 font-bold uppercase">
                Trang {page + 1} / {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                  className="p-2 rounded-xl bg-slate-50 text-slate-400 disabled:opacity-30 hover:bg-slate-100 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={page === totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                  className="p-2 rounded-xl bg-slate-50 text-slate-400 disabled:opacity-30 hover:bg-slate-100 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
