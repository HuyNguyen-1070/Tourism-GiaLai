import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ContentSectionProps {
  title: string;
  subtitle?: string;
  viewAllLink?: string;
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}

export const ContentSection = ({
  title,
  subtitle,
  viewAllLink,
  children,
  className = '',
  dark = false,
}: ContentSectionProps) => {
  return (
    <section
      className={`py-24 px-margin-mobile md:px-margin-desktop ${dark ? 'bg-charcoal-ink text-white' : 'bg-transparent'} ${className}`}
    >
      <div className="max-w-container-max mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2
              className={`font-headline-lg text-headline-lg mb-4 ${dark ? 'text-white' : 'text-basalt-soil'}`}
            >
              {title}
            </h2>
            {subtitle && (
              <p
                className={`font-body-md text-body-md ${dark ? 'text-white/60' : 'text-on-surface-variant'}`}
              >
                {subtitle}
              </p>
            )}
          </div>

          {viewAllLink && (
            <Link
              to={viewAllLink}
              className="group flex items-center gap-2 font-bold text-forest-leaf hover:opacity-80 transition-all border-b-2 border-transparent hover:border-forest-leaf pb-1"
            >
              Xem tất cả
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        {children}
      </div>
    </section>
  );
};
