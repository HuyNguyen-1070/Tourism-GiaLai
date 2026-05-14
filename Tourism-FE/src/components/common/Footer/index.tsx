import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-basalt-soil text-white py-12 px-margin-mobile md:px-margin-desktop">
      <div className="max-w-container-max mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8 pb-8 border-b border-white/10">
          <div>
            <h2 className="font-headline-md text-headline-md text-mist-beige mb-2">
              Gia Lai Heritage
            </h2>
            <p className="text-white/60 text-sm italic">Di sản trong lòng phố núi</p>
          </div>
          <div className="flex flex-wrap gap-6 text-sm font-medium text-white/80">
            <Link to="/about" className="hover:text-primary-fixed transition-colors">
              Giới thiệu
            </Link>
            <Link to="/privacy" className="hover:text-primary-fixed transition-colors">
              Điều khoản
            </Link>
            <Link to="/contact" className="hover:text-primary-fixed transition-colors">
              Liên hệ
            </Link>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/40 text-sm">
            © 2025 Gia Lai Heritage. Bảo tồn và phát huy giá trị văn hóa Tây Nguyên.
          </p>
          <div className="flex items-center gap-6 text-white/60">
            <button className="flex items-center gap-2 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-xl">language</span>
              <span className="text-sm">Tiếng Việt</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
