import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import SectionHeading from '../components/landing/SectionHeading';
import DestinationCard from '../components/landing/DestinationCard';
import ExperienceCard from '../components/landing/ExperienceCard';
import Footer from '../components/landing/Footer';
import { DESTINATIONS } from '../data/destinations';

const img = (id) => `https://images.unsplash.com/${id}?q=80&w=1200&auto=format&fit=crop`;

const EXPERIENCES = [
  {
    title: 'Adventure',
    description: 'Trek mountain trails, dive into wild waters, and chase horizons.',
    image: img('photo-1551632811-561732d1e306'),
  },
  {
    title: 'Food & Culture',
    description: 'Taste local kitchens and live traditions, one table at a time.',
    image: img('photo-1414235077428-338989a2e8c0'),
  },
  {
    title: 'Nature',
    description: 'Breathe in landscapes that reset the soul and quiet the mind.',
    image: img('photo-1470071459604-3b5ec3a7fe05'),
  },
  {
    title: 'Relaxation',
    description: 'Slow mornings, warm sunsets, and time that finally feels yours.',
    image: img('photo-1540541338287-41700207dee6'),
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />

      {/* Destinations */}
      <section id="destinations" className="scroll-mt-20 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading
            eyebrow="Handpicked for you"
            title="Where will you go next?"
            subtitle="Discover destinations worth remembering."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {DESTINATIONS.map((destination) => (
              <DestinationCard key={destination.name} {...destination} />
            ))}
          </div>
        </div>
      </section>

      {/* Experiences */}
      <section id="experiences" className="bg-sand/40 scroll-mt-20 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading
            eyebrow="Curated journeys"
            title="Make the journey memorable"
            subtitle="Every trip has a rhythm. Choose the experiences that make yours unforgettable."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {EXPERIENCES.map((experience) => (
              <ExperienceCard key={experience.title} {...experience} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
