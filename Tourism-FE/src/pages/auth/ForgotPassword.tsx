import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { AuthLayout } from '@/layouts/AuthLayout';
import { FormInput } from '@/components/common/ui/FormInput';
import { LoadingButton } from '@/components/common/ui/LoadingButton';
import { VerificationCode } from '@/components/common/VerificationCodeComponent';

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

export const ForgotPassword = () => {
  const { forgotPassword, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors, isSubmitting: isEmailSubmitting },
  } = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
  });

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

  const handleOtpVerified = () => setStep(3);
  const handleBackFromOtp = () => {
    setStep(1);
    setEmail('');
  };

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    setError('');
    const result = await resetPassword(email, data.newPassword);
    if (result.success) {
      navigate('/login');
    } else {
      setError(result.message || 'Đặt lại mật khẩu thất bại');
    }
  };

  return (
    <AuthLayout
      title={step === 1 ? 'Quên mật khẩu' : step === 2 ? 'Xác thực mã OTP' : 'Đặt mật khẩu mới'}
      subtitle={
        step === 1
          ? 'Nhập email để nhận mã xác thực'
          : step === 2
            ? `Mã OTP đã gửi đến ${email}`
            : 'Nhập mật khẩu mới của bạn'
      }
    >
      {step === 1 && (
        <form onSubmit={handleEmailSubmit(onEmailSubmit)}>
          <FormInput
            label="Email"
            type="email"
            {...registerEmail('email')}
            error={emailErrors.email?.message}
          />
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
          <LoadingButton type="submit" isLoading={isEmailSubmitting} className="w-full">
            Gửi yêu cầu
          </LoadingButton>
        </form>
      )}

      {step === 2 && (
        <VerificationCode email={email} onVerified={handleOtpVerified} onBack={handleBackFromOtp} />
      )}

      {step === 3 && (
        <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
          <FormInput
            label="Mật khẩu mới"
            type="password"
            {...registerPassword('newPassword')}
            error={passwordErrors.newPassword?.message}
          />
          <FormInput
            label="Xác nhận mật khẩu"
            type="password"
            {...registerPassword('confirmPassword')}
            error={passwordErrors.confirmPassword?.message}
          />
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
          <LoadingButton type="submit" isLoading={isPasswordSubmitting} className="w-full">
            Đặt lại mật khẩu
          </LoadingButton>
        </form>
      )}
    </AuthLayout>
  );
};
