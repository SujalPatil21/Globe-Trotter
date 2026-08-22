import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';

const NAV_LINKS = [
  { label: 'About Us', href: '/#about' },
];

const BUTTON_STYLES =
  'rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-charcoal shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-light hover:shadow-xl hover:shadow-black/25';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        {/* Brand */}
        <Link to="/" className="group flex items-center gap-3 text-white" onClick={() => setOpen(false)}>
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-sm transition-colors group-hover:bg-white/20">
            <Globe className="h-5 w-5" strokeWidth={1.5} />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-xl font-semibold tracking-wide">GlobeTrotter</span>
            <span className="block text-[10px] uppercase tracking-[0.3em] text-white/70">Plan · Explore · Experience</span>
          </span>
        </Link>

        {/* Right actions */}
        <div className="hidden items-center gap-4 lg:flex">
          <a href="/#about" className={BUTTON_STYLES}>
            About Us
          </a>
          <Link to="/login" className={BUTTON_STYLES}>
            Login
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 lg:hidden"
        >
          {open ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden bg-charcoal/95 backdrop-blur-md transition-all duration-300 lg:hidden ${
          open ? 'max-h-96 border-b border-white/10' : 'max-h-0'
        }`}
      >
        <ul className="space-y-3 px-6 py-4">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block px-4 py-2.5 text-center text-sm font-semibold text-charcoal ${BUTTON_STYLES}`}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className={`block text-center ${BUTTON_STYLES}`}
            >
              Login
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
