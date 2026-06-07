import { useEffect, useState, useCallback } from 'react';
import { adminApi } from '@/services/api/adminApi';
import { AdminLog } from '@/types/admin';
import {
  History,
  User,
  Activity,
  Calendar,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { toast } from 'sonner';

export const AdminLogList = () => {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [actionFilter, setActionFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getLogs({
        page,
        size: 20,
        action: actionFilter || undefined,
        fromDate: fromDate ? `${fromDate}T00:00:00` : undefined,
        toDate: toDate ? `${toDate}T23:59:59` : undefined,
      });
      setLogs(res.data?.content || []);
      setTotalPages(res.data?.totalPages || 0);
    } catch (error) {
      toast.error('Không thể tải lịch sử hệ thống');
    } finally {
      setLoading(false);
    }
  }, [page, actionFilter, fromDate, toDate]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const getActionColor = (action: string) => {
    if (action.includes('APPROVE')) return 'text-forest-leaf bg-forest-leaf/10';
    if (action.includes('REJECT') || action.includes('DELETE') || action.includes('LOCK'))
      return 'text-red-600 bg-red-100';
    if (action.includes('CREATE')) return 'text-blue-600 bg-blue-100';
    return 'text-slate-500 bg-slate-100';
  };

  const translateAction = (action: string) => {
    switch (action) {
      case 'APPROVE_POST':
        return 'Duyệt bài';
      case 'REJECT_POST':
        return 'Từ chối bài';
      case 'DELETE_POST':
        return 'Xóa bài';
      case 'LOCK_USER':
        return 'Khoá tài khoản';
      case 'UNLOCK_USER':
        return 'Mở khoá tài khoản';
      case 'CREATE_TAG':
        return 'Tạo Tag';
      case 'GRANT_ROLE':
        return 'Cấp quyền';
      case 'REVOKE_ROLE':
        return 'Thu hồi quyền';
      default:
        return action;
    }
  };

  const formatDetail = (detail: string) => {
    if (detail.startsWith('User: ')) {
      return `Tài khoản: ${detail.replace('User: ', '')}`;
    }
    if (detail.includes('GRANT role')) {
      return detail.replace('GRANT role', 'Cấp quyền').replace('for user', 'cho tài khoản');
    }
    if (detail.includes('REVOKE role')) {
      return detail.replace('REVOKE role', 'Thu hồi quyền').replace('for user', 'cho tài khoản');
    }
    return detail;
  };

  const actionTypes = [
    { label: 'Tất cả hành động', value: '' },
    { label: 'Duyệt bài', value: 'APPROVE_POST' },
    { label: 'Từ chối bài', value: 'REJECT_POST' },
    { label: 'Xóa bài', value: 'DELETE_POST' },
    { label: 'Khoá tài khoản', value: 'LOCK_USER' },
    { label: 'Mở khoá tài khoản', value: 'UNLOCK_USER' },
    { label: 'Cấp quyền', value: 'GRANT_ROLE' },
    { label: 'Thu hồi quyền', value: 'REVOKE_ROLE' },
    { label: 'Tạo Tag', value: 'CREATE_TAG' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-headline-md text-basalt-soil">Lịch sử hệ thống</h1>
        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-500 shadow-sm">
          <Activity className="w-4 h-4 text-forest-leaf" />
          Cập nhật thời gian thực
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-leaf" />
          <select
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setPage(0);
            }}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold text-basalt-soil focus:ring-2 focus:ring-forest-leaf/20 appearance-none"
          >
            {actionTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 relative">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => {
              setFromDate(e.target.value);
              setPage(0);
            }}
            className="px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold text-basalt-soil focus:ring-2 focus:ring-forest-leaf/20 outline-none"
            title="Từ ngày"
          />
          <span className="text-slate-400 font-medium">-</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => {
              setToDate(e.target.value);
              setPage(0);
            }}
            className="px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold text-basalt-soil focus:ring-2 focus:ring-forest-leaf/20 outline-none"
            title="Đến ngày"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 px-4 bg-slate-50 py-3 rounded-2xl whitespace-nowrap">
          <Calendar className="w-4 h-4" />
          <span>Mới nhất</span>
        </div>
      </div>

      {/* Log List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-forest-leaf animate-spin" />
            <p className="text-sm font-bold text-slate-400">Đang truy xuất nhật ký...</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-slate-100">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="p-6 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center gap-6 group"
                >
                  <div className="flex items-center gap-4 min-w-[220px]">
                    <div className="p-3.5 rounded-2xl bg-forest-leaf/10 text-forest-leaf group-hover:scale-110 transition-transform">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-basalt-soil">@{log.adminUsername}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                        Quản trị viên
                      </p>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${getActionColor(log.action)}`}
                      >
                        {translateAction(log.action)}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md">
                        <History className="w-3.5 h-3.5" />
                        {new Date(log.createdAt).toLocaleString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <p className="text-[15px] text-slate-700 font-medium">
                      {formatDetail(log.detail)}
                    </p>
                  </div>

                  <div className="text-right shrink-0 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                      Mã đối tượng
                    </p>
                    <p className="text-xs font-mono font-bold text-basalt-soil">{log.targetId}</p>
                  </div>
                </div>
              ))}
            </div>

            {logs.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-slate-400 italic">Chưa có nhật ký hoạt động nào.</p>
              </div>
            )}

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
