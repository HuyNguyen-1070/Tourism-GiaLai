import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { AuthLayout } from '@/layouts/AuthLayout';
import { FormInput } from '@/components/common/ui/FormInput';
import { LoadingButton } from '@/components/common/ui/LoadingButton';
import { Link } from 'react-router-dom';

const forgotSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotFormValues) => {
    setMessage('');
    setError('');
    const result = await forgotPassword(data.email);
    if (result.success) {
      setMessage('Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.');
    } else {
      setError(result.message || 'Gửi yêu cầu thất bại');
    }
  };

  return (
    <AuthLayout title="Quên mật khẩu" subtitle="Nhập email để nhận mã OTP">
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          className="border-[#7b82f5] text-[#a0a2b9] py-5"
          label="Email"
          type="email"
          placeholder="Vui lòng nhập email đã đăng ký"
          {...register('email')}
          error={errors.email?.message}
        />
        {message && <p className="text-green-600 text-sm mb-4">{message}</p>}
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        <LoadingButton
          type="submit"
          isLoading={isSubmitting}
          className="w-full bg-blue-600 py-5 text-white"
        >
          Gửi yêu cầu
        </LoadingButton>
        <p className="text-center text-gray-600 mt-6">
          <Link to="/login" className="text-blue-600 hover:underline">
            Quay lại đăng nhập
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};
