import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Globe, Loader2, Mail } from 'lucide-react';
import { authApi } from '../api';

const LOGIN_IMAGE =
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop';

const INPUT_STYLES =
  'mt-1.5 block w-full rounded-xl border border-sand-dark bg-white px-4 py-3 text-sm text-charcoal outline-none transition-all duration-200 placeholder:text-charcoal/35 focus:border-gold focus:ring-2 focus:ring-gold/30';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleForgot = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      navigate(`/verify-otp?email=${encodeURIComponent(email)}&purpose=PASSWORD_RESET`);
    } catch (err) {
      // Show error, or generic message for security
      setError("If the email exists, a reset code has been sent.");
      // Still navigate for UX if needed, or stay on page. 
      // The original code navigated on success but alerted on error. 
      // Let's just proceed to verify-otp even on error so we don't leak user existence?
      // Wait, original code: alert("If the email exists, a reset code has been sent.") and did NOT navigate.
      // Let's keep the original logic but make it a nice inline message.
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

          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">Reset Password</p>
          <h1 className="mt-3 font-display text-4xl font-medium text-charcoal sm:text-5xl">
            Recover your <em className="italic text-pine">account.</em>
          </h1>
          <p className="mt-4 text-sm font-light text-charcoal/60">
            Enter your email address and we'll send you an OTP to reset your password.
          </p>

          {error && (
            <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleForgot} className="mt-8 space-y-5" noValidate>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={`${INPUT_STYLES} pl-10`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4.5 w-4.5 text-charcoal/40" strokeWidth={1.5} />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              className="group flex w-full items-center justify-center gap-2 rounded-full bg-gold px-8 py-3.5 text-sm font-semibold text-charcoal shadow-lg shadow-gold/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-light hover:shadow-xl disabled:pointer-events-none disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                  Sending...
                </>
              ) : (
                <>
                  Send Reset Code
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-charcoal/60">
            Remembered your password?{' '}
            <Link to="/login" className="font-semibold text-pine transition-colors hover:text-gold">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
