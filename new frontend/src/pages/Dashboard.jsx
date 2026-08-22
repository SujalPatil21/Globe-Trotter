import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { tripsApi, masterApi } from '../api';
import AuthenticatedNav from '../components/AuthenticatedNav';
import DestinationCard from '../components/landing/DestinationCard';
import TripCard from '../components/TripCard';
import SectionHeading from '../components/landing/SectionHeading';
import { resolveCityImage } from '../utils/imageResolver';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [cities, setCities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllTrips, setShowAllTrips] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    tripsApi.getDashboard().then(res => setData(res)).catch(() => navigate('/login'));
  }, [navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      masterApi.getCities(searchQuery).then(res => {
        setCities(res.slice(0, 8)); // 8 destinations for a 4-col grid
      }).catch(console.error);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (!data) return <div className="min-h-screen bg-sand/20 flex items-center justify-center font-display text-2xl text-charcoal/50 tracking-wide">Loading your journey...</div>;

  return (
    <div className="min-h-screen bg-sand/20">
      <AuthenticatedNav />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 bg-charcoal">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2000&auto=format&fit=crop" 
            alt="India Landscape" 
            className="w-full h-full object-cover object-[50%_15%] opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent" />
        </div>
        
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10 text-center">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-white mb-6">
            Explore India
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10 font-medium">
            Discover places worth visiting, plan trips you'll actually remember.
          </p>
          
          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-charcoal/50 group-focus-within:text-gold transition-colors" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search destinations..."
              className="w-full pl-12 pr-4 py-4 rounded-full bg-white/95 backdrop-blur shadow-xl text-charcoal placeholder-charcoal/50 focus:outline-none focus:ring-2 focus:ring-gold transition-all text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Upcoming Trips Section */}
      <section id="trips" className="scroll-mt-20 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading
            eyebrow="Your Journeys"
            title="Upcoming Trips"
            subtitle="Your next adventures, waiting to be lived."
          />
          
          {data.upcoming_trips.length === 0 ? (
            <div className="bg-white/50 backdrop-blur-sm border border-charcoal/5 rounded-3xl p-12 text-center shadow-sm">
              <p className="text-lg text-charcoal/60 mb-6 font-medium">No upcoming trips planned yet.</p>
              <Link to="/trips/create" className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-charcoal shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-light hover:shadow-xl hover:shadow-black/20">
                Plan a New Trip
              </Link>
            </div>
          ) : (
            <div className="space-y-6 max-w-4xl">
              {(showAllTrips ? data.upcoming_trips : data.upcoming_trips.slice(0, 3)).map(trip => (
                <TripCard key={trip.id} trip={trip} />
              ))}
              
              {data.upcoming_trips.length > 3 && (
                <div className="pt-6 text-center">
                  <button 
                    onClick={() => setShowAllTrips(!showAllTrips)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-charcoal border border-charcoal/20 px-6 py-2.5 rounded-full hover:bg-white transition-colors shadow-sm"
                  >
                    {showAllTrips ? 'Show Less' : `View All ${data.upcoming_trips.length} Trips`}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Explore Destinations Section */}
      <section className="bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading
            eyebrow="Destinations"
            title="Where will you go next?"
            subtitle={searchQuery ? `Search results for "${searchQuery}"` : "Popular destinations to inspire your next journey."}
          />
          
          {cities.length === 0 ? (
             <div className="text-center p-12 bg-sand/30 rounded-3xl text-charcoal/50 font-medium">
               No destinations found matching your search.
             </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {cities.map(city => (
                <Link to={`/cities/${city.id}`} key={city.id} className="block group">
                  <DestinationCard 
                    name={city.city} 
                    country={city.state} 
                    metadata="Explore" 
                    image={resolveCityImage(city.city, city.state)} 
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Small Community Preview CTA */}
      <section className="bg-charcoal text-white py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 text-center">
           <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">Travel with the Community</h2>
           <p className="text-white/70 max-w-2xl mx-auto mb-10 text-lg">
             Discover experiences shared by other travelers. Get inspired by their itineraries, tips, and hidden gems.
           </p>
           <Link to="/community" className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 text-base font-semibold text-charcoal shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-light hover:shadow-xl hover:shadow-black/25">
             Explore Community Experiences
           </Link>
        </div>
      </section>
    </div>
  );
}
