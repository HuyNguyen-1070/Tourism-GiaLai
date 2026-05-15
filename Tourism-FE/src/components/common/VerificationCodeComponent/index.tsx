import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface VerificationCodeProps {
  email: string;
  type: 'register' | 'forgot-password';
  onVerified: (otpCode: string) => void;
  onBack: () => void;
}

const CODE_LENGTH = 6;
const EXPIRE_SECONDS = 300;

export const VerificationCode = ({ email, type, onVerified, onBack }: VerificationCodeProps) => {
  const { verifyOtp, resendCode } = useAuth();
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(EXPIRE_SECONDS);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setIsResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      setError(null);
      if (value && index < CODE_LENGTH - 1) inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH);
    if (paste) {
      const newCode = Array(CODE_LENGTH).fill('');
      paste.split('').forEach((char, i) => {
        newCode[i] = char;
      });
      setCode(newCode);
      const nextEmpty = paste.length < CODE_LENGTH ? paste.length : CODE_LENGTH - 1;
      inputRefs.current[nextEmpty]?.focus();
    }
  };

  const handleSubmit = async () => {
    const fullCode = code.join('');
    if (timeLeft <= 0) {
      setError('Mã xác thực đã hết hạn. Vui lòng gửi lại mã.');
      return;
    }
    if (fullCode.length !== CODE_LENGTH) {
      setError(`Vui lòng nhập đủ ${CODE_LENGTH} chữ số.`);
      return;
    }
    setIsVerifying(true);
    const result = await verifyOtp(email, fullCode, type);
    setIsVerifying(false);
    if (result.success) {
      onVerified(fullCode);
    } else {
      setError(result.message || 'Xác thực OTP thất bại');
    }
  };

  const handleResendCode = async () => {
    setResendMessage('');
    const result = await resendCode(email, type);
    if (result.success) {
      setTimeLeft(EXPIRE_SECONDS);
      setIsResendDisabled(true);
      setCode(Array(CODE_LENGTH).fill(''));
      setError(null);
      setResendMessage('Mã xác thực mới đã được gửi đến email của bạn.');
      inputRefs.current[0]?.focus();
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setError(result.message || 'Không thể gửi lại mã.');
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isCodeComplete = code.join('').length === CODE_LENGTH;
  const description =
    type === 'register'
      ? `Mã xác thực đã được gửi đến ${email}. Vui lòng nhập mã để kích hoạt tài khoản.`
      : `Mã xác thực đã được gửi đến ${email}. Vui lòng nhập mã để đặt lại mật khẩu.`;

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-fixed/30 text-forest-leaf mx-auto">
          <span className="material-symbols-outlined text-[32px]">mark_email_read</span>
        </div>
        <p className="font-body-md text-on-surface-variant">{description}</p>
      </div>

      <div className="flex items-center justify-center gap-2 text-forest-leaf">
        <span className="material-symbols-outlined text-[20px]">timer</span>
        <span className="font-label-md text-label-md">
          {timeLeft > 0 ? (
            <>
              Hiệu lực còn lại: <strong>{formatTime(timeLeft)}</strong>
            </>
          ) : (
            <span className="text-error">Mã đã hết hạn</span>
          )}
        </span>
      </div>

      <div className="flex justify-between gap-2 max-w-xs mx-auto">
        {code.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleCodeChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            className={`w-full aspect-square text-center font-headline-md text-headline-md rounded-lg border-2 transition-all outline-none
              ${error ? 'border-error bg-error-container/20' : digit ? 'border-forest-leaf bg-primary-fixed/20' : 'border-outline-variant bg-surface-container-low focus:border-forest-leaf focus:ring-2 focus:ring-forest-leaf/20'}`}
          />
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-error-container rounded-lg">
          <span className="material-symbols-outlined text-error text-[18px]">error</span>
          <p className="text-error text-sm">{error}</p>
        </div>
      )}
      {resendMessage && (
        <div className="flex items-center gap-2 p-3 bg-primary-fixed rounded-lg">
          <span className="material-symbols-outlined text-forest-leaf text-[18px]">
            check_circle
          </span>
          <p className="text-forest-leaf text-sm">{resendMessage}</p>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!isCodeComplete || isVerifying}
        className="w-full py-4 px-6 bg-forest-leaf text-white font-label-md text-label-md rounded-lg shadow-sm hover:bg-primary transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isVerifying ? (
          <>
            <span className="material-symbols-outlined text-[18px] animate-spin">
              progress_activity
            </span>
            Đang xác thực...
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-[18px]">check</span> Xác nhận
          </>
        )}
      </button>

      <div className="flex flex-col items-center gap-3">
        <button
          onClick={handleResendCode}
          disabled={isResendDisabled}
          className={`flex items-center gap-1 font-label-md text-label-md transition-colors ${isResendDisabled ? 'text-outline-variant cursor-not-allowed' : 'text-secondary hover:text-on-secondary-container'}`}
        >
          <span className="material-symbols-outlined text-[18px]">replay</span>
          Gửi lại mã
        </button>
        <button
          onClick={onBack}
          className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant hover:text-forest-leaf transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Quay lại
        </button>
      </div>
    </div>
  );
};
