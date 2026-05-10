import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AuthLayout } from '@/layouts/AuthLayout';
import { FormInput } from '@/components/common/ui/FormInput';
import { LoadingButton } from '@/components/common/ui/LoadingButton';
import { Link } from 'react-router-dom';

const loginSchema = z.object({
  username: z.string().min(1, 'Vui lòng nhập tên đăng nhập'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

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

  const onSubmit = async (data: LoginFormValues) => {
    setError('');
    const result = await login(data.username, data.password);
    if (!result.success) {
      setError(result.message || 'Đăng nhập thất bại');
    }
  };

  return (
    <AuthLayout title="Chào mừng trở lại" subtitle="Đăng nhập để khám phá Gia Lai">
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          className="border-[#7b82f5] text-[#a0a2b9] py-5"
          placeholder="Tên đăng nhập"
          {...register('username')}
          error={errors.username?.message}
        />
        <FormInput
          className="border-[#7b82f5] text-[#a0a2b9] py-5"
          placeholder="Mật khẩu"
          type="password"
          {...register('password')}
          error={errors.password?.message}
        />
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        <LoadingButton
          type="submit"
          isLoading={isSubmitting}
          className="w-full bg-blue-600 py-5 text-white"
        >
          Đăng nhập
        </LoadingButton>
        <div className="text-center mt-4">
          <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
            Quên mật khẩu?
          </Link>
        </div>
        <p className="text-center text-gray-600 mt-6">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};
