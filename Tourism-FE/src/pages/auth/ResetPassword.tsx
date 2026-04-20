import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { AuthLayout } from '@/layouts/AuthLayout';
import { FormInput } from '@/components/common/ui/FormInput';
import { LoadingButton } from '@/components/common/ui/LoadingButton';

const resetSchema = z
  .object({
    email: z.string().email('Email không hợp lệ'),
    otp: z.string().length(6, 'Mã OTP gồm 6 chữ số'),
    newPassword: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

type ResetFormValues = z.infer<typeof resetSchema>;

export const ResetPassword = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { email: searchParams.get('email') || '' },
  });

  const onSubmit = async (data: ResetFormValues) => {
    setError('');
    setSuccess('');
    const result = await resetPassword(data.email, data.otp, data.newPassword);
    if (result.success) {
      setSuccess('Đặt lại mật khẩu thành công! Chuyển hướng đến đăng nhập...');
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setError(result.message || 'Đặt lại mật khẩu thất bại');
    }
  };

  return (
    <AuthLayout title="Đặt lại mật khẩu" subtitle="Nhập mã OTP và mật khẩu mới">
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          label="Email"
          type="email"
          {...register('email')}
          error={errors.email?.message}
          disabled={!!searchParams.get('email')}
          className="border-[#7b82f5] text-[#a0a2b9] py-5"
        />
        <FormInput
          label="Mã OTP"
          {...register('otp')}
          error={errors.otp?.message}
          className="border-[#7b82f5] text-[#a0a2b9] py-5"
        />
        <FormInput
          label="Mật khẩu mới"
          type="password"
          {...register('newPassword')}
          error={errors.newPassword?.message}
          className="border-[#7b82f5] text-[#a0a2b9] py-5"
        />
        <FormInput
          label="Xác nhận mật khẩu"
          type="password"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
          className="border-[#7b82f5] text-[#a0a2b9] py-5"
        />
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-4">{success}</p>}
        <LoadingButton
          type="submit"
          isLoading={isSubmitting}
          className="w-full bg-blue-600 py-5 text-white"
        >
          Xác nhận
        </LoadingButton>
      </form>
    </AuthLayout>
  );
};
