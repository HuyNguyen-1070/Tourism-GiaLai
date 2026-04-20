import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { AuthLayout } from '@/layouts/AuthLayout';
import { FormInput } from '@/components/common/ui/FormInput';
import { LoadingButton } from '@/components/common/ui/LoadingButton';
import { Link } from 'react-router-dom';

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

export const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setError('');
    setSuccess('');
    const payload = {
      fullName: data.fullName,
      username: data.username,
      email: data.email,
      password: data.password,
    };
    const result = await registerUser(payload);
    if (result.success) {
      setSuccess('Đăng ký thành công! Vui lòng đăng nhập.');
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setError(result.message || 'Đăng ký thất bại');
    }
  };

  return (
    <AuthLayout title="Tạo tài khoản" subtitle="Tham gia cộng đồng du lịch Gia Lai">
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          className="border-[#7b82f5] text-[#a0a2b9] py-5"
          label="Họ tên"
          placeholder="Nhập họ tên"
          {...register('fullName')}
          error={errors.fullName?.message}
        />
        <FormInput
          className="border-[#7b82f5] text-[#a0a2b9] py-5"
          label="Tên đăng nhập"
          placeholder="Nhập username"
          {...register('username')}
          error={errors.username?.message}
        />
        <FormInput
          className="border-[#7b82f5] text-[#a0a2b9] py-5"
          label="Email"
          placeholder="Nhập Email"
          type="email"
          {...register('email')}
          error={errors.email?.message}
        />
        <FormInput
          className="border-[#7b82f5] text-[#a0a2b9] py-5"
          label="Mật khẩu"
          placeholder="Nhập mật khẩu"
          type="password"
          {...register('password')}
          error={errors.password?.message}
        />
        <FormInput
          placeholder="Nhập lại mật khẩu"
          label="Xác nhận mật khẩu"
          className="border-[#7b82f5] text-[#a0a2b9] py-5"
          type="password"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-4">{success}</p>}
        <LoadingButton type="submit" isLoading={isSubmitting} className="w-full bg-blue-600 py-5">
          Đăng ký
        </LoadingButton>
        <p className="text-center text-gray-600 mt-6">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Đăng nhập
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};
