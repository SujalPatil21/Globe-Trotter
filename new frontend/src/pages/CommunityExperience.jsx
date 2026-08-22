import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Calendar, Heart, Copy, Compass, IndianRupee, Tag, ArrowLeft } from 'lucide-react';
import { communityApi } from '../api';
import AuthenticatedNav from '../components/AuthenticatedNav';
import { resolveCityImage, FALLBACK_IMAGE } from '../utils/imageResolver';

export default function CommunityExperience() {
  const { experienceId } = useParams();
  const navigate = useNavigate();
  const [exp, setExp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    communityApi.getExperience(experienceId)
      .then(res => setExp(res))
      .catch(err => setError(err.message || 'Experience not found'))
      .finally(() => setLoading(false));
  }, [experienceId]);

  const handleLikeToggle = async () => {
    try {
      if (exp.is_liked_by_me) {
        await communityApi.unlikeExperience(exp.id);
        setExp({ ...exp, is_liked_by_me: false, like_count: exp.like_count - 1 });
      } else {
        await communityApi.likeExperience(exp.id);
        setExp({ ...exp, is_liked_by_me: true, like_count: exp.like_count + 1 });
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleUseTrip = async () => {
    try {
      const res = await communityApi.copyExperience(exp.id);
      navigate(`/trips/${res.new_trip_id}`);
    } catch (err) {
      alert('Error copying trip.');
    }
  };

  if (loading) return <div className="min-h-screen bg-sand/20 flex items-center justify-center font-display text-2xl text-charcoal/50">Loading experience...</div>;
  if (error || !exp) return <div className="min-h-screen bg-sand/20 flex items-center justify-center font-display text-2xl text-red-500">{error || 'Experience not found'}</div>;

  const trip = exp.trip;
  const duration = trip ? Math.round((new Date(trip.end_date) - new Date(trip.start_date)) / 86400000) + 1 : 0;
  const uniqueCities = trip ? [...new Set(trip.stops.map(s => s.city?.city).filter(Boolean))] : [];
  const firstCity = uniqueCities.length > 0 ? uniqueCities[0] : null;
  const coverImage = trip.cover_image || resolveCityImage(firstCity);

  return (
    <div className="min-h-screen bg-sand/20 flex flex-col">
      <AuthenticatedNav />

      {/* Hero Header */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 bg-charcoal">
        <div className="absolute inset-0">
          <img 
            src={coverImage} 
            alt="Cover" 
            className="w-full h-full object-cover opacity-60"
            onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <Link to="/community" className="inline-flex items-center gap-2 text-gold-light hover:text-gold transition-colors mb-6 text-sm font-semibold tracking-wide uppercase">
            <ArrowLeft className="w-4 h-4" /> Back to Community
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <h1 className="font-display text-4xl sm:text-6xl font-bold text-white mb-4">
                {trip.name}
              </h1>
              <p className="text-xl text-white/80 font-medium mb-8">
                Created by{' '}
                <Link
                  to={`/profile/${exp.publisher_username || exp.publisher_name}`}
                  className="font-bold text-gold-light hover:text-gold transition-colors"
                >
                  {exp.publisher_name}
                </Link>
              </p>
              
              <div className="flex flex-wrap gap-4 text-white/90 text-sm font-bold uppercase tracking-wider">
                <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                  {duration} Days
                </span>
                <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                  {uniqueCities.length} {uniqueCities.length === 1 ? 'Destination' : 'Destinations'}
                </span>
                {trip.budget_tier && (
                  <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                    {trip.budget_tier} Style
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button 
                onClick={handleLikeToggle}
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-full font-bold transition-all shadow-lg backdrop-blur-md border ${
                  exp.is_liked_by_me 
                    ? 'bg-red-500 text-white border-red-500' 
                    : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                }`}
              >
                <Heart className="w-5 h-5" fill={exp.is_liked_by_me ? "currentColor" : "none"} />
                {exp.like_count} {exp.like_count === 1 ? 'Like' : 'Likes'}
              </button>
              
              <button 
                onClick={handleUseTrip}
                className="inline-flex items-center gap-2 px-8 py-3 bg-gold text-charcoal rounded-full font-bold shadow-xl shadow-black/20 hover:-translate-y-0.5 hover:bg-gold-light transition-all"
              >
                <Copy className="w-5 h-5" /> Clone This Trip
              </button>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-grow mx-auto max-w-5xl px-6 lg:px-10 py-16 space-y-16 w-full">
        
        {/* At a Glance */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl shadow-charcoal/5 border border-charcoal/5">
          <h2 className="font-display text-3xl font-bold text-charcoal mb-8">At a Glance</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-sand/50 rounded-full flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-charcoal" />
              </div>
              <div>
                <p className="text-xs font-bold text-charcoal/50 uppercase tracking-widest mb-1">Destinations</p>
                <p className="font-medium text-charcoal">{uniqueCities.join(', ') || 'Various'}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-sand/50 rounded-full flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-charcoal" />
              </div>
              <div>
                <p className="text-xs font-bold text-charcoal/50 uppercase tracking-widest mb-1">Duration</p>
                <p className="font-medium text-charcoal">{duration} Days</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-sand/50 rounded-full flex items-center justify-center shrink-0">
                <IndianRupee className="w-5 h-5 text-charcoal" />
              </div>
              <div>
                <p className="text-xs font-bold text-charcoal/50 uppercase tracking-widest mb-1">Budget</p>
                <p className="font-medium text-charcoal capitalize">{trip.budget_tier || 'Flexible'}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-sand/50 rounded-full flex items-center justify-center shrink-0">
                <Tag className="w-5 h-5 text-charcoal" />
              </div>
              <div>
                <p className="text-xs font-bold text-charcoal/50 uppercase tracking-widest mb-1">Interests</p>
                <p className="font-medium text-charcoal">{trip.interests || 'Any'}</p>
              </div>
            </div>
          </div>
          
          {trip.description && (
            <div className="mt-10 pt-8 border-t border-charcoal/5">
              <p className="text-xs font-bold text-charcoal/50 uppercase tracking-widest mb-3">About this experience</p>
              <p className="text-charcoal/80 leading-relaxed text-lg whitespace-pre-wrap">{trip.description}</p>
            </div>
          )}
        </section>

        {/* Itinerary */}
        <section>
          <div className="flex items-center gap-3 mb-10">
            <Compass className="w-8 h-8 text-charcoal" />
            <h2 className="font-display text-4xl font-bold text-charcoal">The Itinerary</h2>
          </div>
          
          {trip.stops && trip.stops.length > 0 ? (
            <div className="space-y-12">
              {trip.stops.map((stop, index) => {
                const stopDays = Math.max(1, Math.round((new Date(stop.end_date) - new Date(stop.start_date)) / 86400000) + 1);
                
                return (
                  <div key={stop.id} className="relative pl-8 sm:pl-16 border-l-2 border-charcoal/10 pb-4">
                    <div className="absolute left-[-17px] top-0 w-8 h-8 rounded-full bg-charcoal text-white flex items-center justify-center font-bold text-sm shadow-[0_0_0_6px_rgba(255,255,255,1)]">
                      {index + 1}
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="font-display text-3xl font-bold text-charcoal mb-2">
                        {stop.city?.city || 'Unknown'}, {stop.city?.state || ''}
                      </h3>
                      <p className="text-gold-dark font-bold text-sm uppercase tracking-wider">
                        {stopDays} {stopDays === 1 ? 'Day' : 'Days'}
                      </p>
                    </div>
                    
                    {stop.activities && stop.activities.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {stop.activities.map(act => (
                          <div key={act.id} className="bg-white p-6 rounded-2xl shadow-sm border border-charcoal/5 hover:border-gold/50 transition-colors">
                            <div className="flex justify-between items-start mb-3">
                              <h4 className="font-bold text-charcoal text-lg">
                                {act.custom_place_name || act.activity?.name}
                              </h4>
                              {act.start_time && (
                                <span className="bg-sand/50 text-charcoal/70 px-2 py-1 rounded text-xs font-bold shadow-sm">
                                  {act.start_time.substring(0,5)}
                                </span>
                              )}
                            </div>
                            {(act.notes || act.activity?.description) && (
                              <p className="text-sm text-charcoal/60">
                                {act.notes || act.activity?.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-sand/20 p-6 rounded-2xl border border-charcoal/5 border-dashed">
                        <p className="text-charcoal/40 italic font-medium">Free time in this destination.</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-charcoal/5">
              <p className="text-xl text-charcoal/50 font-medium">This experience has no detailed itinerary.</p>
            </div>
          )}
        </section>
        
        {/* Footer CTA */}
        <div className="text-center pt-16 pb-8 border-t border-charcoal/10">
          <h2 className="font-display text-3xl font-bold text-charcoal mb-6">Inspired by this journey?</h2>
          <button 
            onClick={handleUseTrip}
            className="inline-flex items-center gap-2 bg-charcoal text-white px-10 py-4 rounded-full font-bold text-lg shadow-xl shadow-black/10 hover:-translate-y-1 hover:bg-charcoal/90 transition-all"
          >
            <Copy className="w-5 h-5" /> Clone This Trip
          </button>
          <p className="text-sm font-semibold text-charcoal/50 mt-4 uppercase tracking-widest">
            Make it your own in your private workspace
          </p>
        </div>
      </main>
    </div>
  );
}
