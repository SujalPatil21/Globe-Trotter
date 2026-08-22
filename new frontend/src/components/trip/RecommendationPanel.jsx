import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { recommendationsApi, tripsApi, communityApi } from '../../api';

/**
 * RecommendationPanel
 * --------------------
 * Shows top-3 tourist spot and restaurant recommendations for a city/stop.
 *
 * Props:
 *   cityId           – required, the cities.id
 *   stopId           – required when adding to itinerary (trip_stops.id)
 *   activityDate     – required for "Add to Itinerary" (YYYY-MM-DD string)
 *   interests        – optional comma-separated string, e.g. "Heritage,Nature"
 *   budgetTier       – optional tier string
 *   tripDurationDays – optional int
 *   excludePlaceNames  – optional array of already-selected place names
 *   onAdded          – callback after an item is added to the itinerary
 */
export default function RecommendationPanel({
  cityId,
  stopId,
  activityDate,
  interests,
  budgetTier,
  tripDurationDays,
  excludePlaceNames = [],
  onAdded,
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('places');
  const [showAll, setShowAll] = useState(false);
  const [addingId, setAddingId] = useState(null);

  const [expandedCommunityFor, setExpandedCommunityFor] = useState(null);
  const [communityExperiences, setCommunityExperiences] = useState([]);
  const [loadingCommunity, setLoadingCommunity] = useState(false);

  const handleToggleCommunity = async (itemId) => {
    if (expandedCommunityFor === itemId) {
      setExpandedCommunityFor(null);
      return;
    }
    setExpandedCommunityFor(itemId);
    setLoadingCommunity(true);
    try {
      const exps = await communityApi.getExperiences({ city: data?.city?.city });
      setCommunityExperiences(exps || []);
    } catch (err) {
      console.error('Failed to fetch community experiences', err);
    } finally {
      setLoadingCommunity(false);
    }
  };

  const fetchRecommendations = useCallback(async () => {
    if (!cityId) return;
    setLoading(true);
    try {
      const params = { limit: showAll ? 10 : 3 };
      if (interests) params.interests = interests;
      if (budgetTier) params.budget_tier = budgetTier;
      if (tripDurationDays) params.trip_duration_days = tripDurationDays;
      if (excludePlaceNames.length > 0) {
        params.exclude_place_names = excludePlaceNames.join(',');
      }
      const bundle = await recommendationsApi.getCityBundle(cityId, params);
      setData(bundle);
    } catch (err) {
      console.error('Recommendation fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [cityId, interests, budgetTier, tripDurationDays, excludePlaceNames, showAll]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  const handleAddPlace = async (spot) => {
    if (!stopId || !activityDate) return;
    setAddingId(spot.id);
    try {
      await tripsApi.addActivity(stopId, {
        custom_place_name: spot.place_name,
        activity_date: activityDate,
        notes: spot.description?.substring(0, 200) || '',
        custom_cost: 0,
      });
      if (onAdded) onAdded();
    } catch (err) {
      alert(err?.response?.data?.detail || 'Could not add place. Check that the date is within the stop dates.');
    } finally {
      setAddingId(null);
    }
  };
  const handleAddRestaurant = async (rest) => {
    if (!stopId || !activityDate) return;
    setAddingId(rest.id);
    try {
      await tripsApi.addActivity(stopId, {
        custom_place_name: rest.name,
        activity_date: activityDate,
        notes: `Cuisine: ${rest.cuisine}. Must try: ${rest.must_try_dish}`,
        custom_cost: 0,
      });
      if (onAdded) onAdded();
    } catch (err) {
      alert(err?.response?.data?.detail || 'Could not add restaurant. Check that the date is within the stop dates.');
    } finally {
      setAddingId(null);
    }
  };

  if (!cityId) return null;
  if (!cityId) return null;
  if (loading) {
    return (
      <div className="mt-4 p-4 bg-sand/30 rounded-2xl border border-charcoal/10 animate-pulse">
        <div className="h-4 bg-charcoal/10 rounded w-1/3 mb-3" />
        <div className="space-y-2">
          {[1, 2, 3].map(i => <div key={i} className="h-12 bg-charcoal/5 rounded-xl" />)}
        </div>
      </div>
    );
  }
  if (!data) return null;

  const INTEREST_TAGS = ['Heritage', 'Nature', 'Adventure', 'Food', 'Religious', 'Shopping'];
  const selectedInterests = interests ? interests.split(',').map(i => i.trim()) : [];

  return (
    <div className="mt-4 rounded-3xl border border-charcoal/10 overflow-hidden bg-white shadow-md shadow-charcoal/5">
      {/* Header */}
      <div className="bg-gradient-to-r from-sand/40 to-sand/20 px-5 py-4 border-b border-charcoal/10 flex justify-between items-center">
        <div>
          <h4 className="font-display font-bold text-charcoal text-lg">Suggested for You</h4>
          <p className="text-sm font-medium text-charcoal/60 mt-0.5">
            {data.city.city}, {data.city.state}
            {selectedInterests.length > 0 && (
              <span className="ml-2 text-gold-dark">· {selectedInterests.join(', ')}</span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('places')}
            className={`text-sm px-4 py-2 rounded-full font-bold transition-all shadow-sm ${
              activeTab === 'places'
                ? 'bg-charcoal text-white'
                : 'bg-white text-charcoal/70 hover:bg-sand hover:text-charcoal border border-charcoal/10'
            }`}
          >
            Places
          </button>
          <button
            onClick={() => setActiveTab('restaurants')}
            className={`text-sm px-4 py-2 rounded-full font-bold transition-all shadow-sm ${
              activeTab === 'restaurants'
                ? 'bg-charcoal text-white'
                : 'bg-white text-charcoal/70 hover:bg-sand hover:text-charcoal border border-charcoal/10'
            }`}
          >
            Food
          </button>
        </div>
      </div>

      {/* Places tab */}
      {activeTab === 'places' && (
        <div className="divide-y divide-charcoal/5">
          {(data.places || []).length === 0 ? (
            <p className="text-charcoal/50 text-sm text-center py-8 font-medium">No places to suggest right now.</p>
          ) : (
            data.places.map(spot => (
              <div key={spot.id} className="px-5 py-4 hover:bg-sand/20 transition-colors group">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-bold text-charcoal text-base truncate">{spot.place_name}</span>
                      {spot.must_visit && (
                        <span className="shrink-0 text-[10px] uppercase tracking-wider bg-gold/20 text-gold-dark px-2.5 py-1 rounded-full font-bold">
                          Must Visit
                        </span>
                      )}
                      <span className="shrink-0 text-[10px] uppercase tracking-wider bg-charcoal/5 text-charcoal/70 px-2.5 py-1 rounded-full font-bold">
                        {spot.reason}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-charcoal/40 uppercase tracking-wider mb-2">{spot.sub_category} · {spot.duration_needed}</p>
                    <p className="text-sm text-charcoal/70 line-clamp-2 leading-relaxed">{spot.description}</p>
                    <p className="text-xs font-medium text-charcoal/50 mt-2">Best: {spot.best_time_to_visit}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleCommunity(spot.id)}
                      className="text-xs bg-white border border-charcoal/10 text-charcoal px-4 py-2 rounded-full font-bold hover:bg-sand/50 transition-colors shadow-sm"
                    >
                      Community
                    </button>
                    {stopId && activityDate && (
                      <button
                        onClick={() => handleAddPlace(spot)}
                        disabled={addingId === spot.id}
                        className="text-xs bg-gold text-charcoal px-4 py-2 rounded-full font-bold hover:bg-gold-light hover:-translate-y-0.5 disabled:opacity-50 transition-all shadow-sm"
                      >
                        {addingId === spot.id ? '...' : '+ Add'}
                      </button>
                    )}
                  </div>
                </div>
                {expandedCommunityFor === spot.id && (
                  <div className="mt-4 p-4 bg-sand/30 rounded-2xl border border-charcoal/5">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-3">Community Experiences</h5>
                    {loadingCommunity ? (
                      <div className="text-sm font-medium text-charcoal/40 animate-pulse">Loading...</div>
                    ) : communityExperiences.length === 0 ? (
                      <div className="text-sm font-medium text-charcoal/50">No community experiences found for {data.city.city}.</div>
                    ) : (
                      <>
                        <ul className="space-y-2 mb-3">
                          {communityExperiences.slice(0, 2).map(exp => {
                             const days = Math.round((new Date(exp.trip.end_date) - new Date(exp.trip.start_date)) / (1000 * 3600 * 24)) + 1;
                             return (
                               <li key={exp.id} className="text-sm font-medium text-charcoal/80 flex items-start gap-2">
                                 <span className="text-gold mt-0.5">•</span>
                                 <span>{exp.trip.name} — {days} Days</span>
                               </li>
                             );
                          })}
                        </ul>
                        {communityExperiences.length > 2 && (
                          <div className="mt-3 pt-3 border-t border-charcoal/10">
                             <Link to={`/community?city=${encodeURIComponent(data.city.city)}`} className="text-xs font-bold uppercase tracking-wider text-charcoal hover:text-gold-dark flex items-center gap-1 transition-colors">
                               View All
                             </Link>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
          {(data.places || []).length > 0 && (
            <div className="px-5 py-4 text-center bg-sand/10">
              <button
                onClick={() => setShowAll(v => !v)}
                className="text-sm text-charcoal/60 hover:text-charcoal font-bold transition-colors"
              >
                {showAll ? 'Show fewer' : 'View more suggestions'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Restaurants tab */}
      {activeTab === 'restaurants' && (
        <div className="divide-y divide-charcoal/5">
          {(data.restaurants || []).length === 0 ? (
            <p className="text-charcoal/50 text-sm text-center py-8 font-medium">No restaurants to suggest.</p>
          ) : (
            data.restaurants.map(r => (
              <div key={r.id} className="px-5 py-4 hover:bg-sand/20 transition-colors">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-bold text-charcoal text-base">{r.name}</span>
                      <span className="shrink-0 text-[10px] uppercase tracking-wider bg-charcoal/5 text-charcoal/70 px-2.5 py-1 rounded-full font-bold">
                        {r.reason}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-charcoal/40 uppercase tracking-wider mb-2">{r.cuisine} · {r.category}</p>
                    <p className="text-sm text-gold-dark mt-1 font-bold">
                      Must Try: {r.must_try_dish}
                    </p>
                    {r.notes && <p className="text-sm text-charcoal/60 mt-1 line-clamp-1">{r.notes}</p>}
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleCommunity(r.id)}
                      className="text-xs bg-white border border-charcoal/10 text-charcoal px-4 py-2 rounded-full font-bold hover:bg-sand/50 transition-colors shadow-sm"
                    >
                      Community
                    </button>
                    {stopId && activityDate && (
                      <button
                        onClick={() => handleAddRestaurant(r)}
                        disabled={addingId === r.id}
                        className="text-xs bg-gold text-charcoal px-4 py-2 rounded-full font-bold hover:bg-gold-light hover:-translate-y-0.5 disabled:opacity-50 transition-all shadow-sm"
                      >
                        {addingId === r.id ? '...' : '+ Add'}
                      </button>
                    )}
                  </div>
                </div>
                {expandedCommunityFor === r.id && (
                  <div className="mt-4 p-4 bg-sand/30 rounded-2xl border border-charcoal/5">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-3">Community Experiences</h5>
                    {loadingCommunity ? (
                      <div className="text-sm font-medium text-charcoal/40 animate-pulse">Loading...</div>
                    ) : communityExperiences.length === 0 ? (
                      <div className="text-sm font-medium text-charcoal/50">No community experiences found for {data.city.city}.</div>
                    ) : (
                      <>
                        <ul className="space-y-2 mb-3">
                          {communityExperiences.slice(0, 2).map(exp => {
                             const days = Math.round((new Date(exp.trip.end_date) - new Date(exp.trip.start_date)) / (1000 * 3600 * 24)) + 1;
                             return (
                               <li key={exp.id} className="text-sm font-medium text-charcoal/80 flex items-start gap-2">
                                 <span className="text-gold mt-0.5">•</span>
                                 <span>{exp.trip.name} — {days} Days</span>
                               </li>
                             );
                          })}
                        </ul>
                        {communityExperiences.length > 2 && (
                          <div className="mt-3 pt-3 border-t border-charcoal/10">
                             <Link to={`/community?city=${encodeURIComponent(data.city.city)}`} className="text-xs font-bold uppercase tracking-wider text-charcoal hover:text-gold-dark flex items-center gap-1 transition-colors">
                               View All
                             </Link>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
          {(data.restaurants || []).length > 0 && (
            <div className="px-5 py-4 text-center bg-sand/10">
              <button
                onClick={() => setShowAll(v => !v)}
                className="text-sm text-charcoal/60 hover:text-charcoal font-bold transition-colors"
              >
                {showAll ? 'Show fewer' : 'View more restaurants'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
