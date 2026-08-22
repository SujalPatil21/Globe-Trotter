import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Search, Filter, Compass, Users, MapPin } from 'lucide-react';
import { communityApi } from '../api';
import AuthenticatedNav from '../components/AuthenticatedNav';
import { resolveCityImage, FALLBACK_IMAGE } from '../utils/imageResolver';

export default function Community() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Filters
  const [filters, setFilters] = useState({
    city: '',
    duration: '',
    budget_tier: '',
    interest: '',
    sort_by: 'recommended'
  });

  const fetchFeed = async () => {
    setLoading(true);
    try {
      const activeFilters = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''));
      const data = await communityApi.getExperiences(activeFilters);
      setExperiences(data);
    } catch (err) {
      console.error('Error fetching community experiences:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, [filters]);

  const handleLikeToggle = async (exp) => {
    try {
      if (exp.is_liked_by_me) {
        await communityApi.unlikeExperience(exp.id);
        setExperiences(experiences.map(e => e.id === exp.id ? { ...e, is_liked_by_me: false, like_count: e.like_count - 1 } : e));
      } else {
        await communityApi.likeExperience(exp.id);
        setExperiences(experiences.map(e => e.id === exp.id ? { ...e, is_liked_by_me: true, like_count: e.like_count + 1 } : e));
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleUseTrip = async (expId) => {
    try {
      const res = await communityApi.copyExperience(expId);
      navigate(`/trips/${res.new_trip_id}`);
    } catch (err) {
      alert('Error copying trip.');
    }
  };

  return (
    <div className="min-h-screen bg-sand/20 flex flex-col">
      <AuthenticatedNav />

      {/* Hero Header */}
      <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-28 bg-charcoal">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=2000&auto=format&fit=crop" 
            alt="Travelers" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/70 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10 text-center">
          <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-8 h-8 text-gold-light" />
          </div>
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-white mb-4">
            Traveler Community
          </h1>
          <p className="text-xl text-white/80 font-medium max-w-2xl mx-auto">
            Get inspired by real itineraries. Clone a trip you love and make it your own.
          </p>
        </div>
      </section>

      <main className="flex-grow mx-auto max-w-7xl px-6 lg:px-10 py-12 w-full flex flex-col gap-10">
        
        {/* Horizontal Filters */}
        <div className="bg-white rounded-3xl p-6 shadow-md shadow-charcoal/5 border border-charcoal/5">
          <div className="flex flex-col md:flex-row items-center gap-4">
            
            <div className="w-full md:w-1/3 relative">
              <input 
                type="text" 
                placeholder="Search experiences..." 
                className="w-full bg-sand/30 border border-charcoal/5 rounded-full pl-12 pr-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gold transition-all"
                value={filters.city}
                onChange={e => setFilters({...filters, city: e.target.value})}
              />
              <Search className="w-5 h-5 text-charcoal/40 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>

            <div className="w-full md:w-auto flex-1 grid grid-cols-2 md:flex gap-3">
              <select 
                className="bg-sand/30 border border-charcoal/5 rounded-full px-5 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gold appearance-none md:w-40"
                value={filters.duration}
                onChange={e => setFilters({...filters, duration: e.target.value})}
              >
                <option value="">Duration</option>
                <option value="1-3 days">1-3 days</option>
                <option value="4-7 days">4-7 days</option>
                <option value="8+ days">8+ days</option>
              </select>

              <select 
                className="bg-sand/30 border border-charcoal/5 rounded-full px-5 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gold appearance-none md:w-40 capitalize"
                value={filters.budget_tier}
                onChange={e => setFilters({...filters, budget_tier: e.target.value})}
              >
                <option value="">Budget</option>
                <option value="budget">Budget</option>
                <option value="mid-range">Mid-range</option>
                <option value="luxury">Luxury</option>
              </select>

              <select 
                className="bg-sand/30 border border-charcoal/5 rounded-full px-5 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gold appearance-none md:w-40"
                value={filters.interest}
                onChange={e => setFilters({...filters, interest: e.target.value})}
              >
                <option value="">Interest</option>
                <option value="Heritage">Heritage</option>
                <option value="Nature">Nature</option>
                <option value="Adventure">Adventure</option>
                <option value="Food">Food</option>
                <option value="Religious">Religious</option>
                <option value="Shopping">Shopping</option>
              </select>

              <select 
                className="bg-sand/30 border border-charcoal/5 rounded-full px-5 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gold appearance-none md:w-40"
                value={filters.sort_by}
                onChange={e => setFilters({...filters, sort_by: e.target.value})}
              >
                <option value="recommended">Recommended</option>
                <option value="recent">Most Recent</option>
                <option value="used">Most Copied</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Feed */}
        <div className="flex-1">
          {loading ? (
            <div className="bg-white rounded-3xl p-20 text-center border border-charcoal/5">
              <div className="animate-spin w-8 h-8 border-4 border-gold border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-charcoal/50 font-medium">Curating experiences...</p>
            </div>
          ) : experiences.length === 0 ? (
            <div className="bg-white rounded-3xl p-20 text-center border border-charcoal/5">
              <Compass className="w-12 h-12 text-charcoal/20 mx-auto mb-4" />
              <h3 className="font-display text-2xl font-bold text-charcoal mb-2">No experiences found</h3>
              <p className="text-charcoal/50 font-medium">Try adjusting your filters to discover more trips.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {experiences.map(exp => {
                const trip = exp.trip;
                const duration = trip ? Math.round((new Date(trip.end_date) - new Date(trip.start_date)) / 86400000) + 1 : 0;
                const uniqueCities = trip ? [...new Set(trip.stops.map(s => s.city?.city).filter(Boolean))] : [];
                
                // Determine cover image: explicit cover > first city > fallback
                const firstCity = uniqueCities.length > 0 ? uniqueCities[0] : null;
                const coverImage = trip.cover_image || resolveCityImage(firstCity);
                
                return (
                  <article key={exp.id} className="group bg-white rounded-3xl shadow-lg shadow-charcoal/5 border border-charcoal/5 overflow-hidden flex flex-col hover:shadow-xl hover:shadow-charcoal/10 transition-all duration-300">
                    <div className="relative h-56 overflow-hidden">
                      <img 
                        src={coverImage} 
                        alt={trip?.name || "Trip"} 
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                        onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent" />
                      
                      <div className="absolute top-4 right-4 flex flex-col gap-2">
                        <button 
                          onClick={() => handleLikeToggle(exp)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-sm ${
                            exp.is_liked_by_me 
                              ? 'bg-red-500 text-white' 
                              : 'bg-white/20 text-white border border-white/30 hover:bg-white/30'
                          }`}
                        >
                          <Heart className="w-5 h-5" fill={exp.is_liked_by_me ? "currentColor" : "none"} />
                        </button>
                      </div>
                      
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                        <div className="flex gap-2">
                          <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold border border-white/20">
                            {duration} Days
                          </span>
                          {trip?.budget_tier && (
                            <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold border border-white/20 capitalize">
                              {trip.budget_tier}
                            </span>
                          )}
                        </div>
                        <span className="text-white text-xs font-bold">{exp.like_count} Likes</span>
                      </div>
                    </div>
                    
                    <div className="p-6 sm:p-8 flex flex-col flex-1">
                      <h3 className="font-display text-2xl font-bold text-charcoal mb-2 line-clamp-2">
                        {trip?.name}
                      </h3>
                      <p className="text-sm font-semibold text-gold-dark uppercase tracking-wider mb-6">
                        By{' '}
                        <Link
                          to={`/profile/${exp.publisher_username || exp.publisher_name}`}
                          className="hover:text-pine transition-colors"
                          onClick={e => e.stopPropagation()}
                        >
                          {exp.publisher_name}
                        </Link>
                      </p>
                      
                      <div className="space-y-3 text-sm text-charcoal/60 mb-8 flex-1">
                        <p className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{uniqueCities.join(', ') || 'Various Destinations'}</span>
                        </p>
                        {trip?.interests && (
                          <p className="flex items-start gap-2">
                            <Compass className="w-4 h-4 shrink-0 mt-0.5" />
                            <span className="line-clamp-2">{trip.interests}</span>
                          </p>
                        )}
                      </div>
                      
                      <div className="pt-6 border-t border-charcoal/5 flex justify-between items-center">
                        <div className="text-xs font-bold text-charcoal/40 uppercase tracking-widest">
                          {exp.copy_count} {exp.copy_count === 1 ? 'Clone' : 'Clones'}
                        </div>
                        <div className="flex gap-3">
                          <Link 
                            to={`/community/experiences/${exp.id}`} 
                            className="px-5 py-2.5 rounded-full text-sm font-bold text-charcoal bg-sand/30 hover:bg-sand/60 transition-colors"
                          >
                            View
                          </Link>
                          <button 
                            onClick={() => handleUseTrip(exp.id)}
                            className="px-5 py-2.5 rounded-full text-sm font-bold bg-charcoal text-white hover:-translate-y-0.5 hover:shadow-lg transition-all"
                          >
                            Clone Trip
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
