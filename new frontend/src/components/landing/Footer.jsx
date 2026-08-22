import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';

const SOCIAL_ICONS = [
  {
    label: 'Instagram',
    path: 'M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5a4.25 4.25 0 0 0 4.25 4.25h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5a4.25 4.25 0 0 0-4.25-4.25h-8.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm5.25-2.75a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z',
  },
  {
    label: 'X',
    path: 'M17.53 3H21l-7.6 8.68L22.5 21h-6.98l-5.47-6.41L3.8 21H.32l8.13-9.28L-.5 3h7.16l4.94 5.86L17.53 3Zm-1.22 16h1.93L6.62 4.92H4.54L16.31 19Z',
  },
  {
    label: 'Facebook',
    path: 'M13.5 21v-7h2.37l.63-3h-3V9c0-.87.28-1.5 1.62-1.5H16.6V4.14c-.3-.04-1.3-.14-2.46-.14-2.44 0-4.14 1.49-4.14 4.23V11H7.5v3h2.5v7h3.5Z',
  },
];

const FOOTER_LINKS = {
  Explore: [
    { label: 'Destinations', href: '/#destinations' },
    { label: 'Experiences', href: '/#experiences' },
    { label: 'Discover', href: '/explore' },
  ],
  Company: [
    { label: 'About', href: '/#about' },
    { label: 'My Trips', href: '/trips' },
    { label: 'Login', href: '/login' },
  ],
};

export default function Footer() {
  return (
    <footer id="about" className="bg-charcoal text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr] lg:gap-20">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5">
                <Globe className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <span className="leading-tight">
                <span className="block font-display text-xl font-semibold">GlobeTrotter</span>
                <span className="block text-[10px] uppercase tracking-[0.3em] text-white/50">
                  Plan · Explore · Experience
                </span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm font-light leading-relaxed text-white/60">
              Personalized travel planning for people who believe the journey matters as much as the
              destination. Organize every detail of your next adventure in one place.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">{heading}</h4>
              <ul className="mt-5 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm font-light text-white/65 transition-colors hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs font-light text-white/45">
            &copy; {new Date().getFullYear()} GlobeTrotter. Crafted for explorers.
          </p>
          <div className="flex gap-4">
            {SOCIAL_ICONS.map((social) => (
              <a
                key={social.label}
                href="#about"
                aria-label={social.label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/60 transition-all duration-300 hover:border-gold hover:text-gold"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                  <path d={social.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
