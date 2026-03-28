import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle } from 'lucide-react';

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const strength = (): { label: string; width: string; color: string } => {
    if (!password) return { label: '', width: '0%', color: 'transparent' };
    if (password.length < 6) return { label: 'Weak', width: '25%', color: 'hsl(0 84% 60%)' };
    if (password.length < 8) return { label: 'Fair', width: '50%', color: 'hsl(40 90% 55%)' };
    if (password.length < 12) return { label: 'Good', width: '75%', color: 'hsl(120 50% 45%)' };
    return { label: 'Strong', width: '100%', color: 'hsl(41 80% 45%)' };
  };
  const s = strength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setLoading(true);
    const result = await signup(name, email, password);
    setLoading(false);
    if (result.success) navigate('/');
    else setError(result.error || 'Signup failed.');
  };

  const perks = ['Exclusive drops & early access', 'Rewards for every purchase', 'Follow favourite artists'];

  const inputStyle = {
    background: 'hsl(198 25% 96%)',
    border: '1px solid hsl(196 23% 76%)',
    color: 'hsl(29 80% 21%)',
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden py-12"
      style={{ background: 'linear-gradient(160deg, hsl(173 83% 95%) 0%, hsl(47 98% 90%) 50%, hsl(44 100% 95%) 100%)' }}
    >
      {/* Blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-25 blur-[100px]"
        style={{ background: 'radial-gradient(circle, hsl(44 100% 50%) 0%, transparent 70%)' }} />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full opacity-20 blur-[90px]"
        style={{ background: 'radial-gradient(circle, hsl(174 82% 37%) 0%, transparent 70%)' }} />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/">
            <img src="/images/logo.png" alt="Star Labs" className="h-12 w-auto mx-auto mb-4 opacity-90 hover:opacity-100 transition-opacity" style={{ WebkitFilter: 'drop-shadow(0px 0px 1px rgba(0,0,0,0.4))' }} />
          </Link>
          <p className="text-sm uppercase tracking-[0.25em] font-sans" style={{ color: 'hsl(29 80% 35%)' }}>
            Join the ecosystem
          </p>
        </div>

        {/* Perks */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {perks.map((p, i) => (
            <span key={i} className="flex items-center gap-1.5 text-xs font-sans px-3 py-1.5 rounded-full"
              style={{ background: 'hsl(41 80% 55% / 0.15)', border: '1px solid hsl(41 80% 55% / 0.3)', color: 'hsl(36 70% 35%)' }}>
              <CheckCircle className="w-3 h-3" style={{ color: 'hsl(41 80% 45%)' }} />
              {p}
            </span>
          ))}
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
          <h1 className="font-serif text-3xl mb-1" style={{ color: 'hsl(29 80% 21%)' }}>Create Account</h1>
          <p className="text-sm font-sans mb-8" style={{ color: 'hsl(29 60% 45%)' }}>
            Join thousands of collectors in the StarLabs ecosystem
          </p>

          {error && (
            <div className="mb-5 p-3 rounded-xl text-sm flex items-center gap-2 font-sans"
              style={{ background: 'hsl(0 84% 60% / 0.08)', border: '1px solid hsl(0 84% 60% / 0.25)', color: 'hsl(0 70% 45%)' }}>
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: 'hsl(0 84% 60%)' }} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label htmlFor="signup-name" className="block text-xs font-semibold uppercase tracking-[0.2em] mb-2 font-sans"
                style={{ color: 'hsl(36 70% 41%)' }}>Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(41 80% 55%)' }} />
                <input id="signup-name" type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="Your full name" required
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-sm font-sans focus:outline-none transition-all"
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = 'hsl(41 80% 55%)')}
                  onBlur={e => (e.target.style.borderColor = 'hsl(196 23% 76%)')}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="signup-email" className="block text-xs font-semibold uppercase tracking-[0.2em] mb-2 font-sans"
                style={{ color: 'hsl(36 70% 41%)' }}>Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(41 80% 55%)' }} />
                <input id="signup-email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" required
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-sm font-sans focus:outline-none transition-all"
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = 'hsl(41 80% 55%)')}
                  onBlur={e => (e.target.style.borderColor = 'hsl(196 23% 76%)')}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="signup-password" className="block text-xs font-semibold uppercase tracking-[0.2em] mb-2 font-sans"
                style={{ color: 'hsl(36 70% 41%)' }}>Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(41 80% 55%)' }} />
                <input id="signup-password" type={showPass ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters" required
                  className="w-full pl-11 pr-12 py-3 rounded-xl text-sm font-sans focus:outline-none transition-all"
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = 'hsl(41 80% 55%)')}
                  onBlur={e => (e.target.style.borderColor = 'hsl(196 23% 76%)')}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
                  style={{ color: 'hsl(41 80% 55%)' }}>
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: 'hsl(196 23% 85%)' }}>
                    <div className="h-full rounded-full transition-all duration-300" style={{ width: s.width, background: s.color }} />
                  </div>
                  <p className="text-xs font-sans mt-1" style={{ color: 'hsl(29 60% 50%)' }}>
                    Strength: <span style={{ color: 'hsl(29 80% 25%)' }}>{s.label}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Confirm */}
            <div>
              <label htmlFor="signup-confirm" className="block text-xs font-semibold uppercase tracking-[0.2em] mb-2 font-sans"
                style={{ color: 'hsl(36 70% 41%)' }}>Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(41 80% 55%)' }} />
                <input id="signup-confirm" type={showConfirm ? 'text' : 'password'} value={confirm}
                  onChange={e => setConfirm(e.target.value)} placeholder="Repeat your password" required
                  className="w-full pl-11 pr-12 py-3 rounded-xl text-sm font-sans focus:outline-none transition-all"
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = 'hsl(41 80% 55%)')}
                  onBlur={e => (e.target.style.borderColor = 'hsl(196 23% 76%)')}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
                  style={{ color: 'hsl(41 80% 55%)' }}>
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirm.length > 0 && (
                <p className="text-xs font-sans mt-1" style={{ color: confirm === password ? 'hsl(120 50% 38%)' : 'hsl(0 70% 45%)' }}>
                  {confirm === password ? '✓ Passwords match' : '✗ Passwords do not match'}
                </p>
              )}
            </div>

            <button
              id="signup-submit"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-2 font-sans transition-all duration-300 group disabled:opacity-60 mt-2"
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
                  Creating Account…
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 text-center text-sm font-sans"
            style={{ borderTop: '1px solid hsl(196 23% 82%)', color: 'hsl(29 60% 45%)' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold hover:underline" style={{ color: 'hsl(36 70% 41%)' }}>
              Sign in
            </Link>
          </div>
        </div>

        <p className="text-center text-xs font-sans mt-6" style={{ color: 'hsl(29 40% 55%)' }}>
          By creating an account you agree to StarLabs{' '}
          <a href="#" className="hover:underline" style={{ color: 'hsl(41 80% 45%)' }}>Terms</a>
          {' '}&amp;{' '}
          <a href="#" className="hover:underline" style={{ color: 'hsl(41 80% 45%)' }}>Privacy</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
