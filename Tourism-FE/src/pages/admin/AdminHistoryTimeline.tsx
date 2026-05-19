import { useEffect, useState, useCallback } from 'react';
import { adminApi } from '@/services/api/adminApi';
import { HistoryTimeline } from '@/types/content';
import { Landmark, Search, Plus, Edit2, Trash2, Loader2, Save, X } from 'lucide-react';
import { toast } from 'sonner';

interface HistoryTimelineFormData {
  year: number;
  title: string;
  description: string;
  locationName?: string;
  imageUrl?: string;
  relatedPostId?: string;
  displayOrder?: number;
}

export const AdminHistoryTimeline = () => {
  const [timelines, setTimelines] = useState<HistoryTimeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const initialFormState: HistoryTimelineFormData = {
    year: new Date().getFullYear(),
    title: '',
    description: '',
    locationName: '',
    imageUrl: '',
    relatedPostId: '',
    displayOrder: 0,
  };
  
  const [formData, setFormData] = useState<HistoryTimelineFormData>(initialFormState);

  const fetchTimelines = useCallback(async () => {
    setLoading(true);
    try {
      // Assuming getHistoryTimelines returns an array directly based on BE implementation
      const res = await adminApi.getHistoryTimelines();
      // @ts-ignore
      const data = res.data?.data || res.data || [];
      setTimelines(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Không thể tải danh sách Lịch sử & Văn hoá');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTimelines();
  }, [fetchTimelines]);

  const handleSave = async () => {
    if (!formData.year || !formData.title || !formData.description) {
      toast.warning('Vui lòng điền đầy đủ các thông tin bắt buộc (Năm, Tiêu đề, Mô tả)');
      return;
    }

    try {
      if (editingId) {
        await adminApi.updateHistoryTimeline(editingId, formData);
        toast.success('Đã cập nhật sự kiện lịch sử');
      } else {
        await adminApi.createHistoryTimeline(formData);
        toast.success('Đã thêm sự kiện lịch sử mới');
      }
      setIsEditing(false);
      fetchTimelines();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi lưu sự kiện');
    }
  };

  const handleEdit = (timeline: HistoryTimeline) => {
    setFormData({
      year: timeline.year,
      title: timeline.title,
      description: timeline.description,
      locationName: timeline.locationName || '',
      imageUrl: timeline.imageUrl || '',
      relatedPostId: timeline.relatedPost?.id || '',
      displayOrder: timeline.displayOrder || 0,
    });
    setEditingId(timeline.id);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sự kiện này?')) return;
    try {
      await adminApi.deleteHistoryTimeline(id);
      toast.success('Đã xóa sự kiện lịch sử');
      fetchTimelines();
    } catch (error) {
      toast.error('Lỗi khi xóa sự kiện');
    }
  };

  const filteredTimelines = timelines.filter(t => 
    t.title.toLowerCase().includes(keyword.toLowerCase()) || 
    t.year.toString().includes(keyword)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-headline-md text-basalt-soil">Quản lý Lịch sử & Văn hoá</h1>
        <button
          onClick={() => {
            setFormData(initialFormState);
            setEditingId(null);
            setIsEditing(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-forest-leaf text-white rounded-2xl font-bold text-sm hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          Thêm Sự kiện
        </button>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tiêu đề hoặc năm..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-forest-leaf/20"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-forest-leaf animate-spin" />
            <p className="text-sm text-slate-400">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest font-bold border-b border-slate-100">
                <th className="py-4 pl-8">Năm</th>
                <th className="py-4">Tiêu đề</th>
                <th className="py-4">Địa điểm</th>
                <th className="py-4">Thứ tự hiển thị</th>
                <th className="py-4 pr-8 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredTimelines.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 text-sm">
                    Không tìm thấy sự kiện nào
                  </td>
                </tr>
              ) : (
                filteredTimelines.map((timeline) => (
                  <tr key={timeline.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 pl-8">
                      <div className="font-bold text-forest-leaf text-lg">{timeline.year}</div>
                    </td>
                    <td className="py-4">
                      <div>
                        <p className="text-sm font-bold text-basalt-soil">{timeline.title}</p>
                        <p className="text-xs text-slate-400 line-clamp-1 max-w-sm">{timeline.description}</p>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-slate-600">
                      {timeline.locationName || '-'}
                    </td>
                    <td className="py-4">
                      <div className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded inline-block">
                        {timeline.displayOrder || 0}
                      </div>
                    </td>
                    <td className="py-4 pr-8 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(timeline)}
                          className="p-2 text-slate-400 hover:text-forest-leaf hover:bg-forest-leaf/5 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(timeline.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-basalt-soil/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-[40px] p-10 shadow-2xl animate-in fade-in zoom-in duration-300 my-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-basalt-soil flex items-center gap-2">
                <Landmark className="text-forest-leaf w-6 h-6" />
                {editingId ? 'Chỉnh sửa sự kiện' : 'Thêm sự kiện mới'}
              </h2>
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Năm <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                  className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-forest-leaf/20"
                  placeholder="VD: 1975"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Thứ tự hiển thị
                </label>
                <input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                  className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-forest-leaf/20"
                  placeholder="0"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Tiêu đề <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-forest-leaf/20"
                  placeholder="Nhập tiêu đề sự kiện..."
                />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Mô tả chi tiết <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-forest-leaf/20 resize-none"
                  placeholder="Nhập nội dung mô tả..."
                />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Hình ảnh (URL)
                </label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-forest-leaf/20"
                  placeholder="https://..."
                />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Tên địa điểm
                </label>
                <input
                  type="text"
                  value={formData.locationName}
                  onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                  className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-forest-leaf/20"
                  placeholder="Nhập tên địa điểm (tuỳ chọn)..."
                />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  ID Bài viết liên kết
                </label>
                <input
                  type="text"
                  value={formData.relatedPostId}
                  onChange={(e) => setFormData({ ...formData, relatedPostId: e.target.value })}
                  className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-forest-leaf/20"
                  placeholder="Nhập ID bài viết (nếu có)..."
                />
              </div>
            </div>

            <div className="mt-10 flex gap-4">
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition-colors"
              >
                Huỷ bỏ
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-4 bg-forest-leaf text-white rounded-2xl font-bold hover:shadow-xl shadow-forest-leaf/20 transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                {editingId ? 'Cập nhật' : 'Thêm sự kiện'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
