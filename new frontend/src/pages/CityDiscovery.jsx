import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Compass, IndianRupee, Utensils, Star, ArrowLeft } from 'lucide-react';
import { recommendationsApi } from '../api';
import AuthenticatedNav from '../components/AuthenticatedNav';
import { resolveCityImage } from '../utils/imageResolver';

export default function CityDiscovery() {
  const { cityId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    recommendationsApi.getCityBundle(cityId)
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load city data');
        setLoading(false);
      });
  }, [cityId]);

  if (loading) return <div className="min-h-screen bg-sand/20 flex items-center justify-center font-display text-2xl text-charcoal/50">Loading destination...</div>;
  if (error || !data) return <div className="min-h-screen bg-sand/20 flex items-center justify-center font-display text-2xl text-red-500">{error || 'City not found'}</div>;

  const { city, places, restaurants, budget_estimates } = data;
  const cityName = city.city;
  const cityImage = resolveCityImage(cityName);

  const mustVisitPlaces = places.filter(p => p.must_visit);
  const otherPlaces = places.filter(p => !p.must_visit);

  return (
    <div className="min-h-screen bg-sand/20 flex flex-col">
      <AuthenticatedNav />

      {/* Hero Header */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 bg-charcoal">
        <div className="absolute inset-0">
          <img 
            src={cityImage} 
            alt={cityName} 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10 text-center">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-gold-light hover:text-gold transition-colors mb-6 text-sm font-semibold tracking-wide uppercase">
            <ArrowLeft className="w-4 h-4" /> Back to Explore
          </Link>

          <h1 className="font-display text-5xl sm:text-7xl font-bold text-white mb-4">
            {cityName}
          </h1>
          <p className="text-xl text-white/80 font-medium mb-10 flex items-center justify-center gap-2">
            <MapPin className="w-5 h-5 text-gold" />
            {city.state}
          </p>
          
          <Link 
            to={`/trips/create?city_id=${city.id}`} 
            className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 text-base font-bold text-charcoal shadow-xl shadow-black/20 hover:-translate-y-0.5 hover:bg-gold-light transition-all"
          >
            <Compass className="w-5 h-5" />
            Plan a Trip Here
          </Link>
        </div>
      </section>

      <main className="flex-grow mx-auto max-w-7xl px-6 lg:px-10 py-16 space-y-20 w-full">
        
        {/* Budget Reference */}
        {budget_estimates && (
          <section className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl shadow-charcoal/5 border border-charcoal/5">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-sand/50 rounded-full flex items-center justify-center">
                <IndianRupee className="w-6 h-6 text-charcoal" />
              </div>
              <h2 className="font-display text-3xl font-bold text-charcoal">Travel Costs</h2>
            </div>
            
            <div className="flex flex-col lg:flex-row justify-between gap-10">
              <div className="lg:w-1/3">
                <p className="text-charcoal/60 font-medium mb-2 uppercase tracking-widest text-sm">Estimated Daily Average</p>
                <div className="text-5xl font-display font-bold text-charcoal mb-4">
                  ₹{budget_estimates.total_per_day.toLocaleString()}
                </div>
                <div className="inline-block bg-sand/50 border border-charcoal/10 text-charcoal px-4 py-1.5 rounded-full text-sm font-bold capitalize">
                  {budget_estimates.tier} Style
                </div>
              </div>
              
              <div className="lg:w-2/3 grid grid-cols-2 gap-4">
                <div className="bg-sand/20 p-5 rounded-2xl border border-charcoal/5">
                  <p className="text-charcoal/50 text-xs font-bold uppercase tracking-widest mb-1">Accommodation</p>
                  <p className="text-xl font-bold text-charcoal">₹{budget_estimates.accommodation_per_day}</p>
                </div>
                <div className="bg-sand/20 p-5 rounded-2xl border border-charcoal/5">
                  <p className="text-charcoal/50 text-xs font-bold uppercase tracking-widest mb-1">Food</p>
                  <p className="text-xl font-bold text-charcoal">₹{budget_estimates.food_per_day}</p>
                </div>
                <div className="bg-sand/20 p-5 rounded-2xl border border-charcoal/5">
                  <p className="text-charcoal/50 text-xs font-bold uppercase tracking-widest mb-1">Transport</p>
                  <p className="text-xl font-bold text-charcoal">₹{budget_estimates.local_transport_per_day}</p>
                </div>
                <div className="bg-sand/20 p-5 rounded-2xl border border-charcoal/5">
                  <p className="text-charcoal/50 text-xs font-bold uppercase tracking-widest mb-1">Activities</p>
                  <p className="text-xl font-bold text-charcoal">₹{budget_estimates.activities_per_day}</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Must Visit Places */}
        {mustVisitPlaces.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-gold-dark" fill="currentColor" />
              </div>
              <h2 className="font-display text-3xl font-bold text-charcoal">Must-Visit Places</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mustVisitPlaces.map(place => (
                <div key={place.id} className="bg-white rounded-3xl shadow-lg shadow-charcoal/5 border border-charcoal/5 p-6 sm:p-8 flex flex-col group hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex justify-between items-start mb-4 gap-4">
                    <h3 className="font-display text-2xl font-bold text-charcoal group-hover:text-gold-dark transition-colors">{place.place_name}</h3>
                    <span className="shrink-0 bg-gold-light text-charcoal text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                      Top Pick
                    </span>
                  </div>
                  <p className="text-xs font-bold text-charcoal/50 uppercase tracking-widest mb-4">{place.sub_category}</p>
                  <p className="text-charcoal/70 text-sm leading-relaxed mb-6 flex-grow">{place.description}</p>
                  <div className="bg-sand/20 rounded-xl p-4 text-xs font-medium text-charcoal/60 space-y-2 border border-charcoal/5">
                    <div className="flex justify-between">
                      <span className="uppercase tracking-wider font-bold">Duration</span>
                      <span className="text-charcoal">{place.duration_needed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="uppercase tracking-wider font-bold">Ideal for</span>
                      <span className="text-charcoal truncate ml-4">{place.ideal_for}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recommended Places */}
        {otherPlaces.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-sand/50 rounded-full flex items-center justify-center">
                <Compass className="w-6 h-6 text-charcoal" />
              </div>
              <h2 className="font-display text-3xl font-bold text-charcoal">More to Explore</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherPlaces.map(place => (
                <div key={place.id} className="bg-white rounded-3xl shadow-md shadow-charcoal/5 border border-charcoal/5 p-6 sm:p-8 flex flex-col">
                  <h3 className="font-display text-xl font-bold text-charcoal mb-2">{place.place_name}</h3>
                  <p className="text-xs font-bold text-charcoal/40 uppercase tracking-widest mb-4">{place.sub_category}</p>
                  <p className="text-charcoal/60 text-sm leading-relaxed mb-6 flex-grow">{place.description}</p>
                  <div className="text-xs font-bold text-charcoal/50 uppercase tracking-wider">
                    ⏱ {place.duration_needed}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Where to Eat */}
        {restaurants.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-sand/50 rounded-full flex items-center justify-center">
                <Utensils className="w-6 h-6 text-charcoal" />
              </div>
              <h2 className="font-display text-3xl font-bold text-charcoal">Where to Eat</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map(rest => (
                <div key={rest.id} className="bg-white rounded-3xl shadow-md shadow-charcoal/5 border border-charcoal/5 p-6 sm:p-8 flex flex-col">
                  <h3 className="font-display text-xl font-bold text-charcoal mb-2">{rest.name}</h3>
                  <p className="text-xs font-bold text-charcoal/50 uppercase tracking-widest mb-6">
                    {rest.cuisine} &middot; {rest.category}
                  </p>
                  
                  <div className="bg-sand/30 p-4 rounded-2xl border border-charcoal/5 mb-4 relative">
                    <div className="absolute -top-3 left-4 bg-charcoal text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">Must Try</div>
                    <p className="text-sm font-bold text-charcoal mt-2">{rest.must_try_dish}</p>
                  </div>
                  
                  {rest.notes && <p className="text-xs text-charcoal/50 font-medium italic mt-auto pt-4">{rest.notes}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
        
        {places.length === 0 && restaurants.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-charcoal/5">
            <p className="text-xl text-charcoal/50 font-medium">No recommendations found for this city yet.</p>
          </div>
        )}
      </main>
    </div>
  );
}
