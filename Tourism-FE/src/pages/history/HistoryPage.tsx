import { useEffect, useState } from 'react';
import { Timeline } from '@/components/history/Timeline';
import { contentApi } from '@/services/api/contentApi';
import { HistoryTimeline } from '@/types/content';
import { Loader2, Landmark } from 'lucide-react';

export const HistoryPage = () => {
  const [items, setItems] = useState<HistoryTimeline[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const res = await contentApi.getHistoryTimeline();
        setItems(res.data);
      } catch (error) {
        console.error('Error fetching timeline:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTimeline();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-forest-leaf animate-spin" />
        <p className="text-on-surface-variant font-label-md">Đang lật lại những trang sử vàng...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mist-beige pb-24">
      {/* Header */}
      <div className="relative py-24 bg-basalt-soil text-white overflow-hidden">
        <div className="absolute inset-0 ethnic-pattern opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-basalt-soil via-transparent to-basalt-soil" />

        <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center">
          <div className="inline-flex p-3 rounded-2xl bg-forest-leaf/20 border border-forest-leaf/30 mb-6">
            <Landmark className="w-8 h-8 text-forest-leaf" />
          </div>
          <h1 className="font-headline-lg text-4xl md:text-5xl mb-6">Lịch sử - Văn hóa Gia Lai</h1>
          <p className="text-white/60 max-w-2xl mx-auto font-body-lg">
            Hành trình qua thời gian, từ những mốc son lịch sử hào hùng đến sự hình thành và phát
            triển rực rỡ của vùng đất Gia Lai ngày nay.
          </p>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mt-20">
        {items.length > 0 ? (
          <Timeline items={items} />
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-basalt-soil/5">
            <p className="text-on-surface-variant italic">
              Hiện chưa có dữ liệu dòng thời gian lịch sử.
            </p>
          </div>
        )}
      </div>

      {/* Culture Section Placeholder */}
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mt-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
            <img
              src="https://res.cloudinary.com/dz8o8v6z2/image/upload/v1715764000/cong_chieng_culture.jpg"
              alt="Văn hóa Cồng chiêng"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-8 left-8">
              <span className="text-forest-leaf font-bold uppercase tracking-widest text-xs mb-2 block">
                Di sản UNESCO
              </span>
              <h3 className="text-white font-headline-md text-2xl">
                Không gian văn hóa Cồng chiêng Tây Nguyên
              </h3>
            </div>
          </div>
          <div>
            <h2 className="font-headline-md text-3xl mb-6 text-basalt-soil">
              Bản sắc Văn hóa rực rỡ
            </h2>
            <p className="text-on-surface-variant leading-relaxed mb-6">
              Gia Lai không chỉ có những thắng cảnh hùng vĩ mà còn là nơi lưu giữ những giá trị văn
              hóa phi vật thể vô cùng quý giá. Tiếng Cồng chiêng vang vọng khắp các buôn làng chính
              là hơi thở của đại ngàn, là sợi dây kết nối giữa con người và thần linh.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-2xl border border-basalt-soil/5">
                <h4 className="font-bold text-forest-leaf mb-1">Dân tộc Jrai</h4>
                <p className="text-xs text-outline">
                  Dân tộc chiếm đa số với văn hóa tượng nhà mồ đặc sắc.
                </p>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-basalt-soil/5">
                <h4 className="font-bold text-forest-leaf mb-1">Dân tộc Bahnar</h4>
                <p className="text-xs text-outline">
                  Nổi tiếng với những ngôi nhà Rông cao vút và lễ hội đâm trâu.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
