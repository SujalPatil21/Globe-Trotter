import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Globe, Loader2 } from 'lucide-react';
import { authApi } from '../api';

const REGISTER_IMAGE =
  'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2000&auto=format&fit=crop';

const INPUT_STYLES =
  'mt-1.5 block w-full rounded-xl border border-sand-dark bg-white px-4 py-3 text-sm text-charcoal outline-none transition-all duration-200 placeholder:text-charcoal/35 focus:border-gold focus:ring-2 focus:ring-gold/30';

const PASSWORD_RULES = [
  { test: (p) => p.length >= 8, label: '8+ characters' },
  { test: (p) => /[A-Z]/.test(p), label: 'Uppercase' },
  { test: (p) => /[a-z]/.test(p), label: 'Lowercase' },
  { test: (p) => /\d/.test(p), label: 'Number' },
  { test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p), label: 'Special character' },
];

function PasswordField({ id, label, value, onChange, show, onToggle, hint }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="Enter your password"
          className={`${INPUT_STYLES} pr-12`}
          value={value}
          onChange={onChange}
          required
        />
        <button
          type="button"
          aria-label={show ? 'Hide password' : 'Show password'}
          onClick={onToggle}
          className="absolute top-1/2 right-3 mt-0.5 -translate-y-1/2 p-1 text-charcoal/40 transition-colors hover:text-charcoal"
        >
          {show ? <EyeOff className="h-4.5 w-4.5" strokeWidth={1.5} /> : <Eye className="h-4.5 w-4.5" strokeWidth={1.5} />}
        </button>
      </div>
      {hint && (
        <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
          {PASSWORD_RULES.map((rule) => (
            <li
              key={rule.label}
              className={`text-[11px] font-medium ${rule.test(value) ? 'text-pine' : 'text-charcoal/35'}`}
            >
              {rule.test(value) ? '\u2713' : '\u25CB'} {rule.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirm_password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const updateField = (key) => (e) => setFormData({ ...formData, [key]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.register(
        formData.username.trim(),
        formData.email.trim(),
        formData.password,
        formData.confirm_password
      );

      if (res.success && res.message && res.message.includes("already exists but hasn't been verified")) {
        setInfo(res.message);
      }

      navigate(`/verify-otp?email=${encodeURIComponent(formData.email.trim())}&purpose=REGISTRATION`);
    } catch (err) {
      const data = err?.response?.data;
      let message = data?.message || 'Registration failed. Please try again.';
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
          src={REGISTER_IMAGE}
          alt="Hikers on a mountain trail"
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
              Every great journey begins with a single step. Take yours today.
            </p>
            <footer className="mt-4 text-xs font-medium uppercase tracking-[0.25em] text-white/70">
              Start your story
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

          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">Join The Journey</p>
          <h1 className="mt-3 font-display text-4xl font-medium text-charcoal sm:text-5xl">
            Create your <em className="italic text-pine">account.</em>
          </h1>
          <p className="mt-4 text-sm font-light text-charcoal/60">
            One account for every trip you will ever plan.
          </p>

          {error && (
            <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}
          {info && (
            <div role="status" className="mt-6 rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm font-medium text-charcoal">
              {info}
            </div>
          )}

          <form onSubmit={handleRegister} className="mt-8 space-y-5" noValidate>
            <div>
              <label htmlFor="username" className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60">
                Username
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                placeholder="e.g. wanderer_99"
                pattern="[A-Za-z0-9_]+"
                minLength={3}
                maxLength={30}
                title="Only letters, numbers and underscores allowed"
                className={INPUT_STYLES}
                value={formData.username}
                onChange={updateField('username')}
                required
              />
            </div>

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
                value={formData.email}
                onChange={updateField('email')}
                required
              />
            </div>

            <PasswordField
              id="password"
              label="Password"
              value={formData.password}
              onChange={updateField('password')}
              show={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
              hint
            />

            <PasswordField
              id="confirm_password"
              label="Confirm Password"
              value={formData.confirm_password}
              onChange={updateField('confirm_password')}
              show={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
            />

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-full bg-gold px-8 py-3.5 text-sm font-semibold text-charcoal shadow-lg shadow-gold/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-light hover:shadow-xl disabled:pointer-events-none disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} />
                </>
              )}
            </button>

            <p className="text-center text-[11px] font-light leading-relaxed text-charcoal/45">
              We&apos;ll send a 6-digit verification code to your email to activate your account.
            </p>
          </form>

          <p className="mt-8 text-center text-sm text-charcoal/60">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-pine transition-colors hover:text-gold">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
