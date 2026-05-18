import { Search, MapPin } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax effect (CSS only) */}
      <div
        className="absolute inset-0 z-0 scale-110"
        style={{
          backgroundImage:
            'url("/images/BG-DashBoard.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.7)',
        }}
      />

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-basalt-soil/20 z-10" />

      {/* Content */}
      <div className="relative z-20 max-w-4xl px-margin-mobile md:px-margin-desktop text-center text-white animate-in fade-in zoom-in duration-1000">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 animate-bounce">
          <MapPin className="w-4 h-4 text-forest-leaf" />
          <span className="text-xs font-bold uppercase tracking-[0.2em]">
            Chào mừng đến với Gia Lai
          </span>
        </div>

        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-6 leading-tight drop-shadow-lg">
          Khám phá Bản sắc <br />
          <span className="text-forest-leaf italic">Đại ngàn Tây Nguyên</span>
        </h1>

        <p className="font-body-lg text-lg md:text-xl text-white/90 mb-12 max-w-2xl mx-auto drop-shadow-md">
          Nơi những thác nước hùng vĩ, những đồi chè xanh mướt và văn hóa cồng chiêng vang vọng ngàn
          đời đang chờ đón bạn.
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative group">
          <div className="absolute inset-0 bg-forest-leaf/20 blur-xl rounded-full group-hover:bg-forest-leaf/30 transition-all" />
          <div className="relative flex items-center bg-white rounded-full p-2 shadow-2xl overflow-hidden border border-white">
            <div className="flex-grow flex items-center px-4">
              <Search className="w-5 h-5 text-basalt-soil/40 mr-3" />
              <input
                type="text"
                placeholder="Tìm kiếm điểm đến, sự kiện, lịch sử..."
                className="w-full bg-transparent border-none focus:ring-0 text-basalt-soil font-body-md placeholder:text-basalt-soil/40 py-3"
              />
            </div>
            <button className="bg-forest-leaf text-white px-8 py-3 rounded-full font-bold hover:bg-forest-leaf/90 transition-all active:scale-95 shadow-lg">
              Khám phá ngay
            </button>
          </div>
        </div>
      </div>

      {/* Ethnic Pattern Overlay at bottom */}
      <div className="absolute bottom-0 left-0 w-full h-32 ethnic-pattern opacity-10 z-20 pointer-events-none" />
    </section>
  );
};
