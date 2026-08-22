import { useMemo } from 'react';
import { Calendar, MapPin, IndianRupee, Tag, Info } from 'lucide-react';
import { resolveCityImage } from '../../utils/imageResolver';

export default function TripOverviewTab({ trip }) {
  const tripDurationDays = useMemo(() => {
    if (!trip.start_date || !trip.end_date) return null;
    const diff = Math.round((new Date(trip.end_date) - new Date(trip.start_date)) / 86400000) + 1;
    return Math.max(1, diff);
  }, [trip.start_date, trip.end_date]);

  const selectedInterests = trip.interests ? trip.interests.split(',').map(i => i.trim()).filter(Boolean) : [];

  return (
    <div className="space-y-12">
      {/* Trip Summary Details */}
      <section className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl shadow-charcoal/5 border border-charcoal/5">
        <h2 className="font-display text-3xl font-bold text-charcoal mb-8">Trip Summary</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-sand/50 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5 text-charcoal" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-charcoal/50 mb-1">Duration</p>
              <p className="font-medium text-charcoal">{tripDurationDays} Days</p>
              <p className="text-sm text-charcoal/60">{trip.start_date} to {trip.end_date}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-sand/50 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-charcoal" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-charcoal/50 mb-1">Destinations</p>
              <p className="font-medium text-charcoal">{(trip.stops || []).length} Cities</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-sand/50 flex items-center justify-center shrink-0">
              <IndianRupee className="w-5 h-5 text-charcoal" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-charcoal/50 mb-1">Budget</p>
              <p className="font-medium text-charcoal">{trip.budget_limit ? `₹${trip.budget_limit.toLocaleString()}` : 'No Limit Set'}</p>
              <p className="text-sm text-charcoal/60 capitalize">{trip.budget_tier || 'Flexible'}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-sand/50 flex items-center justify-center shrink-0">
              <Tag className="w-5 h-5 text-charcoal" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-charcoal/50 mb-1">Interests</p>
              {selectedInterests.length > 0 ? (
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedInterests.map(i => (
                    <span key={i} className="text-xs bg-charcoal/5 text-charcoal px-2 py-0.5 rounded font-medium">{i}</span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-charcoal/60">Not specified</p>
              )}
            </div>
          </div>
        </div>

        {trip.description && (
          <div className="mt-10 pt-8 border-t border-charcoal/5 flex gap-4">
            <div className="w-12 h-12 rounded-full bg-sand/50 flex items-center justify-center shrink-0">
              <Info className="w-5 h-5 text-charcoal" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-charcoal/50 mb-2">About this trip</p>
              <p className="text-charcoal/80 leading-relaxed max-w-4xl">{trip.description}</p>
            </div>
          </div>
        )}
      </section>

      {/* Destinations List */}
      <section>
        <h2 className="font-display text-3xl font-bold text-charcoal mb-8">Destinations</h2>
        
        {(!trip.stops || trip.stops.length === 0) ? (
          <div className="bg-white/50 backdrop-blur-sm border border-charcoal/5 rounded-3xl p-12 text-center shadow-sm">
             <p className="text-lg text-charcoal/60 font-medium">No destinations added yet.</p>
             <p className="text-charcoal/40 text-sm mt-2">Head to the Itinerary tab to start planning your route.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(trip.stops || []).map((stop, index) => {
              const stopDays = Math.max(1, Math.round((new Date(stop.end_date) - new Date(stop.start_date)) / 86400000) + 1);
              const cityName = stop.city?.city || 'Unknown';
              const image = resolveCityImage(cityName);
              const itemsCount = (stop.activities || []).length;

              return (
                <article key={stop.id} className="group relative overflow-hidden rounded-3xl bg-white shadow-md shadow-charcoal/5 transition-all duration-300 hover:shadow-xl hover:shadow-charcoal/10 h-72">
                  <div className="absolute inset-0">
                    <img
                      src={image}
                      alt={cityName}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-transparent" />
                  </div>

                  <div className="absolute top-4 left-4">
                    <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                      Stop {index + 1}
                    </span>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h3 className="font-display text-3xl font-bold text-white mb-2">{cityName}</h3>
                    
                    <div className="flex flex-col gap-1 text-white/80 text-sm font-medium">
                      <div className="flex justify-between items-center">
                        <span>{stop.start_date} &mdash; {stop.end_date}</span>
                        <span>{stopDays} Days</span>
                      </div>
                      <div className="mt-2 text-gold-light text-xs uppercase tracking-widest font-bold">
                        {itemsCount} Planned {itemsCount === 1 ? 'Item' : 'Items'}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
