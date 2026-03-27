import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Star, CheckCircle } from 'lucide-react';

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const passwordStrength = (): { label: string; color: string; width: string } => {
    if (password.length === 0) return { label: '', color: 'bg-transparent', width: '0%' };
    if (password.length < 6) return { label: 'Weak', color: 'bg-red-500', width: '25%' };
    if (password.length < 8) return { label: 'Fair', color: 'bg-yellow-500', width: '50%' };
    if (password.length < 12) return { label: 'Good', color: 'bg-green-500', width: '75%' };
    return { label: 'Strong', color: 'bg-[#FBD515]', width: '100%' };
  };

  const strength = passwordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    const result = await signup(name, email, password);
    setLoading(false);
    if (result.success) {
      navigate('/profile');
    } else {
      setError(result.error || 'Signup failed.');
    }
  };

  const perks = [
    'Exclusive NFT drops & early access',
    'Earn rewards for every purchase',
    'Follow your favourite artists',
  ];

  return (
    <div className="min-h-screen bg-[#0a0806] flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] right-[-5%] w-[550px] h-[550px] rounded-full bg-[#FBD515]/10 blur-[130px] animate-pulse" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#FBD515]/8 blur-[110px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(251,213,21,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(251,213,21,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative z-10 w-full max-w-lg px-4 py-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <Star className="w-8 h-8 text-[#FBD515] fill-[#FBD515] group-hover:scale-110 transition-transform" />
            <span className="text-2xl font-bold text-white tracking-widest uppercase">StarLabs</span>
          </Link>
          <p className="mt-3 text-[#9a8a6a] text-sm tracking-wider">Join the future of music & beauty</p>
        </div>

        {/* Perks */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {perks.map((p, i) => (
            <span key={i} className="flex items-center gap-1.5 text-xs text-[#c8a84b] bg-[#FBD515]/8 border border-[#FBD515]/20 rounded-full px-3 py-1.5">
              <CheckCircle className="w-3 h-3 text-[#FBD515]" />
              {p}
            </span>
          ))}
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8 border border-[#FBD515]/20"
          style={{
            background: 'linear-gradient(135deg, rgba(251,213,21,0.08) 0%, rgba(20,15,5,0.95) 60%)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 0 60px rgba(251,213,21,0.08), inset 0 1px 0 rgba(251,213,21,0.15)',
          }}
        >
          <h1 className="text-2xl font-bold text-white mb-1">Create Account</h1>
          <p className="text-[#9a8a6a] text-sm mb-8">Join thousands of collectors in the StarLabs ecosystem</p>

          {error && (
            <div className="mb-5 p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label htmlFor="signup-name" className="block text-xs font-semibold text-[#c8a84b] uppercase tracking-widest mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FBD515]/50" />
                <input
                  id="signup-name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/40 border border-[#FBD515]/20 text-white placeholder-[#5a4a2a] focus:outline-none focus:border-[#FBD515]/60 focus:ring-2 focus:ring-[#FBD515]/10 transition-all text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="signup-email" className="block text-xs font-semibold text-[#c8a84b] uppercase tracking-widest mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FBD515]/50" />
                <input
                  id="signup-email"
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
              <label htmlFor="signup-password" className="block text-xs font-semibold text-[#c8a84b] uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FBD515]/50" />
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  required
                  className="w-full pl-11 pr-12 py-3 rounded-xl bg-black/40 border border-[#FBD515]/20 text-white placeholder-[#5a4a2a] focus:outline-none focus:border-[#FBD515]/60 focus:ring-2 focus:ring-[#FBD515]/10 transition-all text-sm"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#FBD515]/50 hover:text-[#FBD515] transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Strength bar */}
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full ${strength.color} transition-all duration-300 rounded-full`} style={{ width: strength.width }} />
                  </div>
                  <p className="text-xs text-[#9a8a6a] mt-1">Strength: <span className="text-white">{strength.label}</span></p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="signup-confirm" className="block text-xs font-semibold text-[#c8a84b] uppercase tracking-widest mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FBD515]/50" />
                <input
                  id="signup-confirm"
                  type={showConfirm ? 'text' : 'password'}
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Repeat your password"
                  required
                  className="w-full pl-11 pr-12 py-3 rounded-xl bg-black/40 border border-[#FBD515]/20 text-white placeholder-[#5a4a2a] focus:outline-none focus:border-[#FBD515]/60 focus:ring-2 focus:ring-[#FBD515]/10 transition-all text-sm"
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#FBD515]/50 hover:text-[#FBD515] transition-colors">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirm.length > 0 && (
                <p className={`text-xs mt-1 ${confirm === password ? 'text-green-400' : 'text-red-400'}`}>
                  {confirm === password ? '✓ Passwords match' : '✗ Passwords do not match'}
                </p>
              )}
            </div>

            <button
              id="signup-submit"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-60 group mt-2"
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

          <div className="mt-6 pt-6 border-t border-[#FBD515]/10 text-center text-sm text-[#9a8a6a]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#FBD515] font-semibold hover:underline">
              Sign in
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-[#5a4a2a] mt-6">
          By creating an account, you agree to StarLabs{' '}
          <a href="#" className="text-[#FBD515]/60 hover:text-[#FBD515]">Terms</a> &amp;{' '}
          <a href="#" className="text-[#FBD515]/60 hover:text-[#FBD515]">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
