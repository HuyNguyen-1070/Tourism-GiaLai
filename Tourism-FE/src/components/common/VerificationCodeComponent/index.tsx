import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LoadingButton } from '@/components/common/CustomUi/LoadingButton';

interface VerificationCodeProps {
  email: string;
  onVerified: () => void;
  onBack: () => void;
}

const VERIFICATION_CODE_LENGTH = 6;
const VERIFICATION_EXPIRE_SECONDS = 300;

export const VerificationCode = ({ email, onVerified, onBack }: VerificationCodeProps) => {
  const { verifyOtp } = useAuth();
  const [code, setCode] = useState<string[]>(Array(VERIFICATION_CODE_LENGTH).fill(''));
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(VERIFICATION_EXPIRE_SECONDS);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);

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
      if (value && index < VERIFICATION_CODE_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const fullCode = code.join('').trim();
    if (timeLeft <= 0) {
      setError('Mã xác thực đã hết hạn. Vui lòng nhấn "Gửi lại mã".');
      return;
    }
    if (fullCode.length !== VERIFICATION_CODE_LENGTH) {
      setError(`Vui lòng nhập đủ ${VERIFICATION_CODE_LENGTH} chữ số.`);
      return;
    }

    setIsVerifying(true);
    const result = await verifyOtp(email, fullCode);
    setIsVerifying(false);
    if (result.success) {
      onVerified();
    } else {
      setError(result.message ?? 'Xác thực OTP thất bại');
    }
  };

  const handleResendCode = async () => {
    setTimeLeft(VERIFICATION_EXPIRE_SECONDS);
    setIsResendDisabled(true);
    setCode(Array(VERIFICATION_CODE_LENGTH).fill(''));
    setError(null);
    inputRefs.current[0]?.focus();
    alert('Mã xác thực mới đã được gửi đến email của bạn.');
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!email) return null;

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-100 transition"
        >
          ←
        </button>
        <h2 className="text-xl font-semibold">Xác thực mã OTP</h2>
      </div>

      <p className="text-md text-gray-600 mb-4">
        Mã xác thực đã được gửi đến email <strong className="text-gray-900">{email}</strong>. Vui
        lòng nhập mã bên dưới.
      </p>

      <div className="mb-2 text-left">
        <span className="text-md text-gray-700">
          Mã có hiệu lực trong: <span className="font-bold text-black">{formatTime(timeLeft)}</span>
        </span>
      </div>

      <div className="flex gap-2 justify-center mb-6 w-full">
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
            className={`
              w-12 h-12 text-center text-xl font-bold rounded-lg border-2
              ${error ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'}
              focus:outline-none focus:ring-1 focus:ring-blue-500
              transition-colors
            `}
          />
        ))}
      </div>

      {error && <p className="text-red-600 text-sm mb-4 text-left">{error}</p>}

      <LoadingButton
        onClick={handleSubmit}
        isLoading={isVerifying}
        disabled={code.join('').length !== VERIFICATION_CODE_LENGTH}
        className="w-full text-md min-h-[35px]"
      >
        Xác nhận
      </LoadingButton>

      <p className="text-md text-gray-600 mt-4 text-center">
        Chưa nhận được mã?{' '}
        <button
          onClick={handleResendCode}
          className={`font-medium ${
            isResendDisabled ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:underline'
          }`}
          disabled={isResendDisabled}
        >
          Gửi lại mã
        </button>
      </p>
    </div>
  );
};
