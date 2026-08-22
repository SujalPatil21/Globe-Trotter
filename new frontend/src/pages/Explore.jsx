import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SectionHeading from '../components/landing/SectionHeading';
import DestinationCard from '../components/landing/DestinationCard';
import { DESTINATIONS } from '../data/destinations';

export default function Explore() {
  return (
    <div className="min-h-screen bg-cream">
      <header className="mx-auto flex max-w-7xl items-center px-6 pt-8 lg:px-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-charcoal/60 transition-colors hover:text-charcoal"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          Back to Home
        </Link>
      </header>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading
            eyebrow="Discover"
            title="Explore Destinations"
            subtitle="A curated collection of places worth adding to your list."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {DESTINATIONS.map((destination) => (
              <DestinationCard key={destination.name} {...destination} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
