import { useEffect, useState } from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { ContentSection } from '@/components/common/ContentSection';
import { PostCard } from '@/pages/post/components/PostCard';
import { contentApi } from '@/services/api/contentApi';
import { Post } from '@/types/post';
import { Loader2 } from 'lucide-react';

export const HomePage = () => {
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [locations, setLocations] = useState<Post[]>([]);
  const [events, setEvents] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, locationsRes, eventsRes] = await Promise.all([
          contentApi.getFeaturedPosts(),
          contentApi.getAttractiveLocations(),
          contentApi.getCulturalEvents(),
        ]);

        setFeaturedPosts(featuredRes.data);
        setLocations(locationsRes.data);
        setEvents(eventsRes.data);
      } catch (error) {
        console.error('Error fetching homepage data:', error);
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
        <p className="text-on-surface-variant font-label-md animate-pulse">
          Đang tải hương sắc Gia Lai...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <HeroSection />

      {/* Featured Posts (US4.1) */}
      <ContentSection
        title="Tiêu điểm tuần này"
        subtitle="Những bài viết nổi bật, được yêu thích nhất trong tuần qua về Gia Lai."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {featuredPosts.length > 0 ? (
            featuredPosts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <p className="col-span-full text-center text-on-surface-variant py-10 italic">
              Chưa có bài viết nổi bật nào.
            </p>
          )}
        </div>
      </ContentSection>

      {/* Attractive Locations (US4.2) */}
      <ContentSection
        title="Địa điểm hấp dẫn"
        subtitle="Khám phá những danh lam thắng cảnh, di tích lịch sử và điểm dừng chân tuyệt vời."
        viewAllLink="/attractions"
        className="bg-white"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-gutter">
          {locations.length > 0 ? (
            locations.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <p className="col-span-full text-center text-on-surface-variant py-10 italic">
              Chưa có địa điểm hấp dẫn nào.
            </p>
          )}
        </div>
      </ContentSection>

      {/* Cultural Events (US4.3) */}
      <ContentSection
        title="Văn hóa - Sự kiện - Lễ hội"
        subtitle="Hòa mình vào không gian văn hóa đặc sắc và những lễ hội truyền thống của các dân tộc Gia Lai."
        viewAllLink="/events"
        dark
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {events.length > 0 ? (
            events.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <p className="col-span-full text-center text-white/40 py-10 italic">
              Chưa có sự kiện nào sắp tới.
            </p>
          )}
        </div>
      </ContentSection>

      {/* Promotion Banner */}
      <section className="py-20 px-margin-mobile md:px-margin-desktop bg-mist-beige">
        <div className="max-w-container-max mx-auto rounded-3xl overflow-hidden relative bg-forest-leaf text-white flex flex-col md:flex-row items-center">
          <div className="absolute inset-0 ethnic-pattern opacity-10 pointer-events-none" />
          <div className="p-10 md:p-20 relative z-10 flex-1">
            <h2 className="font-headline-lg text-headline-lg mb-6 leading-tight">
              Gia Lai Heritage <br /> Hành trình khám phá di sản
            </h2>
            <p className="font-body-md mb-10 text-white/80 max-w-lg">
              Chia sẻ những trải nghiệm của bạn về Gia Lai và cùng chúng tôi gìn giữ, quảng bá vẻ
              đẹp của vùng đất này đến mọi người.
            </p>
            <button className="bg-white text-forest-leaf px-8 py-3 rounded-full font-bold hover:bg-mist-beige transition-all shadow-xl">
              Đăng bài ngay
            </button>
          </div>
          <div className="w-full md:w-1/3 h-64 md:h-full relative overflow-hidden">
            <img
              src="https://res.cloudinary.com/dz8o8v6z2/image/upload/v1715764000/gialai_footer_promo.jpg"
              alt="Gia Lai Promo"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
