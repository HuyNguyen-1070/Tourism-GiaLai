import { useEffect, useState } from 'react';
import { contentApi } from '@/services/api/contentApi';
import { TourismOverview } from '@/types/content';
import { Loader2, TrendingUp, Plane, Hotel, Map, Info } from 'lucide-react';

export const OverviewPage = () => {
  const [data, setData] = useState<TourismOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await contentApi.getTourismOverview();
        setData(res.data);
      } catch (error) {
        console.error('Error fetching tourism overview:', error);
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
        <p className="text-on-surface-variant font-label-md">Đang thu thập dữ liệu du lịch...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mist-beige pb-24">
      {/* Hero */}
      <div className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <img
          src="https://res.cloudinary.com/dz8o8v6z2/image/upload/v1715764000/gialai_overview_bg.jpg"
          alt="Gia Lai Overview"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        <div className="relative z-10 text-center px-4">
          <h1 className="font-headline-lg text-4xl md:text-6xl text-white mb-4">
            Tổng quan Du lịch Gia Lai
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto font-body-lg">
            Thông tin chi tiết về tiềm năng, cơ sở hạ tầng và những con số ấn tượng của ngành du
            lịch tỉnh.
          </p>
        </div>
      </div>

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop -mt-20 relative z-20">
        {data ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Stats & Highlights */}
            <div className="lg:col-span-2 space-y-8">
              {/* Highlights Card */}
              <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-basalt-soil/5">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 rounded-xl bg-forest-leaf/10 text-forest-leaf">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-headline-md text-basalt-soil">Điểm nhấn nổi bật</h2>
                </div>

                <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {data.highlights.map((item, i) => (
                    <li
                      key={i}
                      className="flex gap-4 p-4 rounded-2xl bg-mist-beige border border-basalt-soil/5 hover:border-forest-leaf/20 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-forest-leaf text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-sm font-body-md text-basalt-soil leading-relaxed">
                        {item}
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="mt-12 pt-12 border-t border-basalt-soil/10 grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-outline mb-4">
                      Doanh thu du lịch năm qua
                    </h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-headline-md text-forest-leaf">
                        {(data.revenueLastYear / 1000000000000).toFixed(2)}
                      </span>
                      <span className="text-xl font-bold text-basalt-soil">Nghìn tỷ đồng</span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-2">{data.revenueNote}</p>
                  </div>
                  <div className="bg-forest-leaf/5 p-6 rounded-2xl border border-forest-leaf/10">
                    <div className="flex items-center gap-2 text-forest-leaf font-bold mb-2">
                      <Info className="w-4 h-4" />
                      <span>Ghi chú</span>
                    </div>
                    <p className="text-xs text-on-surface-variant">
                      Số liệu được thống kê bởi Sở Văn hóa, Thể thao và Du lịch tỉnh Gia Lai tính
                      đến cuối năm vừa qua.
                    </p>
                  </div>
                </div>
              </div>

              {/* Tourism Vision Placeholder */}
              <div className="bg-basalt-soil text-white p-10 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 ethnic-pattern opacity-10 -rotate-45" />
                <h3 className="text-2xl font-headline-md mb-4">Tầm nhìn & Sứ mệnh</h3>
                <p className="text-white/60 leading-relaxed max-w-xl">
                  Phát triển du lịch Gia Lai trở thành ngành kinh tế mũi nhọn, bền vững, gắn liền
                  với việc bảo tồn di sản văn hóa và thiên nhiên đại ngàn.
                </p>
              </div>
            </div>

            {/* Sidebar Infrastructure */}
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-basalt-soil/5 sticky top-28">
                <h3 className="text-xl font-headline-md text-basalt-soil mb-8 flex items-center gap-2">
                  <Map className="w-5 h-5 text-forest-leaf" />
                  Cơ sở hạ tầng
                </h3>

                <div className="space-y-6">
                  {data.infrastructureInfo.map((info, i) => {
                    const Icon = i === 0 ? Plane : i === 2 ? Hotel : Map;
                    return (
                      <div key={i} className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-forest-leaf/5 text-forest-leaf flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5" />
                        </div>
                        <p className="text-sm text-on-surface-variant leading-tight">{info}</p>
                      </div>
                    );
                  })}
                </div>

                <button className="w-full mt-10 py-4 bg-basalt-soil text-white rounded-2xl font-bold hover:bg-basalt-soil/90 transition-all shadow-lg">
                  Tải bản đồ du lịch
                </button>
              </div>

              {/* Quick Links */}
              <div className="bg-forest-leaf p-8 rounded-3xl text-white shadow-xl shadow-forest-leaf/20">
                <h4 className="font-bold mb-4">Bạn cần hỗ trợ?</h4>
                <p className="text-white/80 text-sm mb-6">
                  Liên hệ với chúng tôi để được tư vấn về lịch trình và các điểm đến tại Gia Lai.
                </p>
                <div className="bg-white/10 p-4 rounded-xl text-center font-bold text-sm">
                  Hotline: 1800 1234
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-20 text-center rounded-3xl border border-basalt-soil/5 shadow-xl">
            <Info className="w-16 h-16 text-outline/20 mx-auto mb-6" />
            <h2 className="text-2xl font-headline-md text-basalt-soil mb-2">
              Chưa có dữ liệu tổng quan
            </h2>
            <p className="text-on-surface-variant">
              Dữ liệu hiện đang được cập nhật. Vui lòng quay lại sau.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
