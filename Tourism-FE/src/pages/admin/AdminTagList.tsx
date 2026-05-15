import { useEffect, useState } from 'react';
import { adminApi, TagAdminResponse } from '@/services/api/adminApi';
import { Search, Plus, Edit2, Trash2, Loader2, AlertCircle, Check, X } from 'lucide-react';
import { toast } from 'sonner';

export const AdminTagList = () => {
  const [tags, setTags] = useState<TagAdminResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');

  const [isAdding, setIsAdding] = useState(false);
  const [newTagName, setNewTagName] = useState('');

  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editingTagName, setEditingTagName] = useState('');

  const fetchTags = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getTags(keyword);
      setTags(res.data);
    } catch (error) {
      toast.error('Không thể tải danh sách tag');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchTags, 500);
    return () => clearTimeout(timer);
  }, [keyword]);

  const handleCreate = async () => {
    if (!newTagName.trim()) return;
    try {
      await adminApi.createTag(newTagName.toUpperCase());
      toast.success('Đã tạo tag mới');
      setNewTagName('');
      setIsAdding(false);
      fetchTags();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Không thể tạo tag');
    }
  };

  const handleUpdate = async (tagId: string) => {
    if (!editingTagName.trim()) return;
    try {
      await adminApi.updateTag(tagId, editingTagName.toUpperCase());
      toast.success('Đã cập nhật tag');
      setEditingTagId(null);
      fetchTags();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Không thể cập nhật tag');
    }
  };

  const handleDelete = async (tagId: string, name: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa tag #${name}?`)) return;
    try {
      await adminApi.deleteTag(tagId);
      toast.success('Đã xóa tag');
      fetchTags();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Không thể xóa tag');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-headline-md text-basalt-soil">Quản lý Tag</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-3 bg-forest-leaf text-white rounded-2xl font-bold text-sm hover:shadow-lg hover:shadow-forest-leaf/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          Tạo Tag mới
        </button>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm tag..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-forest-leaf/20"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest font-bold border-b border-slate-100">
              <th className="py-4 pl-8">Tên Tag</th>
              <th className="py-4">Số bài viết</th>
              <th className="py-4 pr-8 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isAdding && (
              <tr className="bg-forest-leaf/5">
                <td className="py-4 pl-8">
                  <input
                    autoFocus
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    placeholder="Tên tag (VÍ DỤ: ADVENTURE)"
                    className="w-full bg-white border border-forest-leaf/20 rounded-lg px-3 py-1.5 text-sm font-bold focus:ring-2 focus:ring-forest-leaf/20 outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                  />
                </td>
                <td className="py-4 text-xs font-bold text-slate-400">0</td>
                <td className="py-4 pr-8 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handleCreate}
                      className="p-2 text-forest-leaf hover:bg-forest-leaf/10 rounded-lg"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsAdding(false)}
                      className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            )}

            {loading ? (
              <tr>
                <td colSpan={3} className="py-20 text-center">
                  <Loader2 className="w-8 h-8 text-forest-leaf animate-spin mx-auto mb-2" />
                  <p className="text-xs text-slate-400">Đang tải...</p>
                </td>
              </tr>
            ) : (
              <>
                {tags.map((tag) => (
                  <tr key={tag.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 pl-8">
                      {editingTagId === tag.id ? (
                        <input
                          autoFocus
                          type="text"
                          value={editingTagName}
                          onChange={(e) => setEditingTagName(e.target.value)}
                          className="w-full bg-white border border-forest-leaf/20 rounded-lg px-3 py-1.5 text-sm font-bold outline-none"
                          onKeyDown={(e) => e.key === 'Enter' && handleUpdate(tag.id)}
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-forest-leaf opacity-40"></span>
                          <p className="text-sm font-bold text-basalt-soil">#{tag.name}</p>
                        </div>
                      )}
                    </td>
                    <td className="py-4">
                      <span
                        className={`text-xs font-bold ${tag.postCount > 0 ? 'text-forest-leaf' : 'text-slate-400'}`}
                      >
                        {tag.postCount} bài viết
                      </span>
                    </td>
                    <td className="py-4 pr-8 text-right">
                      <div className="flex justify-end gap-2">
                        {editingTagId === tag.id ? (
                          <>
                            <button
                              onClick={() => handleUpdate(tag.id)}
                              className="p-2 text-forest-leaf hover:bg-forest-leaf/10 rounded-lg"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingTagId(null)}
                              className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setEditingTagId(tag.id);
                                setEditingTagName(tag.name);
                              }}
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(tag.id, tag.name)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>

        {!loading && tags.length === 0 && !isAdding && (
          <div className="py-20 text-center">
            <p className="text-slate-400 italic">Không tìm thấy tag nào phù hợp.</p>
          </div>
        )}
      </div>

      <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800 leading-relaxed">
          <span className="font-bold">Lưu ý:</span> Bạn không thể xóa các Tag đang được sử dụng bởi
          ít nhất 1 bài viết. Hãy gỡ Tag khỏi các bài viết đó trước khi tiến hành xóa.
        </p>
      </div>
    </div>
  );
};
