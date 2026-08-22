import { FALLBACK_IMAGE } from '../../utils/imageResolver';

export default function DestinationCard({ name, country, metadata, image }) {
  return (
    <article className="group relative overflow-hidden rounded-3xl shadow-md shadow-charcoal/10">
      <div className="aspect-[3/4] overflow-hidden">
        <img
          src={image || FALLBACK_IMAGE}
          alt={`${name}, ${country}`}
          loading="lazy"
          className={`h-full w-full transition-transform duration-700 ease-out group-hover:scale-110 ${
            name === 'Agra' ? 'object-contain bg-black/5' : 'object-cover object-center'
          }`}
          onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE; }}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

      {/* Gold corner accent on hover */}
      <span className="absolute right-5 top-5 h-10 w-10 rounded-full border border-white/0 bg-gold/0 backdrop-blur-none transition-all duration-300 group-hover:border-white/40 group-hover:bg-black/20" />

      <div className="absolute inset-x-0 bottom-0 p-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gold-light">{country}</p>
        <h3 className="mt-1 font-display text-2xl font-medium text-white sm:text-3xl">{name}</h3>
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-xs font-medium tracking-wide text-white/70">{metadata}</p>
          <span
            aria-label={`Explore ${name}`}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 text-white transition-all duration-300 hover:border-gold hover:bg-gold cursor-pointer"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-45"
            >
              <path d="M7 17L17 7M17 7H8M17 7v9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </article>
  );
}
