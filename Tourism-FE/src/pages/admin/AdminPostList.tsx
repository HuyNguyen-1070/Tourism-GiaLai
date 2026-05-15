import { useEffect, useState, useCallback } from 'react';
import { adminApi } from '@/services/api/adminApi';
import { Post } from '@/types/post';
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Trash2,
  Eye,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';
import { PostStatusBadge } from '@/pages/post/components/PostStatusBadge';

export const AdminPostList = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [status, setStatus] = useState('PENDING');
  const [keyword, setKeyword] = useState('');

  const [rejectingPostId, setRejectingPostId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getPosts({
        page,
        size: 10,
        status: status === 'ALL' ? undefined : status,
        keyword: keyword || undefined,
        sort: status === 'PENDING' ? 'createdAt' : 'updatedAt',
        direction: status === 'PENDING' ? 'asc' : 'desc',
      });
      setPosts(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      toast.error('Không thể tải danh sách bài viết');
    } finally {
      setLoading(false);
    }
  }, [page, status, keyword]);

  useEffect(() => {
    const timer = setTimeout(fetchPosts, 500);
    return () => clearTimeout(timer);
  }, [fetchPosts]);

  const handleApprove = async (postId: string) => {
    try {
      await adminApi.approvePost(postId);
      toast.success('Đã phê duyệt bài viết');
      fetchPosts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleReject = async () => {
    if (!rejectingPostId || !rejectReason.trim()) return;

    try {
      await adminApi.rejectPost(rejectingPostId, { reason: rejectReason });
      toast.success('Đã từ chối bài viết');
      setRejectingPostId(null);
      setRejectReason('');
      fetchPosts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (postId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return;

    try {
      await adminApi.deletePost(postId);
      toast.success('Đã xóa bài viết');
      fetchPosts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-headline-md text-basalt-soil">Quản lý bài viết</h1>
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex bg-slate-100 p-1 rounded-2xl w-full md:w-auto">
          {['PENDING', 'APPROVED', 'REJECTED', 'ALL'].map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatus(s);
                setPage(0);
              }}
              className={`flex-1 md:flex-none px-6 py-2 rounded-xl text-xs font-bold transition-all ${
                status === s
                  ? 'bg-white text-basalt-soil shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {s === 'PENDING'
                ? 'Chờ duyệt'
                : s === 'APPROVED'
                  ? 'Đã duyệt'
                  : s === 'REJECTED'
                    ? 'Từ chối'
                    : 'Tất cả'}
            </button>
          ))}
        </div>

        <div className="w-full md:w-96 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tiêu đề..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-forest-leaf/20 shadow-sm"
          />
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="py-20 flex flex-col items-center gap-4 bg-white rounded-3xl border border-slate-200">
            <Loader2 className="w-8 h-8 text-forest-leaf animate-spin" />
            <p className="text-sm text-slate-400">Đang tải danh sách bài viết...</p>
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Thumbnail Placeholder/Preview */}
                  <div className="w-full lg:w-48 h-32 rounded-2xl bg-slate-100 overflow-hidden relative shrink-0">
                    {post.thumbnail ? (
                      <img src={post.thumbnail} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <FileIcon className="w-10 h-10" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <PostStatusBadge status={post.status} />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-basalt-soil group-hover:text-forest-leaf transition-colors line-clamp-1">
                        {post.title}
                      </h3>
                      <a
                        href={`/posts/${post.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 text-slate-400 hover:text-forest-leaf transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>

                    <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-400 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <UserIcon className="w-3.5 h-3.5" />@
                        {post.authorUsername || post.sourceName}
                      </div>
                      <div className="flex gap-1">
                        {post.tags.map((tag: string) => (
                          <span key={tag} className="text-forest-leaf">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {post.status === 'REJECTED' && post.rejectionReason && (
                      <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-xs font-medium border border-red-100">
                        <span className="font-bold">Lý do từ chối:</span> {post.rejectionReason}
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                      <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        <span>{post.viewCount} Xem</span>
                        <span>{post.likeCount} Thích</span>
                        <span>{post.averageRating} Sao</span>
                      </div>

                      <div className="flex gap-2">
                        {post.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleApprove(post.id)}
                              className="px-4 py-2 bg-forest-leaf/10 text-forest-leaf hover:bg-forest-leaf hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Phê duyệt
                            </button>
                            <button
                              onClick={() => setRejectingPostId(post.id)}
                              className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              Từ chối
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {posts.length === 0 && (
              <div className="py-20 text-center bg-white rounded-3xl border border-slate-200">
                <p className="text-slate-400 italic">Không tìm thấy bài viết nào trong mục này.</p>
              </div>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                Trang {page + 1} / {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                  className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-500 disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={page === totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                  className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-500 disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Reject Modal */}
      {rejectingPostId && (
        <div className="fixed inset-0 bg-basalt-soil/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
            <h2 className="text-xl font-bold text-basalt-soil mb-4 flex items-center gap-2">
              <XCircle className="w-6 h-6 text-red-600" />
              Lý do từ chối
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Hãy cho tác giả biết tại sao bài viết này không được phê duyệt để họ có thể cải thiện.
            </p>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Nhập lý do cụ thể..."
              className="w-full h-32 p-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-red-600/20 mb-6 resize-none"
            />

            <div className="flex gap-4">
              <button
                onClick={() => setRejectingPostId(null)}
                className="flex-1 py-3 bg-slate-100 text-slate-500 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim()}
                className="flex-1 py-3 bg-red-600 text-white rounded-2xl font-bold text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                Gửi từ chối
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FileIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);
