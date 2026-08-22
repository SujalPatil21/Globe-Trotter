import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Globe, Calendar, MapPin } from 'lucide-react';
import { tripsApi } from '../api';
import { resolveCityImage } from '../utils/imageResolver';

export default function PublicTrip() {
  const { shareId } = useParams();
  const [trip, setTrip] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    tripsApi.getPublicTrip(shareId)
      .then(res => setTrip(res))
      .catch(() => setError(true));
  }, [shareId]);

  if (error) return (
    <div className="min-h-screen bg-sand/20 flex flex-col items-center justify-center p-6 text-center">
      <Globe className="w-16 h-16 text-charcoal/20 mb-4" />
      <h1 className="font-display text-3xl font-bold text-charcoal mb-2">Trip Not Found</h1>
      <p className="text-charcoal/60 font-medium max-w-md">The trip you are looking for doesn't exist or is no longer public.</p>
      <Link to="/" className="mt-8 bg-gold px-6 py-3 rounded-full font-bold text-charcoal hover:bg-gold-light transition-colors">Go to Homepage</Link>
    </div>
  );
  
  if (!trip) return <div className="min-h-screen bg-sand/20 flex items-center justify-center font-display text-2xl text-charcoal/50">Loading shared trip...</div>;

  const duration = Math.max(1, Math.round((new Date(trip.end_date) - new Date(trip.start_date)) / 86400000) + 1);
  const uniqueCities = trip.stops ? [...new Set(trip.stops.map(s => s.city?.city).filter(Boolean))] : [];
  const firstCity = uniqueCities.length > 0 ? uniqueCities[0] : null;
  const coverImage = trip.cover_image || resolveCityImage(firstCity);

  return (
    <div className="min-h-screen bg-sand/20 flex flex-col">
      {/* Simple Public Nav */}
      <nav className="absolute top-0 inset-x-0 z-30 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 text-white group">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-charcoal/50 backdrop-blur-sm transition-colors group-hover:bg-charcoal/70">
              <Globe className="h-5 w-5" strokeWidth={1.5} />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-xl font-semibold tracking-wide">GlobeTrotter</span>
            </span>
          </Link>
          <Link to="/login" className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-5 py-2 rounded-full font-bold transition-colors border border-white/20 text-sm">
            Sign In to Plan
          </Link>
        </div>
      </nav>

      {/* Hero Header */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 bg-charcoal">
        <div className="absolute inset-0">
          <img 
            src={coverImage} 
            alt={trip.name} 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-4xl px-6 lg:px-10 text-center">
          <span className="inline-block bg-white/20 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-white/20 mb-6">
            Public Trip Itinerary
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-white mb-6">
            {trip.name}
          </h1>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-white/90 text-sm font-bold uppercase tracking-wider mb-8">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gold" />
              {trip.start_date} &mdash; {trip.end_date} ({duration} Days)
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gold" />
              {uniqueCities.length} {uniqueCities.length === 1 ? 'Destination' : 'Destinations'}
            </span>
          </div>

          {trip.description && (
            <p className="text-lg text-white/80 font-medium max-w-2xl mx-auto leading-relaxed">
              {trip.description}
            </p>
          )}
        </div>
      </section>

      <main className="flex-grow mx-auto max-w-4xl px-6 lg:px-10 py-16 w-full text-center">
        <h2 className="font-display text-3xl font-bold text-charcoal mb-8">Itinerary Preview</h2>
        
        {trip.stops && trip.stops.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
            {trip.stops.map((stop, index) => (
              <div key={stop.id} className="bg-white p-6 rounded-3xl shadow-md shadow-charcoal/5 border border-charcoal/5">
                <div className="text-gold-dark font-bold text-xs uppercase tracking-widest mb-1">Stop {index + 1}</div>
                <h3 className="font-display text-2xl font-bold text-charcoal mb-2">
                  {stop.city?.city || 'Unknown'}
                </h3>
                <p className="text-sm font-medium text-charcoal/50 mb-4">{stop.start_date} to {stop.end_date}</p>
                
                <div className="space-y-3">
                  {(stop.activities || []).map(act => (
                    <div key={act.id} className="bg-sand/30 p-3 rounded-xl border border-charcoal/5">
                      <p className="font-bold text-charcoal text-sm">{act.custom_place_name || act.activity?.name}</p>
                      {act.start_time && <p className="text-xs text-charcoal/50 font-semibold">{act.start_time.substring(0,5)}</p>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-3xl shadow-sm border border-charcoal/5">
            <p className="text-charcoal/50 font-medium">This shared trip doesn't have a detailed itinerary yet.</p>
          </div>
        )}

        <div className="mt-20 pt-10 border-t border-charcoal/10">
          <h2 className="font-display text-3xl font-bold text-charcoal mb-4">Start your own journey</h2>
          <p className="text-charcoal/60 font-medium mb-8">Join GlobeTrotter to plan trips, track budgets, and explore the world.</p>
          <Link to="/register" className="inline-block bg-charcoal text-white px-10 py-4 rounded-full font-bold shadow-xl shadow-black/10 hover:-translate-y-1 transition-transform">
            Create Free Account
          </Link>
        </div>
      </main>
    </div>
  );
}
