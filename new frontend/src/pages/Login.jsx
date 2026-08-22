import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Globe, Loader2 } from 'lucide-react';
import { authApi } from '../api';

const LOGIN_IMAGE =
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop';

const INPUT_STYLES =
  'mt-1.5 block w-full rounded-xl border border-sand-dark bg-white px-4 py-3 text-sm text-charcoal outline-none transition-all duration-200 placeholder:text-charcoal/35 focus:border-gold focus:ring-2 focus:ring-gold/30';

export default function Login() {
  const [email, setEmail] = useState(localStorage.getItem('gt_remember_email') || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(Boolean(localStorage.getItem('gt_remember_email')));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.login(email.trim(), password);
      if (res.data && res.data.access_token) {
        if (remember) localStorage.setItem('gt_remember_email', email.trim());
        else localStorage.removeItem('gt_remember_email');
        localStorage.setItem('access_token', res.data.access_token);
        navigate('/dashboard');
      }
    } catch (err) {
      const data = err?.response?.data;
      let message = data?.message || 'Login failed. Please try again.';
      if (data?.errors) {
        const first = Object.values(data.errors)[0];
        if (Array.isArray(first) && first[0]) message = first[0];
      }
      if (!err.response) message = 'Cannot reach the server. Please check your connection.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-cream">
      {/* Left visual panel */}
      <div className="relative hidden w-[45%] lg:block">
        <img
          src={LOGIN_IMAGE}
          alt="Scenic mountain road"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/40" />
        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-3 self-start text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-sm">
              <Globe className="h-5 w-5" strokeWidth={1.5} />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-xl font-semibold tracking-wide">GlobeTrotter</span>
              <span className="block text-[10px] uppercase tracking-[0.3em] text-white/70">
                Plan · Explore · Experience
              </span>
            </span>
          </Link>
          <blockquote>
            <p className="max-w-md font-display text-3xl leading-snug font-medium text-white">
              The world is a book, and those who do not travel read only one page.
            </p>
            <footer className="mt-4 text-xs font-medium uppercase tracking-[0.25em] text-white/70">
              — Saint Augustine
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex w-full items-center justify-center px-6 py-12 sm:px-10 lg:w-[55%]">
        <div className="w-full max-w-md">
          {/* Mobile brand */}
          <Link to="/" className="mb-10 flex items-center gap-3 text-charcoal lg:hidden">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-pine text-white">
              <Globe className="h-5 w-5" strokeWidth={1.5} />
            </span>
            <span className="font-display text-xl font-semibold">GlobeTrotter</span>
          </Link>

          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">Welcome Back</p>
          <h1 className="mt-3 font-display text-4xl font-medium text-charcoal sm:text-5xl">
            Sign in to your <em className="italic text-pine">journey.</em>
          </h1>
          <p className="mt-4 text-sm font-light text-charcoal/60">
            Your next adventure is already waiting for you.
          </p>

          {error && (
            <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-8 space-y-5" noValidate>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className={INPUT_STYLES}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className={`${INPUT_STYLES} pr-12`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 mt-0.5 -translate-y-1/2 p-1 text-charcoal/40 transition-colors hover:text-charcoal"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" strokeWidth={1.5} /> : <Eye className="h-4.5 w-4.5" strokeWidth={1.5} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-charcoal/70 select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-sand-dark accent-gold"
                />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-sm font-medium text-pine transition-colors hover:text-gold">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-full bg-gold px-8 py-3.5 text-sm font-semibold text-charcoal shadow-lg shadow-gold/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-light hover:shadow-xl disabled:pointer-events-none disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                  Signing in...
                </>
              ) : (
                <>
                  Login
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-charcoal/60">
            New here?{' '}
            <Link to="/register" className="font-semibold text-pine transition-colors hover:text-gold">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
