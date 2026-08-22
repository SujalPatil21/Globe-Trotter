import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ArrowRight, Globe, Loader2 } from 'lucide-react';
import { authApi } from '../api';

const LOGIN_IMAGE =
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop';

const INPUT_STYLES =
  'mt-1.5 block w-full rounded-xl border border-sand-dark bg-white px-4 py-3 text-sm text-charcoal outline-none transition-all duration-200 placeholder:text-charcoal/35 focus:border-gold focus:ring-2 focus:ring-gold/30';

export default function VerifyOTP() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const purpose = searchParams.get('purpose');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.verifyOtp(email, purpose, otp);
      if (purpose === 'REGISTRATION') {
        alert("Verification successful! You can now login.");
        navigate('/login');
      } else if (purpose === 'LOGIN') {
        localStorage.setItem('access_token', res.data.access_token);
        navigate('/dashboard');
      } else if (purpose === 'PASSWORD_RESET') {
        navigate(`/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`);
      }
    } catch (err) {
      setError("Invalid or expired OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await authApi.resendOtp(email, purpose);
      alert("A new OTP has been sent to your email.");
    } catch (err) {
      alert("Failed to resend OTP. Please wait 45 seconds and try again.");
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

          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">Join the Journey</p>
          <h1 className="mt-3 font-display text-4xl font-medium text-charcoal sm:text-5xl">
            Verify your <em className="italic text-pine">account.</em>
          </h1>
          <p className="mt-4 text-sm font-light text-charcoal/60">
            We've sent a 6-digit verification code to <br/>
            <strong className="font-semibold text-charcoal">{email}</strong>
          </p>

          {error && (
            <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleVerify} className="mt-8 space-y-5" noValidate>
            <div>
              <label htmlFor="otp" className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60">
                Security Code
              </label>
              <input
                id="otp"
                type="text"
                autoComplete="one-time-code"
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                className={`${INPUT_STYLES} text-center tracking-widest text-2xl py-4`}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className="group flex w-full items-center justify-center gap-2 rounded-full bg-gold px-8 py-3.5 text-sm font-semibold text-charcoal shadow-lg shadow-gold/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-light hover:shadow-xl disabled:pointer-events-none disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                  Verifying...
                </>
              ) : (
                <>
                  Verify Code
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 text-sm text-charcoal/60">
            <button onClick={handleResend} className="font-semibold text-pine transition-colors hover:text-gold">
              Resend OTP
            </button>
            <Link to="/login" className="font-semibold text-charcoal/40 transition-colors hover:text-charcoal">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
