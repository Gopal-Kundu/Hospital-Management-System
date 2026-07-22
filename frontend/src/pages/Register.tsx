import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { User as UserIcon, Mail, Lock, UserPlus, Activity, AlertCircle, ShieldAlert, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await registerUser({ name, email, password, role });
      if (result.success) {
        if (result.requiresOtp) {
          toast.success('Registration successful! Verification code sent.');
          navigate(`/verify-otp?email=${encodeURIComponent(result.email || email)}`);
        } else {
          toast.success('Registration successful! Welcome.');
        }
      } else {
        const errorMessage = result.error || 'Registration failed';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      setError('Registration failed');
      toast.error('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full shadow-xl relative overflow-hidden">
        {/* Decorative Gradients */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500/5 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl"></div>

        {/* Back to Home Link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-650 hover:bg-red-50/50 hover:border-red-200 font-semibold mb-6 px-3 py-1.5 border border-slate-200 rounded-xl transition relative z-10 hover:scale-[1.01] bg-slate-50/50"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Home
        </Link>

        {/* Logo/Header */}
        <div className="flex flex-col items-center mb-6 relative">
          <div className="bg-red-50 p-3.5 rounded-2xl border border-red-100 mb-3">
            <Activity className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create Account</h2>
          <p className="text-slate-500 text-sm mt-1 text-center">
            Register your profile to access our healthcare services
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-700 text-sm p-3.5 rounded-2xl mb-5">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 block">Full Name</label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:bg-white transition duration-300"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:bg-white transition duration-300"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:bg-white transition duration-300"
              />
            </div>
          </div>

          {/* Role selection */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 block">Account Role</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('patient')}
                className={`py-2.5 rounded-2xl text-sm font-semibold border transition duration-300 ${
                  role === 'patient'
                    ? 'bg-red-50 border-red-500 text-red-600'
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-700'
                }`}
              >
                Patient
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`py-2.5 rounded-2xl text-sm font-semibold border transition duration-300 ${
                  role === 'admin'
                    ? 'bg-red-50 border-red-500 text-red-600'
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-700'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-600 hover:bg-red-550 text-white font-semibold rounded-2xl transition duration-300 shadow-md shadow-red-600/10 disabled:opacity-50 disabled:cursor-not-allowed mt-4 group"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <UserPlus className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                Register
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-slate-500 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-red-600 hover:underline font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
