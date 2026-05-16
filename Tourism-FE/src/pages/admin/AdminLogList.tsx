import { useEffect, useState, useCallback } from 'react';
import { adminApi } from '@/services/api/adminApi';
import { AdminLog } from '@/types/admin';
import {
  Search,
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

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getLogs({
        page,
        size: 20,
        action: actionFilter || undefined,
      });
      setLogs(res.data?.content || []);
      setTotalPages(res.data?.totalPages || 0);
    } catch (error) {
      toast.error('Không thể tải lịch sử hệ thống');
    } finally {
      setLoading(false);
    }
  }, [page, actionFilter]);

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

  const actionTypes = [
    { label: 'Tất cả hành động', value: '' },
    { label: 'Duyệt bài', value: 'APPROVE_POST' },
    { label: 'Từ chối bài', value: 'REJECT_POST' },
    { label: 'Xóa bài', value: 'DELETE_POST' },
    { label: 'Khoá User', value: 'LOCK_USER' },
    { label: 'Mở khoá User', value: 'UNLOCK_USER' },
    { label: 'Tạo Tag', value: 'CREATE_TAG' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-headline-md text-basalt-soil">Lịch sử hệ thống</h1>
        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-500">
          <Activity className="w-4 h-4" />
          Cập nhật thời gian thực
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setPage(0);
            }}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-500 focus:ring-2 focus:ring-forest-leaf/20 appearance-none"
          >
            {actionTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 px-4">
          <Calendar className="w-4 h-4" />
          <span>Sắp xếp: Mới nhất</span>
        </div>
      </div>

      {/* Log List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-forest-leaf animate-spin" />
            <p className="text-sm text-slate-400">Đang truy xuất nhật ký...</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-slate-50">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row md:items-center gap-6"
                >
                  <div className="flex items-center gap-4 min-w-[200px]">
                    <div className="p-3 rounded-2xl bg-slate-100 text-slate-500">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-basalt-soil">@{log.adminUsername}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        Administrator
                      </p>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getActionColor(log.action)}`}
                      >
                        {log.action}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                        <History className="w-3 h-3" />
                        {new Date(log.createdAt).toLocaleString('vi-VN')}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 font-medium">{log.detail}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                      ID: {log.targetId}
                    </span>
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
