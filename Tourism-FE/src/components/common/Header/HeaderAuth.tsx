import { Link } from 'react-router-dom';

interface HeaderProps {
  showBackButton?: boolean;
  backTo?: string;
}

export const Header = ({ showBackButton = false, backTo = '/' }: HeaderProps) => {
  return (
    <header className="fixed top-0 w-full z-50 bg-mist-beige/80 backdrop-blur-md border-b border-secondary/10">
      <div className="max-w-container-max mx-auto px-margin-desktop py-4 flex items-center justify-between">
        {/* Logo SVG */}
        <Link to="/" className="flex items-center gap-2">
          <svg
            width="auto"
            height="100%"
            viewBox="0 0 400 80"
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-auto"
          >
            <path
              d="M40 50L70 15L100 50M55 50L70 30L85 50"
              stroke="#205609"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M30 60H110" stroke="#8B5E3C" strokeWidth="3" strokeLinecap="round" />
            <text
              x="130"
              y="48"
              fontFamily="Playfair Display, serif"
              fontSize="32"
              fontWeight="700"
              fill="#205609"
            >
              Gia Lai
            </text>
            <text
              x="130"
              y="68"
              fontFamily="Inter, sans-serif"
              fontSize="13"
              fontWeight="500"
              letterSpacing="3"
              fill="#8B5E3C"
              style={{ textTransform: 'uppercase' }}
            >
              Heritage
            </text>
          </svg>
        </Link>

        {showBackButton && (
          <Link
            to={backTo}
            className="flex items-center gap-2 text-on-surface-variant hover:text-forest-leaf transition-colors font-label-md text-label-md"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Login
          </Link>
        )}
      </div>
    </header>
  );
};
