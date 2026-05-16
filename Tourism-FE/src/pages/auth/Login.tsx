import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Footer } from '@/components/common/Footer/Footer';
import { GoogleLogin } from '@react-oauth/google';

const loginSchema = z.object({
  username: z.string().min(1, 'Vui lòng nhập tên đăng nhập'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Login = () => {
  const { login, loginGoogle, isAuthenticated, user } = useAuth();
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
    if (isAuthenticated && user) {
      const isAdmin = user.roles?.includes('ADMIN');
      navigate(isAdmin ? '/admin/dashboard' : '/');
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (location.state?.passwordReset) {
      setSuccessMessage('Mật khẩu đã được đặt lại thành công! Vui lòng đăng nhập.');
    } else if (location.state?.registered) {
      setSuccessMessage('Đăng ký thành công! Vui lòng đăng nhập bằng username.');
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

  const handleGoogleLogin = async (idToken: string) => {
    setError('');
    const result = await loginGoogle(idToken);
    if (!result.success) {
      setError(result.message || 'Đăng nhập Google thất bại');
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
          <div className="lg:hidden absolute top-8 left-margin-mobile">
            <span className="font-headline-lg text-headline-lg text-forest-leaf italic">
              Gia Lai Heritage
            </span>
          </div>

          <div className="w-full max-w-[440px] space-y-8 z-10">
            <header className="space-y-2">
              <h2 className="font-headline-lg text-headline-lg text-basalt-soil">Sign In</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Welcome back. Please enter your username and password.
              </p>
            </header>

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
                    Username
                  </label>
                  <input
                    className={`w-full px-4 py-3 rounded-lg bg-surface-container-lowest border focus:border-forest-leaf focus:ring-1 focus:ring-forest-leaf outline-none transition-all placeholder:text-outline-variant font-body-md text-on-surface ${errors.username ? 'border-error' : 'border-outline/20'}`}
                    id="username"
                    placeholder="Enter your username"
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
                      className={`w-full px-4 py-3 rounded-lg bg-surface-container-lowest border focus:border-forest-leaf focus:ring-1 focus:ring-forest-leaf outline-none transition-all placeholder:text-outline-variant font-body-md text-on-surface ${errors.password ? 'border-error' : 'border-outline/20'}`}
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
                className="w-full bg-forest-leaf text-white py-4 rounded-lg font-label-md text-label-md shadow-lg shadow-forest-leaf/20 hover:bg-primary transition-all active:scale-[0.98] flex items-center justify-center space-x-2 disabled:opacity-50"
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

            <div className="relative flex items-center justify-center py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline/10" />
              </div>
              <span className="relative bg-mist-beige px-4 text-outline-variant font-label-sm uppercase tracking-widest">
                or connect with
              </span>
            </div>

            <div className="w-full">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  if (credentialResponse.credential) {
                    handleGoogleLogin(credentialResponse.credential);
                  }
                }}
                onError={() => {
                  setError('Google login failed');
                }}
                theme="outline"
                size="large"
                width="100%"
                text="continue_with"
                shape="rectangular"
              />
            </div>

            <p className="text-center font-body-md text-body-md text-on-surface-variant">
              Don't have an account?{' '}
              <Link className="text-forest-leaf font-bold hover:underline ml-1" to="/register">
                Create Account
              </Link>
            </p>
          </div>

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
      <Footer />
    </div>
  );
};
