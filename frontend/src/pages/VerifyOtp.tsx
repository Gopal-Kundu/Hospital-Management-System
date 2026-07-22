import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Activity, ShieldAlert, CheckCircle, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const VerifyOtp = () => {
  const { verifyOtpUser, resendOtpUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';

  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Timer for OTP resend cooldown
  const [cooldown, setCooldown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    if (!email) {
      toast.error('Invalid verification request');
      navigate('/login');
    }
  }, [email, navigate]);

  useEffect(() => {
    let timer;
    if (cooldown > 0 && !canResend) {
      timer = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown, canResend]);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return; // only numbers

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1); // Keep last char
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    if (!/^\d{4}$/.test(pastedData)) return; // must be exactly 4 digits

    const digits = pastedData.split('');
    setOtp(digits);
    inputRefs[3].current?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length !== 4) {
      setError('Please enter a 4-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await verifyOtpUser(email, otpCode);
      if (result.success) {
        toast.success('Account verified successfully!');
        navigate(result.user.role === 'admin' ? '/admin-dashboard' : '/patient-dashboard');
      } else {
        setError(result.error || 'Verification failed');
      }
    } catch (err) {
      setError('Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    const toastId = toast.loading('Resending OTP...');
    try {
      const result = await resendOtpUser(email);
      if (result.success) {
        toast.success('A new 4-digit OTP has been sent!', { id: toastId });
        setCooldown(60);
        setCanResend(false);
        setOtp(['', '', '', '']);
        inputRefs[0].current?.focus();
      } else {
        toast.error(result.error || 'Failed to resend OTP', { id: toastId });
      }
    } catch (err) {
      toast.error('Failed to resend OTP', { id: toastId });
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full shadow-xl relative overflow-hidden">
        {/* Decorative Gradients */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500/5 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl"></div>

        {/* Back Link */}
        <Link 
          to="/login" 
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-650 hover:bg-red-50/50 hover:border-red-200 font-semibold mb-6 px-3 py-1.5 border border-slate-200 rounded-xl transition relative z-10 hover:scale-[1.01] bg-slate-50/50"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Sign In
        </Link>

        {/* Logo/Header */}
        <div className="flex flex-col items-center mb-6 relative">
          <div className="bg-red-50 p-3.5 rounded-2xl border border-red-100 mb-3">
            <Activity className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Verify Your Account</h2>
          <p className="text-slate-550 text-xs mt-2 text-center max-w-xs leading-relaxed">
            We have sent a 4-digit verification code to <span className="font-semibold text-slate-700">{email}</span>. Please enter it below.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-700 text-sm p-3.5 rounded-2xl mb-5">
            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP Digit Boxes */}
          <div className="flex justify-center gap-4 py-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-14 h-14 text-center text-2xl font-black bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:bg-white transition duration-200 shadow-sm"
              />
            ))}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-600 hover:bg-red-550 text-white font-semibold rounded-2xl transition duration-300 shadow-md shadow-red-600/10 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 group-hover:scale-105 transition-transform" />
                Verify OTP & Sign In
              </>
            )}
          </button>
        </form>

        {/* Resend Cooldown */}
        <div className="text-center text-slate-500 text-sm mt-8">
          Didn't receive the email?{' '}
          {canResend ? (
            <button
              onClick={handleResend}
              className="text-red-650 hover:underline font-bold"
            >
              Resend OTP
            </button>
          ) : (
            <span className="text-slate-400 font-medium">
              Resend OTP in <span className="font-bold text-red-500">{cooldown}s</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
