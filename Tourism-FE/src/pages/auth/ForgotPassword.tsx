import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { VerificationCode } from '@/components/common/VerificationCodeComponent';
import { Header } from '@/components/common/Header/HeaderAuth';

const emailSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
});

const passwordSchema = z
  .object({
    newPassword: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

type EmailFormValues = z.infer<typeof emailSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

const TransactionalLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-mist-beige text-on-surface font-body-md overflow-x-hidden min-h-screen flex flex-col">
    <Header showBackButton backTo="/login" />
    <main
      className="flex-grow flex items-center justify-center pt-28 pb-12 px-margin-mobile"
      style={{
        backgroundImage:
          'radial-gradient(circle at 2px 2px, rgba(75, 148, 10, 0.05) 1px, transparent 0)',
        backgroundSize: '24px 24px',
      }}
    >
      {children}
    </main>
    <div className="fixed bottom-0 right-0 p-16 opacity-10 pointer-events-none hidden lg:block">
      <div className="w-48 h-48 rounded-full border-2 border-dashed border-forest-leaf flex items-center justify-center">
        <span className="material-symbols-outlined text-[64px] text-forest-leaf">
          nature_people
        </span>
      </div>
    </div>
    <footer className="w-full py-8 px-margin-desktop border-t border-secondary/10 bg-surface-container-highest">
      <div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="font-headline-md text-headline-md text-forest-leaf">
            Gia Lai Heritage
          </span>
          <p className="font-label-sm text-label-sm text-on-surface-variant">
            © 2024 Gia Lai Tourism & Culture Department. Preserving the Heritage of the Highlands.
          </p>
        </div>
        <nav className="flex gap-8">
          <a
            className="text-on-surface-variant hover:text-secondary transition-colors font-label-sm text-label-sm"
            href="#"
          >
            Privacy Policy
          </a>
          <a
            className="text-on-surface-variant hover:text-secondary transition-colors font-label-sm text-label-sm"
            href="#"
          >
            Contact Support
          </a>
        </nav>
      </div>
    </footer>
  </div>
);

export const ForgotPassword = () => {
  const { forgotPassword, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 1: email form
  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors, isSubmitting: isEmailSubmitting },
  } = useForm<EmailFormValues>({ resolver: zodResolver(emailSchema) });

  const onEmailSubmit = async (data: EmailFormValues) => {
    setError('');
    const result = await forgotPassword(data.email);
    if (result.success) {
      setEmail(data.email);
      setStep(2);
    } else {
      setError(result.message || 'Gửi yêu cầu thất bại');
    }
  };

  const handleOtpVerified = (otp: string) => {
    setOtpCode(otp);
    setStep(3);
  };
  const handleBackFromOtp = () => {
    setStep(1);
    setEmail('');
    setOtpCode('');
  };

  // Step 3: new password form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    watch,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
  } = useForm<PasswordFormValues>({ resolver: zodResolver(passwordSchema) });
  const newPwdValue = watch('newPassword', '');
  const getStrengthColor = (pwd: string) => {
    if (pwd.length < 6) return 'bg-error';
    if (pwd.length < 8) return 'bg-secondary';
    return 'bg-forest-leaf';
  };

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    setError('');
    const result = await resetPassword(email, otpCode, data.newPassword);
    if (result.success) {
      navigate('/login', { state: { passwordReset: true } });
    } else {
      setError(result.message || 'Đặt lại mật khẩu thất bại');
    }
  };

  const steps = [
    { num: 1, label: 'Email' },
    { num: 2, label: 'Xác thực' },
    { num: 3, label: 'Mật khẩu mới' },
  ];

  return (
    <TransactionalLayout>
      <div className="w-full max-w-lg bg-surface-container-lowest p-10 md:p-12 rounded-xl shadow-sm border border-secondary/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none">
          <svg fill="none" stroke="currentColor" viewBox="0 0 100 100" className="text-forest-leaf">
            <circle cx="50" cy="50" r="45" strokeDasharray="2 4" />
            <circle cx="50" cy="50" r="35" strokeDasharray="1 3" />
          </svg>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-label-md text-label-md transition-all ${step > s.num ? 'bg-forest-leaf text-white' : step === s.num ? 'bg-forest-leaf text-white ring-4 ring-forest-leaf/20' : 'bg-surface-container text-outline'}`}
                >
                  {step > s.num ? (
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  ) : (
                    s.num
                  )}
                </div>
                <span
                  className={`text-[10px] mt-1 font-label-sm ${step >= s.num ? 'text-forest-leaf' : 'text-outline-variant'}`}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`w-16 h-0.5 mx-2 mb-4 transition-all ${step > s.num ? 'bg-forest-leaf' : 'bg-outline-variant'}`}
                />
              )}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <span className="material-symbols-outlined text-forest-leaf text-5xl block">
                lock_reset
              </span>
              <h1 className="font-headline-lg text-headline-lg text-basalt-soil">
                Forgot Password?
              </h1>
              <p className="text-on-surface-variant font-body-md max-w-sm mx-auto">
                Enter your email address and we'll send you a 6-digit verification code to reset
                your account.
              </p>
            </div>
            <form onSubmit={handleEmailSubmit(onEmailSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface-variant block">
                  Email Address
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                    mail
                  </span>
                  <input
                    className={`w-full pl-12 pr-4 py-3.5 bg-surface-container-low border rounded-lg focus:ring-2 focus:ring-forest-leaf focus:border-forest-leaf outline-none transition-all font-body-md ${emailErrors.email ? 'border-error' : 'border-outline-variant'}`}
                    placeholder="name@example.com"
                    type="email"
                    {...registerEmail('email')}
                  />
                </div>
                {emailErrors.email && (
                  <p className="text-error text-xs">{emailErrors.email.message}</p>
                )}
              </div>
              {error && (
                <div className="flex items-center gap-2 p-3 bg-error-container rounded-lg">
                  <span className="material-symbols-outlined text-error text-[18px]">error</span>
                  <p className="text-error text-sm">{error}</p>
                </div>
              )}
              <button
                type="submit"
                disabled={isEmailSubmitting}
                className="w-full bg-forest-leaf text-on-primary py-4 rounded-lg font-label-md text-label-md hover:bg-primary transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isEmailSubmitting ? (
                  <>
                    {' '}
                    <span className="material-symbols-outlined text-[18px] animate-spin">
                      progress_activity
                    </span>{' '}
                    Sending...{' '}
                  </>
                ) : (
                  <>
                    {' '}
                    Send Verification Code{' '}
                    <span className="material-symbols-outlined">send</span>{' '}
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <VerificationCode
            email={email}
            type="forgot-password"
            onVerified={handleOtpVerified}
            onBack={handleBackFromOtp}
          />
        )}

        {step === 3 && (
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <span className="material-symbols-outlined text-forest-leaf text-5xl block">
                lock_open
              </span>
              <h1 className="font-headline-lg text-headline-lg text-basalt-soil">Reset Password</h1>
              <p className="text-on-surface-variant font-body-md">
                Secure your account with a new password to continue exploring the Highlands.
              </p>
            </div>
            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-5">
              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface-variant block">
                  New Password
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                    lock
                  </span>
                  <input
                    className={`w-full pl-10 pr-10 py-3 bg-surface-container-low border rounded-lg focus:border-forest-leaf focus:ring-1 focus:ring-forest-leaf transition-all placeholder:text-outline-variant outline-none font-body-md ${passwordErrors.newPassword ? 'border-error' : 'border-outline-variant'}`}
                    placeholder="••••••••"
                    type={showNewPassword ? 'text' : 'password'}
                    {...registerPassword('newPassword')}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-forest-leaf transition-colors"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showNewPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                {newPwdValue && (
                  <div className="h-1 rounded-full overflow-hidden bg-surface-container">
                    <div
                      className={`h-full transition-all duration-300 ${getStrengthColor(newPwdValue)}`}
                      style={{
                        width:
                          newPwdValue.length >= 8
                            ? '100%'
                            : newPwdValue.length >= 6
                              ? '60%'
                              : '30%',
                      }}
                    />
                  </div>
                )}
                {passwordErrors.newPassword && (
                  <p className="text-error text-xs">{passwordErrors.newPassword.message}</p>
                )}
              </div>

              <div className="p-4 bg-surface-container rounded-lg space-y-2 border border-secondary/5">
                <p className="font-label-sm text-label-sm text-on-surface-variant mb-3 uppercase tracking-wider">
                  Security Requirements
                </p>
                {[
                  { label: 'At least 8 characters long', met: newPwdValue.length >= 8 },
                  { label: 'Contains a number or symbol', met: /[0-9!@#$%^&*]/.test(newPwdValue) },
                  {
                    label: 'Mix of uppercase and lowercase',
                    met: /[A-Z]/.test(newPwdValue) && /[a-z]/.test(newPwdValue),
                  },
                ].map(({ label, met }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span
                      className={`material-symbols-outlined text-[18px] ${met ? 'text-forest-leaf' : 'text-outline-variant'}`}
                      style={met ? { fontVariationSettings: "'FILL' 1" } : undefined}
                    >
                      {met ? 'check_circle' : 'circle'}
                    </span>
                    <span
                      className={`font-label-sm text-label-sm ${met ? 'text-on-surface-variant' : 'text-outline'}`}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface-variant block">
                  Confirm New Password
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                    lock_reset
                  </span>
                  <input
                    className={`w-full pl-10 pr-10 py-3 bg-surface-container-low border rounded-lg focus:border-forest-leaf focus:ring-1 focus:ring-forest-leaf transition-all placeholder:text-outline-variant outline-none font-body-md ${passwordErrors.confirmPassword ? 'border-error' : 'border-outline-variant'}`}
                    placeholder="••••••••"
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...registerPassword('confirmPassword')}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-forest-leaf transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showConfirmPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                {passwordErrors.confirmPassword && (
                  <p className="text-error text-xs">{passwordErrors.confirmPassword.message}</p>
                )}
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-error-container rounded-lg">
                  <span className="material-symbols-outlined text-error text-[18px]">error</span>
                  <p className="text-error text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isPasswordSubmitting}
                className="w-full bg-forest-leaf text-white font-label-md text-label-md py-4 rounded-lg shadow-sm hover:opacity-95 active:scale-[0.98] transition-all flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {isPasswordSubmitting ? (
                  <>
                    {' '}
                    <span className="material-symbols-outlined text-[18px] animate-spin">
                      progress_activity
                    </span>{' '}
                    Resetting...{' '}
                  </>
                ) : (
                  <>
                    {' '}
                    Reset Password{' '}
                    <span className="material-symbols-outlined text-[20px]">
                      arrow_forward
                    </span>{' '}
                  </>
                )}
              </button>

              <div className="text-center">
                <Link
                  to="/login"
                  className="font-label-md text-label-md text-forest-leaf hover:underline transition-all inline-flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span> Return
                  to Login
                </Link>
              </div>
            </form>
          </div>
        )}
      </div>
    </TransactionalLayout>
  );
};
