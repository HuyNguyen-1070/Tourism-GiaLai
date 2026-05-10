import { Card } from '@/components/ui/card';
import React from 'react';
import { AuthLayoutProps } from '@/types/AuthLayoutProps';

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="h-screen w-screen flex flex-col md:flex-row">
      <div
        className="hidden md:block md:w-1/2 h-full bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1530521954074-e64f6810b32d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
        }}
      />

      <div className="flex-1 flex items-center justify-center bg-[#DDDDDD] p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-md sm:max-w-lg md:max-w-xl">
          <Card className="backdrop-blur-md bg-white shadow-2xl rounded-3xl border border-white/20 p-6 sm:p-8 md:p-10 transition-all duration-300">
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#333]">
                {title}
              </h1>
              {subtitle && (
                <p className="text-gray-400 mt-3 text-base sm:text-lg font-medium">{subtitle}</p>
              )}
            </div>
            {children}
          </Card>
        </div>
      </div>
    </div>
  );
};
