import { Link } from 'react-router-dom';
import { ArrowRight, Plane, MapPin, ChevronDown } from 'lucide-react';

import HERO_IMAGE from '../../../image/landing page image.jpeg';

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={HERO_IMAGE}
          alt="Lakeside town surrounded by mountains"
          className="h-full w-full object-cover object-center animate-fade-in"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Decorative flight route */}
      <svg
        aria-hidden="true"
        viewBox="0 0 600 200"
        className="pointer-events-none absolute right-[8%] top-[22%] hidden w-[480px] opacity-50 lg:block"
      >
        <path
          d="M20 170 C 180 150, 300 90, 420 60 S 560 30, 580 24"
          fill="none"
          stroke="white"
          strokeOpacity="0.5"
          strokeWidth="1.5"
          strokeDasharray="6 8"
        />
        <circle cx="420" cy="60" r="4" fill="#b08d57" />
        <circle cx="580" cy="24" r="4" fill="white" />
        <g transform="translate(20 170) rotate(-12)">
          <Plane className="h-5 w-5 -translate-x-2.5 -translate-y-2.5 text-white/80" strokeWidth={1.5} />
        </g>
      </svg>

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-center px-6 pb-16 pt-36 sm:pb-20 lg:px-10">
        <div className="max-w-2xl">
          <p className="animate-fade-up mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-white/80 [animation-delay:100ms]">
            <MapPin className="h-4 w-4 text-gold" strokeWidth={1.5} />
            Your Journey Starts Here
          </p>

          <h1 className="animate-fade-up font-display text-5xl leading-[1.05] font-medium text-white [animation-delay:250ms] sm:text-7xl lg:text-8xl">
            Explore
            <br />
            <em className="font-display italic text-gold-light">the world.</em>
          </h1>

          <p className="animate-fade-up mt-7 max-w-xl text-base font-light leading-relaxed text-white/85 [animation-delay:400ms] sm:text-lg">
            Plan unforgettable journeys, discover incredible destinations, and organize every detail
            in one place.
          </p>

          <div className="animate-fade-up mt-10 flex flex-wrap items-center gap-5 [animation-delay:550ms]">
            <Link
              to="/login"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-charcoal shadow-xl shadow-black/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-cream hover:shadow-2xl"
            >
              Plan Your Trip
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} />
            </Link>
            <a
              href="#destinations"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-8 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition-all duration-300 hover:border-white hover:bg-white/10"
            >
              Explore Destinations
            </a>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="relative z-10 mb-8 flex justify-center">
        <div className="hidden flex-col items-center gap-2 text-white/75 md:flex">
          <span className="text-[10px] font-medium uppercase tracking-[0.3em]">Scroll to explore</span>
          <ChevronDown className="h-5 w-5 animate-scroll-hint" strokeWidth={1.5} />
        </div>
      </div>
    </section>
  );
}
