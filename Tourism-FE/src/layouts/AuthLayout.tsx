import React from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '@/components/common/Footer/Footer';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  heroImage?: string;
  heroTitle?: string;
  heroSubtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  heroImage = '/images/BG.png',
  heroTitle = 'Join the Heritage Journey',
  heroSubtitle = 'Create an account to preserve your favorite historical landmarks and cultural events across the Gia Lai plateau.',
}) => {
  return (
    <div className="bg-mist-beige font-body-md text-on-surface min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-mist-beige border-b border-secondary/20 shadow-sm shadow-basalt-soil/5 sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-margin-desktop max-w-container-max mx-auto py-4">
          <Link to="/" className="font-headline-lg text-headline-lg text-forest-leaf italic">
            Gia Lai Heritage
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <a
              className="text-on-surface-variant hover:text-forest-leaf transition-colors font-label-md text-label-md"
              href="#"
            >
              Destinations
            </a>
            <a
              className="text-on-surface-variant hover:text-forest-leaf transition-colors font-label-md text-label-md"
              href="#"
            >
              History
            </a>
            <a
              className="text-on-surface-variant hover:text-forest-leaf transition-colors font-label-md text-label-md"
              href="#"
            >
              Culture
            </a>
            <a
              className="text-on-surface-variant hover:text-forest-leaf transition-colors font-label-md text-label-md"
              href="#"
            >
              Events
            </a>
            <Link
              to="/login"
              className="bg-forest-leaf text-white px-6 py-2 rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow flex items-center justify-center py-12 px-4 relative overflow-hidden">
        {/* Background pattern */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #4B3621 1px, transparent 0)',
            backgroundSize: '24px 24px',
            opacity: 0.03,
          }}
        />

        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-surface-container-lowest rounded-xl shadow-xl shadow-basalt-soil/10 overflow-hidden relative z-10">
          {/* Left visual */}
          <div className="hidden md:block relative h-full min-h-[600px]">
            <img
              className="absolute inset-0 w-full h-full object-cover"
              src={heroImage}
              alt="Gia Lai landscape"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-basalt-soil/80 via-transparent to-transparent flex flex-col justify-end p-12">
              <h2 className="font-headline-lg text-headline-lg text-white mb-4">{heroTitle}</h2>
              <p className="font-body-md text-white/90">{heroSubtitle}</p>
            </div>
          </div>

          {/* Right: form */}
          <div className="p-8 md:p-12 bg-white">
            <div className="mb-8">
              <h1 className="font-headline-md text-headline-md text-basalt-soil mb-2">{title}</h1>
              {subtitle && <p className="font-body-md text-on-surface-variant">{subtitle}</p>}
            </div>
            {children}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
