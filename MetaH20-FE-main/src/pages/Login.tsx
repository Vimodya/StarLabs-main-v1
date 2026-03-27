import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Star } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate('/profile');
    } else {
      setError(result.error || 'Login failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0806] flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#FBD515]/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#FBD515]/8 blur-[100px] animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] rounded-full bg-[#E6A817]/6 blur-[80px] animate-pulse" style={{ animationDelay: '3s' }} />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(251,213,21,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(251,213,21,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <Star className="w-8 h-8 text-[#FBD515] fill-[#FBD515] group-hover:scale-110 transition-transform" />
            <span className="text-2xl font-bold text-white tracking-widest uppercase">StarLabs</span>
          </Link>
          <p className="mt-3 text-[#9a8a6a] text-sm tracking-wider">Welcome back to the ecosystem</p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8 border border-[#FBD515]/20 shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(251,213,21,0.08) 0%, rgba(20,15,5,0.95) 60%)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 0 60px rgba(251,213,21,0.08), inset 0 1px 0 rgba(251,213,21,0.15)',
          }}
        >
          <h1 className="text-2xl font-bold text-white mb-1">Sign In</h1>
          <p className="text-[#9a8a6a] text-sm mb-8">Enter your credentials to access your account</p>

          {error && (
            <div className="mb-6 p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="block text-xs font-semibold text-[#c8a84b] uppercase tracking-widest mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FBD515]/50" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/40 border border-[#FBD515]/20 text-white placeholder-[#5a4a2a] focus:outline-none focus:border-[#FBD515]/60 focus:ring-2 focus:ring-[#FBD515]/10 transition-all text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className="block text-xs font-semibold text-[#c8a84b] uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FBD515]/50" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-12 py-3 rounded-xl bg-black/40 border border-[#FBD515]/20 text-white placeholder-[#5a4a2a] focus:outline-none focus:border-[#FBD515]/60 focus:ring-2 focus:ring-[#FBD515]/10 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#FBD515]/50 hover:text-[#FBD515] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-[#9a8a6a] cursor-pointer select-none">
                <input type="checkbox" className="accent-[#FBD515] w-3.5 h-3.5" />
                Remember me
              </label>
              <a href="#" className="text-[#FBD515]/70 hover:text-[#FBD515] transition-colors">
                Forgot password?
              </a>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-60 group"
              style={{
                background: loading ? 'rgba(251,213,21,0.3)' : 'linear-gradient(135deg, #FBD515 0%, #E6A817 100%)',
                color: '#0a0806',
                boxShadow: loading ? 'none' : '0 0 30px rgba(251,213,21,0.3)',
              }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing In…
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#FBD515]/10 text-center text-sm text-[#9a8a6a]">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#FBD515] font-semibold hover:underline">
              Create one
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-[#5a4a2a] mt-6">
          By signing in, you agree to StarLabs{' '}
          <a href="#" className="text-[#FBD515]/60 hover:text-[#FBD515]">Terms</a> &amp;{' '}
          <a href="#" className="text-[#FBD515]/60 hover:text-[#FBD515]">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
