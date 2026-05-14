import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '@/components/common/Footer/Footer';

const loginSchema = z.object({
  username: z.string().min(1, 'Vui lòng nhập tên đăng nhập hoặc email'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (location.state?.passwordReset) {
      setSuccessMessage('Mật khẩu đã được đặt lại thành công! Vui lòng đăng nhập.');
    }
  }, [location.state]);

  const onSubmit = async (data: LoginFormValues) => {
    setError('');
    setSuccessMessage('');
    const result = await login(data.username, data.password);
    if (!result.success) {
      setError(result.message || 'Đăng nhập thất bại');
    }
  };

  return (
    <div className="bg-mist-beige font-body-md text-on-surface min-h-screen flex flex-col">
      <main className="flex-grow grid grid-cols-1 lg:grid-cols-12 min-h-screen overflow-hidden">
        {/* Left Side: Cinematic Branding & Imagery */}
        <section className="hidden lg:flex lg:col-span-7 relative flex-col justify-end p-margin-desktop bg-basalt-soil overflow-hidden">
          <img
            alt="T'Nung Lake Gia Lai"
            className="absolute inset-0 w-full h-full object-cover"
            src="/images/BG.png"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-basalt-soil via-transparent to-transparent opacity-80" />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, #4B3621 1px, transparent 0)',
              backgroundSize: '24px 24px',
              opacity: 0.05,
            }}
          />
          <div className="relative z-10 space-y-4 max-w-xl">
            <span className="font-label-md text-label-md text-primary-fixed tracking-[0.2em] uppercase">
              Gia Lai Heritage
            </span>
            <h1 className="font-display-lg text-display-lg text-white">
              Journey into the heart of the Highlands.
            </h1>
            <p className="font-body-lg text-body-lg text-surface-variant/90 leading-relaxed">
              Discover ancient landscapes, vibrant cultural rhythms, and the preserved historical
              legacy of the Gia Lai people.
            </p>
          </div>
        </section>

        {/* Right Side: Login Form */}
        <section className="lg:col-span-5 flex flex-col justify-center items-center px-margin-mobile md:px-margin-desktop py-12 bg-mist-beige relative overflow-hidden">
          {/* Mobile Brand Logo */}
          <div className="lg:hidden absolute top-8 left-margin-mobile">
            <span className="font-headline-lg text-headline-lg text-forest-leaf italic">
              Gia Lai Heritage
            </span>
          </div>

          <div className="w-full max-w-[440px] space-y-8 z-10">
            <header className="space-y-2">
              <h2 className="font-headline-lg text-headline-lg text-basalt-soil">Sign In</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Welcome back. Please enter your details to continue your journey.
              </p>
            </header>

            {/* Success message from password reset */}
            {successMessage && (
              <div className="flex items-center gap-3 p-4 bg-primary-fixed rounded-lg border border-forest-leaf/20">
                <span
                  className="material-symbols-outlined text-forest-leaf text-[22px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
                <p className="text-forest-leaf font-label-md text-label-md">{successMessage}</p>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <div className="flex flex-col space-y-1.5">
                  <label
                    className="font-label-md text-label-md text-on-surface-variant ml-1"
                    htmlFor="username"
                  >
                    Username or Email
                  </label>
                  <input
                    className={`w-full px-4 py-3 rounded-lg bg-surface-container-lowest border focus:border-forest-leaf focus:ring-1 focus:ring-forest-leaf outline-none transition-all placeholder:text-outline-variant font-body-md text-on-surface ${
                      errors.username ? 'border-error' : 'border-outline/20'
                    }`}
                    id="username"
                    placeholder="Enter your identity"
                    type="text"
                    {...register('username')}
                  />
                  {errors.username && (
                    <p className="text-error text-xs ml-1">{errors.username.message}</p>
                  )}
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label
                    className="font-label-md text-label-md text-on-surface-variant ml-1"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      className={`w-full px-4 py-3 rounded-lg bg-surface-container-lowest border focus:border-forest-leaf focus:ring-1 focus:ring-forest-leaf outline-none transition-all placeholder:text-outline-variant font-body-md text-on-surface ${
                        errors.password ? 'border-error' : 'border-outline/20'
                      }`}
                      id="password"
                      placeholder="••••••••"
                      type={showPassword ? 'text' : 'password'}
                      {...register('password')}
                    />
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-forest-leaf transition-colors"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-error text-xs ml-1">{errors.password.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input
                    className="w-4 h-4 rounded border-outline/30 text-forest-leaf focus:ring-forest-leaf"
                    type="checkbox"
                  />
                  <span className="font-label-md text-label-md text-on-surface-variant group-hover:text-forest-leaf transition-colors">
                    Remember me
                  </span>
                </label>
                <Link
                  className="font-label-md text-label-md text-forest-leaf hover:underline"
                  to="/forgot-password"
                >
                  Forgot password?
                </Link>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-error-container rounded-lg">
                  <span className="material-symbols-outlined text-error text-[18px]">error</span>
                  <p className="text-error text-sm">{error}</p>
                </div>
              )}

              <button
                className="w-full bg-forest-leaf text-white py-4 rounded-lg font-label-md text-label-md shadow-lg shadow-forest-leaf/20 hover:bg-primary transition-all active:scale-[0.98] flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">
                      progress_activity
                    </span>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex items-center justify-center py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline/10" />
              </div>
              <span className="relative bg-mist-beige px-4 text-outline-variant font-label-sm uppercase tracking-widest">
                or connect with
              </span>
            </div>

            {/* Social Sign In */}
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center space-x-3 border border-outline/20 bg-surface-container-lowest py-3 px-4 rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-white hover:border-forest-leaf transition-all">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Google</span>
              </button>
              <button className="flex items-center justify-center space-x-3 border border-outline/20 bg-surface-container-lowest py-3 px-4 rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-white hover:border-forest-leaf transition-all">
                <div className="w-5 h-5 bg-[#0068FF] rounded-full flex items-center justify-center text-white font-bold text-[10px]">
                  Z
                </div>
                <span>Zalo</span>
              </button>
            </div>

            <p className="text-center font-body-md text-body-md text-on-surface-variant">
              Don't have an account?{' '}
              <Link className="text-forest-leaf font-bold hover:underline ml-1" to="/register">
                Create Account
              </Link>
            </p>
          </div>

          {/* Decorative footer */}
          <div className="absolute bottom-0 left-0 w-full h-24 overflow-hidden opacity-20 pointer-events-none">
            <div className="flex space-x-4 justify-center items-end h-full">
              <span className="material-symbols-outlined text-basalt-soil text-[48px]">
                filter_vintage
              </span>
              <span className="material-symbols-outlined text-basalt-soil text-[64px]">grain</span>
              <span className="material-symbols-outlined text-basalt-soil text-[48px]">
                filter_vintage
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
