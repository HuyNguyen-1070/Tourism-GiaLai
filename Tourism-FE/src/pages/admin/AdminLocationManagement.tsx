import { useEffect, useState, useCallback } from 'react';
import { adminApi, LocationRequest } from '@/services/api/adminApi';
import { mapApi } from '@/services/api/mapApi';
import { AllLocationItem } from '@/types/map';
import { MapPin, Search, Plus, Edit2, Trash2, Loader2, ExternalLink, Save, X } from 'lucide-react';
import { toast } from 'sonner';

export const AdminLocationManagement = () => {
  const [locations, setLocations] = useState<AllLocationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<LocationRequest & { id?: string }>({
    postId: '',
    name: '',
    address: '',
    latitude: 0,
    longitude: 0,
    placeId: '',
  });

  const fetchLocations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await mapApi.getAllLocations({ keyword });
      setLocations(res.data.locations);
    } catch (error) {
      toast.error('Không thể tải danh sách địa điểm');
    } finally {
      setLoading(false);
    }
  }, [keyword]);

  useEffect(() => {
    const timer = setTimeout(fetchLocations, 500);
    return () => clearTimeout(timer);
  }, [fetchLocations]);

  const handleSave = async () => {
    if (!formData.postId || !formData.name || !formData.latitude || !formData.longitude) {
      toast.warning('Vui lòng điền đầy đủ các thông tin bắt buộc');
      return;
    }

    try {
      if (formData.id) {
        await adminApi.updateLocation(formData.id, formData);
        toast.success('Đã cập nhật địa điểm');
      } else {
        await adminApi.createLocation(formData);
        toast.success('Đã thêm địa điểm mới');
      }
      setIsEditing(false);
      fetchLocations();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi lưu địa điểm');
    }
  };

  const handleEdit = (loc: AllLocationItem) => {
    setFormData({
      id: loc.locationId,
      postId: loc.postId,
      name: loc.name,
      address: loc.address,
      latitude: loc.latitude,
      longitude: loc.longitude,
      placeId: loc.placeId || '',
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa địa điểm này?')) return;
    try {
      await adminApi.deleteLocation(id);
      toast.success('Đã xóa địa điểm');
      fetchLocations();
    } catch (error) {
      toast.error('Lỗi khi xóa địa điểm');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-headline-md text-basalt-soil">Quản lý Địa điểm trên Bản đồ</h1>
        <button
          onClick={() => {
            setFormData({
              postId: '',
              name: '',
              address: '',
              latitude: 0,
              longitude: 0,
              placeId: '',
            });
            setIsEditing(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-forest-leaf text-white rounded-2xl font-bold text-sm hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          Thêm Địa điểm
        </button>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên địa điểm hoặc bài viết..."
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
                <th className="py-4 pl-8">Địa điểm</th>
                <th className="py-4">Toạ độ</th>
                <th className="py-4">Bài viết liên kết</th>
                <th className="py-4 pr-8 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {locations.map((loc) => (
                <tr key={loc.locationId} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 pl-8">
                    <div>
                      <p className="text-sm font-bold text-basalt-soil">{loc.name}</p>
                      <p className="text-xs text-slate-400 truncate max-w-xs">{loc.address}</p>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded inline-block">
                      {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-medium text-slate-600 line-clamp-1">
                        {loc.postTitle}
                      </p>
                      <a
                        href={`/posts/${loc.postId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-forest-leaf"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </td>
                  <td className="py-4 pr-8 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(loc)}
                        className="p-2 text-slate-400 hover:text-forest-leaf hover:bg-forest-leaf/5 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(loc.locationId)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-basalt-soil/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white w-full max-w-2xl rounded-[40px] p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-basalt-soil">
                {formData.id ? 'Chỉnh sửa địa điểm' : 'Thêm địa điểm mới'}
              </h2>
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2 space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Tên địa điểm
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-forest-leaf/20"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-forest-leaf/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Vĩ độ (Latitude)
                </label>
                <input
                  type="number"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: Number(e.target.value) })}
                  className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-forest-leaf/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Kinh độ (Longitude)
                </label>
                <input
                  type="number"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: Number(e.target.value) })}
                  className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-forest-leaf/20"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  ID Bài viết liên kết
                </label>
                <input
                  type="text"
                  value={formData.postId}
                  onChange={(e) => setFormData({ ...formData, postId: e.target.value })}
                  className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-forest-leaf/20"
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
                Lưu địa điểm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
