import { useEffect, useState } from 'react';
import { adminApi } from '@/services/api/adminApi';
import { OverviewStats, PostActivity, TrendingTag, PostEngagement } from '@/types/admin';
import {
  Users,
  FileText,
  MessageSquare,
  Heart,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Calendar,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';

export const AdminDashboard = () => {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [activity, setActivity] = useState<PostActivity | null>(null);
  const [trendingTags, setTrendingTags] = useState<TrendingTag[]>([]);
  const [engagements, setEngagements] = useState<PostEngagement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, activityRes, tagsRes, engRes] = await Promise.all([
          adminApi.getOverview(),
          adminApi.getPostActivity(new Date().getMonth() + 1, new Date().getFullYear()),
          adminApi.getTrendingTags('WEEK', 5),
          adminApi.getPostEngagement('WEEK', undefined, 5),
        ]);
        setStats(statsRes.data);
        setActivity(activityRes.data);
        setTrendingTags(tagsRes.data.tags);
        setEngagements(engRes.data.posts);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-forest-leaf animate-spin" />
        <p className="text-slate-500 font-medium">Đang khởi tạo Dashboard...</p>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Tổng bài viết',
      value: stats?.totalPosts,
      icon: FileText,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      trend: '+12%',
      up: true,
    },
    {
      label: 'Chờ phê duyệt',
      value: stats?.pendingPosts,
      icon: ClockIcon,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      trend: 'Cần xử lý',
      up: false,
    },
    {
      label: 'Tổng người dùng',
      value: stats?.totalUsers,
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      trend: '+87',
      up: true,
    },
    {
      label: 'Tương tác (Like)',
      value: stats?.totalLikes,
      icon: Heart,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      trend: '+2.4k',
      up: true,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-headline-md text-basalt-soil">Chào mừng trở lại, Admin!</h1>
        <p className="text-slate-500 text-sm">
          Dưới đây là thống kê hoạt động của hệ thống trong tuần qua.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${card.bg} ${card.color}`}>
                <card.icon className="w-6 h-6" />
              </div>
              <div
                className={`flex items-center gap-1 text-xs font-bold ${card.up ? 'text-forest-leaf' : 'text-amber-600'}`}
              >
                {card.trend}
                {card.up ? <ArrowUpRight className="w-3 h-3" /> : null}
              </div>
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
              {card.label}
            </p>
            <h3 className="text-3xl font-headline-md text-basalt-soil">
              {card.value?.toLocaleString()}
            </h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-basalt-soil flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-forest-leaf" />
              Hoạt động bài viết (Tháng {activity?.month})
            </h3>
            <div className="flex items-center gap-4 text-xs font-bold">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-forest-leaf"></span>
                <span>Mới ({activity?.totalNew})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                <span>Cập nhật ({activity?.totalUpdated})</span>
              </div>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activity?.daily}>
                <defs>
                  <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4B940A" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#4B940A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                  tickFormatter={(val) => val.split('-')[2]}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '16px',
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="newPosts"
                  stroke="#4B940A"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorNew)"
                />
                <Area
                  type="monotone"
                  dataKey="updatedPosts"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="none"
                  strokeDasharray="5 5"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trending Tags */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-basalt-soil mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-forest-leaf" />
            Tag nổi bật tuần
          </h3>
          <div className="space-y-6">
            {trendingTags.map((tag, i) => (
              <div key={tag.tagId} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-bold text-basalt-soil truncate">{tag.tagName}</p>
                    <p className="text-xs font-bold text-forest-leaf">
                      {tag.tagScore.toFixed(0)} pts
                    </p>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-forest-leaf h-full rounded-full"
                      style={{ width: `${(tag.tagScore / trendingTags[0].tagScore) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 bg-slate-50 text-slate-500 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors">
            Xem tất cả Tag
          </button>
        </div>
      </div>

      {/* Post Engagement Table */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-lg font-bold text-basalt-soil">Bài viết tương tác cao nhất</h3>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-500 cursor-pointer hover:bg-slate-100 transition-colors">
            <Calendar className="w-4 h-4" />7 ngày qua
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-[10px] uppercase tracking-widest font-bold border-b border-slate-100">
                <th className="pb-4 pl-2">Thứ hạng</th>
                <th className="pb-4">Tiêu đề bài viết</th>
                <th className="pb-4">Tác giả</th>
                <th className="pb-4">Lượt xem</th>
                <th className="pb-4">Thích</th>
                <th className="pb-4">Điểm tương tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {engagements.map((post) => (
                <tr key={post.postId} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 pl-2 font-bold text-slate-400">#{post.rank}</td>
                  <td className="py-4">
                    <p className="text-sm font-bold text-basalt-soil group-hover:text-forest-leaf transition-colors line-clamp-1">
                      {post.title}
                    </p>
                    <div className="flex gap-1 mt-1">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-bold uppercase"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 text-xs font-medium text-slate-500">
                    @{post.authorUsername}
                  </td>
                  <td className="py-4 text-xs font-bold text-basalt-soil">
                    {post.viewCount.toLocaleString()}
                  </td>
                  <td className="py-4 text-xs font-bold text-basalt-soil">
                    {post.likeCount.toLocaleString()}
                  </td>
                  <td className="py-4">
                    <span className="px-2 py-1 bg-forest-leaf/10 text-forest-leaf text-[10px] font-bold rounded-lg">
                      {post.engagementScore.toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
