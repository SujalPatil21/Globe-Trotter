export default function SectionHeading({ eyebrow, title, subtitle, align = 'center', dark = false }) {
  const alignment = align === 'left' ? 'items-start text-left' : 'items-center text-center';

  return (
    <div className={`mb-12 flex flex-col ${alignment}`}>
      {eyebrow && (
        <p className={`mb-4 text-xs font-semibold uppercase tracking-[0.35em] ${dark ? 'text-gold-light' : 'text-gold'}`}>
          {eyebrow}
        </p>
      )}
      <h2 className={`font-display text-3xl font-medium sm:text-4xl lg:text-5xl ${dark ? 'text-white' : 'text-charcoal'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 max-w-xl text-base font-light ${dark ? 'text-white/70' : 'text-charcoal/60'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
