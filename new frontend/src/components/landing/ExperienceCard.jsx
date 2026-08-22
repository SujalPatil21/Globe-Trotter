export default function ExperienceCard({ title, description, image }) {
  return (
    <article className="group relative overflow-hidden rounded-3xl shadow-lg shadow-charcoal/10">
      <div className="aspect-[4/3] overflow-hidden sm:aspect-[3/4] lg:aspect-[4/5]">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-6">
        <h3 className="font-display text-xl font-medium text-white sm:text-2xl">{title}</h3>
        <p className="mt-2 max-w-xs text-sm font-light leading-relaxed text-white/0 opacity-0 transition-all duration-500 group-hover:text-white/85 group-hover:opacity-100">
          {description}
        </p>
      </div>
    </article>
  );
}
