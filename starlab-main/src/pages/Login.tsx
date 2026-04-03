import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';

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
    if (result.success) navigate('/');
    else setError(result.error || 'Login failed.');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, hsl(173 83% 95%) 0%, hsl(47 98% 90%) 50%, hsl(44 100% 95%) 100%)' }}
    >
      {/* Decorative blobs */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full opacity-30 blur-[100px]"
        style={{ background: 'radial-gradient(circle, hsl(44 100% 50%) 0%, transparent 70%)' }} />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full opacity-20 blur-[90px]"
        style={{ background: 'radial-gradient(circle, hsl(174 82% 37%) 0%, transparent 70%)' }} />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/">
            <img src="/images/logo.png" alt="Star Labs" className="h-12 w-auto mx-auto mb-4 opacity-90 hover:opacity-100 transition-opacity" style={{ WebkitFilter: 'drop-shadow(0px 0px 1px rgba(0,0,0,0.4))' }} />
          </Link>
          <p className="text-sm uppercase tracking-[0.25em] font-sans" style={{ color: 'hsl(29 80% 35%)' }}>
            Welcome back
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl p-8 border"
          style={{
            background: 'rgba(255,255,255,0.65)',
            backdropFilter: 'blur(24px)',
            borderColor: 'hsl(41 80% 55% / 0.3)',
            boxShadow: '0 25px 60px -10px hsl(41 80% 55% / 0.15), inset 0 1px 0 rgba(255,255,255,0.8)',
          }}
        >
          <h1 className="font-serif text-3xl mb-1" style={{ color: 'hsl(29 80% 21%)' }}>Sign In</h1>
          <p className="text-sm font-sans mb-8" style={{ color: 'hsl(29 60% 45%)' }}>
            Access your StarLabs account
          </p>

          {error && (
            <div className="mb-6 p-3 rounded-xl text-sm flex items-center gap-2"
              style={{ background: 'hsl(0 84% 60% / 0.08)', border: '1px solid hsl(0 84% 60% / 0.25)', color: 'hsl(0 70% 45%)' }}>
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: 'hsl(0 84% 60%)' }} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="block text-xs font-semibold uppercase tracking-[0.2em] mb-2 font-sans"
                style={{ color: 'hsl(36 70% 41%)' }}>
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(41 80% 55%)' }} />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-sm font-sans transition-all focus:outline-none"
                  style={{
                    background: 'hsl(198 25% 96%)',
                    border: '1px solid hsl(196 23% 76%)',
                    color: 'hsl(29 80% 21%)',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'hsl(41 80% 55%)')}
                  onBlur={e => (e.target.style.borderColor = 'hsl(196 23% 76%)')}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className="block text-xs font-semibold uppercase tracking-[0.2em] mb-2 font-sans"
                style={{ color: 'hsl(36 70% 41%)' }}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(41 80% 55%)' }} />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-12 py-3 rounded-xl text-sm font-sans transition-all focus:outline-none"
                  style={{
                    background: 'hsl(198 25% 96%)',
                    border: '1px solid hsl(196 23% 76%)',
                    color: 'hsl(29 80% 21%)',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'hsl(41 80% 55%)')}
                  onBlur={e => (e.target.style.borderColor = 'hsl(196 23% 76%)')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
                  style={{ color: 'hsl(41 80% 55%)' }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-sans">
              <label className="flex items-center gap-2 cursor-pointer select-none" style={{ color: 'hsl(29 60% 45%)' }}>
                <input type="checkbox" className="w-3.5 h-3.5 accent-[hsl(41,80%,55%)]" />
                Remember me
              </label>
              <a href="#" className="transition-colors hover:underline" style={{ color: 'hsl(41 80% 45%)' }}>
                Forgot password?
              </a>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all duration-300 font-sans group disabled:opacity-60"
              style={{
                background: 'linear-gradient(135deg, hsl(41 80% 55%) 0%, hsl(36 70% 45%) 100%)',
                color: 'hsl(198 25% 98%)',
                boxShadow: loading ? 'none' : '0 8px 30px hsl(41 80% 55% / 0.35)',
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

          <div
            className="mt-6 pt-6 text-center text-sm font-sans"
            style={{ borderTop: '1px solid hsl(196 23% 82%)', color: 'hsl(29 60% 45%)' }}
          >
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold hover:underline" style={{ color: 'hsl(36 70% 41%)' }}>
              Create one
            </Link>
          </div>
        </div>

        <p className="text-center text-xs font-sans mt-6" style={{ color: 'hsl(29 40% 55%)' }}>
          By signing in you agree to StarLabs{' '}
          <a href="#" className="hover:underline" style={{ color: 'hsl(41 80% 45%)' }}>Terms</a>
          {' '}&amp;{' '}
          <a href="#" className="hover:underline" style={{ color: 'hsl(41 80% 45%)' }}>Privacy</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
