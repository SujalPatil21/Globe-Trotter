import { Link } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';
import { resolveCityImage, FALLBACK_IMAGE } from '../utils/imageResolver';

export default function TripCard({ trip }) {
  const duration = Math.max(1, Math.round((new Date(trip.end_date) - new Date(trip.start_date)) / 86400000) + 1);
  const uniqueStops = trip.stops ? [...new Set(trip.stops.map(s => s.city?.city).filter(Boolean))] : [];
  const firstCity = uniqueStops.length > 0 ? uniqueStops[0] : null;
  const firstState = trip.stops?.find(s => s.city?.city === firstCity)?.city?.state || null;
  const coverImage = trip.cover_image || resolveCityImage(firstCity, firstState);

  return (
    <article className="group relative overflow-hidden rounded-3xl bg-white shadow-md shadow-charcoal/5 transition-all duration-300 hover:shadow-xl hover:shadow-charcoal/10 flex flex-col sm:flex-row h-full sm:h-48">
      {/* Image Section */}
      <div className="sm:w-2/5 overflow-hidden relative">
        <img
          src={coverImage}
          alt={trip.name}
          className={`h-48 sm:h-full w-full transition-transform duration-700 ease-out group-hover:scale-105 ${
            coverImage.includes('Taj Mahal') ? 'object-contain bg-black/5' : 'object-cover object-center'
          }`}
          onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-black/10" />
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col justify-between sm:w-3/5 flex-grow">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-display text-xl sm:text-2xl font-semibold text-charcoal">{trip.name}</h3>
            {/* Status pill could go here if added */}
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-charcoal/70 mb-4">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gold-light" />
              <span>{trip.start_date} &mdash; {trip.end_date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-gold-light" />
              <span>{duration} days</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end mt-4 sm:mt-0">
          <Link
            to={`/trips/${trip.id}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-charcoal transition-colors hover:text-gold-light"
          >
            View Trip 
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
