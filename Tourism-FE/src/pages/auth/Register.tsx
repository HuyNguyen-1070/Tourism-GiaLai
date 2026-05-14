import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { AuthLayout } from '@/layouts/AuthLayout';

const registerSchema = z
  .object({
    fullName: z.string().min(1, 'Họ tên không được để trống'),
    username: z.string().min(3, 'Username phải có ít nhất 3 ký tự').max(20),
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const InputField = ({
  label,
  error,
  type = 'text',
  placeholder,
  registration,
}: {
  label: string;
  error?: string;
  type?: string;
  placeholder?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registration: any;
}) => (
  <div className="flex flex-col mb-4">
    <label className="font-label-md text-label-md text-on-surface-variant mb-1">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      className={`border rounded-lg p-3 focus:ring-2 focus:ring-forest-leaf focus:border-forest-leaf outline-none transition-all bg-mist-beige/50 font-body-md text-on-surface placeholder:text-outline-variant ${
        error ? 'border-error' : 'border-outline-variant'
      }`}
      {...registration}
    />
    {error && <p className="text-error text-xs mt-1">{error}</p>}
  </div>
);

export const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const passwordValue = watch('password', '');
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { label: '', width: '0%', color: '' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 1) return { label: 'Yếu', width: '25%', color: 'bg-error' };
    if (score === 2) return { label: 'Trung bình', width: '50%', color: 'bg-secondary' };
    if (score === 3) return { label: 'Mạnh', width: '75%', color: 'bg-forest-leaf' };
    return { label: 'Rất mạnh', width: '100%', color: 'bg-forest-leaf' };
  };

  const strength = getPasswordStrength(passwordValue);

  const onSubmit = async (data: RegisterFormValues) => {
    setError('');
    setSuccess('');
    const result = await registerUser({
      fullName: data.fullName,
      username: data.username,
      email: data.email,
      password: data.password,
    });
    if (result.success) {
      setSuccess('Đăng ký thành công! Đang chuyển hướng...');
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setError(result.message || 'Đăng ký thất bại');
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Step into the heart of the Central Highlands."
      heroTitle="Join the Heritage Journey"
      heroSubtitle="Create an account to preserve your favorite historical landmarks and cultural events across the Gia Lai plateau."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
        <InputField
          label="Full Name"
          placeholder="Le Van Gia"
          registration={register('fullName')}
          error={errors.fullName?.message}
        />
        <InputField
          label="Username"
          placeholder="gialai_traveler"
          registration={register('username')}
          error={errors.username?.message}
        />
        <InputField
          label="Email"
          type="email"
          placeholder="heritage@gialai.gov"
          registration={register('email')}
          error={errors.email?.message}
        />

        {/* Password with strength indicator */}
        <div className="flex flex-col mb-4">
          <label className="font-label-md text-label-md text-on-surface-variant mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className={`border rounded-lg p-3 focus:ring-2 focus:ring-forest-leaf focus:border-forest-leaf outline-none transition-all bg-mist-beige/50 font-body-md text-on-surface placeholder:text-outline-variant ${
              errors.password ? 'border-error' : 'border-outline-variant'
            }`}
            {...register('password')}
          />
          {passwordValue && (
            <div className="mt-2">
              <div className="flex items-center space-x-2">
                <div className="h-1 flex-grow bg-surface-container rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${strength.color}`}
                    style={{ width: strength.width }}
                  />
                </div>
                <span
                  className={`font-label-sm text-label-sm ${strength.color.replace('bg-', 'text-')}`}
                >
                  {strength.label}
                </span>
              </div>
            </div>
          )}
          <p className="font-label-sm text-[13px] text-on-surface-variant mt-1">
            Minimum 8 characters, include a number and symbol.
          </p>
          {errors.password && <p className="text-error text-xs mt-1">{errors.password.message}</p>}
        </div>

        <InputField
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          registration={register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />

        {error && (
          <div className="flex items-center gap-2 p-3 bg-error-container rounded-lg">
            <span className="material-symbols-outlined text-error text-[18px]">error</span>
            <p className="text-error text-sm">{error}</p>
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 p-3 bg-primary-fixed rounded-lg">
            <span className="material-symbols-outlined text-forest-leaf text-[18px]">
              check_circle
            </span>
            <p className="text-forest-leaf text-sm font-medium">{success}</p>
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-forest-leaf text-white font-label-md text-label-md py-4 rounded-lg shadow-md hover:bg-primary transition-all active:scale-95 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">
                  progress_activity
                </span>
                Creating Account...
              </>
            ) : (
              <>
                Create Account
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </>
            )}
          </button>
        </div>

        <div className="text-center pt-4">
          <p className="font-body-md text-on-surface-variant">
            Already have an account?{' '}
            <Link className="text-[#2c3327] font-bold hover:underline transition-all" to="/login">
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};
