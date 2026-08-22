import { useState, useMemo, useEffect } from 'react';
import { Plus, Edit2, Trash2, MapPin, Clock } from 'lucide-react';
import { tripsApi, masterApi } from '../../api';
import RecommendationPanel from './RecommendationPanel';
import { resolveCityImage } from '../../utils/imageResolver';

export default function TripItineraryTab({ trip, refreshTrip }) {
  const [cities, setCities] = useState([]);
  const [citySearch, setCitySearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCityName, setSelectedCityName] = useState('');
  const [activitiesForCity, setActivitiesForCity] = useState([]);

  // Modals visibility
  const [showActivitySuggestions, setShowActivitySuggestions] = useState(false);
  const [showStopModal, setShowStopModal] = useState(false);
  const [showPlaceModal, setShowPlaceModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);

  // Forms
  const [stopForm, setStopForm] = useState({ city_id: '', start_date: '', end_date: '' });
  const [placeForm, setPlaceForm] = useState({ custom_place_name: '', activity_date: '', start_time: '', custom_cost: '', notes: '' });
  const [activityForm, setActivityForm] = useState({ activity_id: '', custom_place_name: '', activity_date: '', start_time: '', custom_cost: '', notes: '' });
  
  const [activeEditItem, setActiveEditItem] = useState(null);
  const [editForm, setEditForm] = useState({ activity_date: '', start_time: '', custom_cost: '', notes: '' });
  
  const [activeStopId, setActiveStopId] = useState(null);

  useEffect(() => {
    if (showStopModal && citySearch !== selectedCityName) {
      const timer = setTimeout(() => {
        masterApi.getCities(citySearch).then(res => setCities(res)).catch(console.error);
        setShowSuggestions(true);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [showStopModal, citySearch, selectedCityName]);

  const selectCity = (city) => {
    setStopForm({...stopForm, city_id: city.id});
    const fullName = `${city.city}, ${city.state}`;
    setCitySearch(fullName);
    setSelectedCityName(fullName);
    setShowSuggestions(false);
  };

  const itineraryDays = useMemo(() => {
    if (!trip || !trip.start_date || !trip.end_date) return [];
    const start = new Date(trip.start_date);
    const end = new Date(trip.end_date);
    const days = [];
    let current = new Date(start);
    let dayNum = 1;

    while (current <= end) {
      const currentDateStr = current.toISOString().split('T')[0];
      const activeStop = (trip.stops || []).find(s => currentDateStr >= s.start_date && currentDateStr <= s.end_date);
      const activeActivities = [];
      if (activeStop) {
        activeActivities.push(...(activeStop.activities || []).filter(a => a.activity_date === currentDateStr));
      }
      activeActivities.sort((a, b) => {
        if (!a.start_time) return 1;
        if (!b.start_time) return -1;
        return a.start_time.localeCompare(b.start_time);
      });

      days.push({
        dayNum,
        dateStr: currentDateStr,
        displayDate: current.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
        stop: activeStop,
        activities: activeActivities
      });

      current.setDate(current.getDate() + 1);
      dayNum++;
    }
    return days;
  }, [trip]);

  // Handlers
  const handleAddStop = async (e) => {
    e.preventDefault();
    try {
      await tripsApi.addStop(trip.id, {
        city_id: parseInt(stopForm.city_id),
        start_date: stopForm.start_date,
        end_date: stopForm.end_date
      });
      setShowStopModal(false);
      setStopForm({ city_id: '', start_date: '', end_date: '' });
      setCitySearch('');
      setSelectedCityName('');
      refreshTrip();
    } catch (err) {
      alert(err.response?.data?.detail || "Error adding destination.");
    }
  };

  const handleRemoveStop = async (stopId) => {
    if(window.confirm('Remove this destination?')) {
      await tripsApi.deleteStop(trip.id, stopId);
      refreshTrip();
    }
  };

  const openPlaceModal = (stopId, dateStr) => {
    setActiveStopId(stopId);
    setPlaceForm({ ...placeForm, activity_date: dateStr, custom_place_name: '', start_time: '', custom_cost: '', notes: '' });
    setShowPlaceModal(true);
  };

  const openActivityModal = (stopId, dateStr, cityId) => {
    setActiveStopId(stopId);
    setActivityForm({ activity_id: '', custom_place_name: '', activity_date: dateStr, start_time: '', custom_cost: '', notes: '' });
    masterApi.getActivities(cityId).then(res => setActivitiesForCity(res)).catch(console.error);
    setShowActivityModal(true);
  };

  const handleAddPlace = async (e) => {
    e.preventDefault();
    try {
      await tripsApi.addActivity(activeStopId, {
        custom_place_name: placeForm.custom_place_name,
        activity_date: placeForm.activity_date,
        start_time: placeForm.start_time || null,
        custom_cost: placeForm.custom_cost ? parseFloat(placeForm.custom_cost) : 0,
        notes: placeForm.notes
      });
      setShowPlaceModal(false);
      refreshTrip();
    } catch (err) {
      alert("Error adding custom place.");
    }
  };

  const handleAddCatalogActivity = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        activity_date: activityForm.activity_date,
        start_time: activityForm.start_time || null,
        custom_cost: activityForm.custom_cost ? parseFloat(activityForm.custom_cost) : null,
        notes: activityForm.notes
      };
      if (activityForm.activity_id) {
        payload.activity_id = parseInt(activityForm.activity_id);
      } else {
        payload.custom_place_name = activityForm.custom_place_name;
      }
      await tripsApi.addActivity(activeStopId, payload);
      setShowActivityModal(false);
      refreshTrip();
    } catch (err) {
      alert("Error adding activity.");
    }
  };

  const handleDeleteActivity = async (stopId, activityId) => {
    if(window.confirm('Delete this item?')) {
      await tripsApi.deleteActivity(stopId, activityId);
      refreshTrip();
    }
  };

  const openEditModal = (stopId, act) => {
    setActiveStopId(stopId);
    setActiveEditItem(act.id);
    setEditForm({
      activity_date: act.activity_date,
      start_time: act.start_time || '',
      custom_cost: act.custom_cost !== null ? act.custom_cost : '',
      notes: act.notes || ''
    });
  };

  const handleEditItemSubmit = async (e) => {
    e.preventDefault();
    try {
      await tripsApi.updateActivity(activeStopId, activeEditItem, {
        activity_date: editForm.activity_date,
        start_time: editForm.start_time || null,
        custom_cost: editForm.custom_cost ? parseFloat(editForm.custom_cost) : null,
        notes: editForm.notes
      });
      setActiveEditItem(null);
      refreshTrip();
    } catch (err) {
      alert("Error updating item.");
    }
  };

  if (!trip) return null;

  return (
    <div className="space-y-12 pb-24">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white p-8 rounded-3xl shadow-lg shadow-charcoal/5 border border-charcoal/5">
        <div>
          <h2 className="text-3xl font-display font-bold text-charcoal">Interactive Itinerary</h2>
          <p className="text-charcoal/60 font-medium mt-1">Build your day-by-day travel plan</p>
        </div>
        <button 
          onClick={() => setShowStopModal(true)} 
          className="inline-flex items-center gap-2 bg-charcoal text-white px-6 py-3 rounded-full font-semibold shadow-md hover:bg-charcoal/80 hover:-translate-y-0.5 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Destination
        </button>
      </div>

      {itineraryDays.length === 0 ? (
        <div className="bg-sand/20 rounded-3xl p-12 text-center border border-charcoal/10 border-dashed">
          <p className="text-lg text-charcoal/50 font-medium">Your trip dates are invalid or missing.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {itineraryDays.map((day) => {
            const cityName = day.stop?.city?.city || 'Unknown';
            const cityImage = resolveCityImage(cityName);
            
            return (
              <div key={day.dateStr} className="bg-white rounded-3xl shadow-xl shadow-charcoal/5 border border-charcoal/5 overflow-hidden flex flex-col lg:flex-row">
                
                {/* Left Side: Day Header */}
                <div className="lg:w-1/3 bg-charcoal text-white relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute inset-0">
                    {day.stop && (
                      <>
                        <img src={cityImage} alt={cityName} className="w-full h-full object-cover opacity-30" />
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/80 to-transparent" />
                      </>
                    )}
                  </div>
                  
                  <div className="relative p-8 z-10 flex-grow">
                    <div className="text-gold-light font-bold tracking-widest uppercase text-sm mb-2">
                      Day {day.dayNum}
                    </div>
                    <h3 className="font-display text-4xl font-bold mb-2">{day.displayDate.split(',')[0]}</h3>
                    <p className="text-white/70 font-medium">{day.dateStr}</p>
                    
                    {day.stop && (
                      <div className="mt-8">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                          <MapPin className="w-4 h-4 text-gold" />
                          <span className="font-semibold">{cityName}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {day.stop && (
                    <div className="relative p-8 z-10">
                      <button onClick={() => handleRemoveStop(day.stop.id)} className="text-white/50 hover:text-red-400 text-sm font-semibold transition-colors uppercase tracking-wider">
                        Remove Destination
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Right Side: Timeline & Recommendations */}
                <div className="lg:w-2/3 p-8 sm:p-12">
                  {!day.stop ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-12">
                      <div className="w-16 h-16 bg-sand/50 rounded-full flex items-center justify-center mb-4">
                        <MapPin className="w-6 h-6 text-charcoal/30" />
                      </div>
                      <p className="text-lg text-charcoal/60 font-medium">No destination scheduled for this date.</p>
                      <button onClick={() => setShowStopModal(true)} className="mt-4 text-gold-dark font-bold hover:underline">
                        Add a destination now &rarr;
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-10">
                      {/* Controls */}
                      <div className="flex flex-wrap gap-3 pb-6 border-b border-charcoal/5">
                        <button onClick={() => openPlaceModal(day.stop.id, day.dateStr)} className="inline-flex items-center gap-2 bg-sand/30 hover:bg-sand/60 text-charcoal px-5 py-2.5 rounded-full text-sm font-semibold transition-colors border border-charcoal/5">
                          <Plus className="w-4 h-4" /> Add Custom Place
                        </button>
                        <button onClick={() => openActivityModal(day.stop.id, day.dateStr, day.stop.city_id)} className="inline-flex items-center gap-2 bg-sand/30 hover:bg-sand/60 text-charcoal px-5 py-2.5 rounded-full text-sm font-semibold transition-colors border border-charcoal/5">
                          <Plus className="w-4 h-4" /> Add Catalog Activity
                        </button>
                      </div>

                      {/* Timeline */}
                      <div className="relative pt-4">
                        {day.activities.length === 0 ? (
                          <div className="text-charcoal/40 italic font-medium">Your itinerary is open. Time to plan!</div>
                        ) : (
                          <div className="space-y-8">
                            {day.activities.map(act => (
                              <div key={act.id} className="relative pl-8 group">
                                {/* Timeline line */}
                                <div className="absolute left-3 top-8 bottom-[-32px] w-0.5 bg-charcoal/10 group-last:hidden"></div>
                                {/* Timeline dot */}
                                <div className="absolute left-[9px] top-1.5 w-3 h-3 rounded-full bg-gold shadow-[0_0_0_4px_rgba(255,255,255,1)]"></div>
                                
                                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                  <div className="sm:w-24 shrink-0 text-charcoal/60 font-bold text-sm pt-0.5 flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5" />
                                    {act.start_time ? act.start_time.substring(0, 5) : 'Any'}
                                  </div>
                                  
                                  <div className="flex-grow bg-sand/20 rounded-2xl p-5 border border-charcoal/5 group-hover:border-gold/30 transition-colors">
                                    <div className="flex justify-between items-start gap-4">
                                      <div>
                                        <h4 className="font-display font-bold text-xl text-charcoal mb-1">{act.custom_place_name || act.activity?.name}</h4>
                                        {(act.notes || act.activity?.description) && (
                                          <p className="text-charcoal/70 text-sm">{act.notes || act.activity?.description}</p>
                                        )}
                                      </div>
                                      <div className="text-right shrink-0">
                                        <div className="inline-flex items-center justify-center bg-white border border-charcoal/10 px-3 py-1 rounded-lg text-sm font-bold text-charcoal shadow-sm">
                                          ₹{act.custom_cost !== null ? act.custom_cost : (act.activity?.cost || 0)}
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="mt-4 pt-4 border-t border-charcoal/5 flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button onClick={() => openEditModal(day.stop.id, act)} className="inline-flex items-center gap-1.5 text-charcoal/60 hover:text-gold-dark text-xs font-bold uppercase tracking-wider">
                                        <Edit2 className="w-3 h-3" /> Edit
                                      </button>
                                      <button onClick={() => handleDeleteActivity(day.stop.id, act.id)} className="inline-flex items-center gap-1.5 text-charcoal/60 hover:text-red-500 text-xs font-bold uppercase tracking-wider">
                                        <Trash2 className="w-3 h-3" /> Remove
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Recommendations for this stop/day */}
                      <div className="mt-12 pt-8 border-t border-charcoal/10">
                        <RecommendationPanel
                          cityId={day.stop.city_id}
                          stopId={day.stop.id}
                          activityDate={day.dateStr}
                          interests={trip.interests}
                          budgetTier={trip.budget_tier}
                          tripDurationDays={Math.max(1, Math.round((new Date(day.stop.end_date) - new Date(day.stop.start_date)) / 86400000) + 1)}
                          excludePlaceNames={(trip.stops || []).flatMap(s => (s.activities || []).map(a => a.custom_place_name).filter(Boolean))}
                          onAdded={refreshTrip}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODALS */}
      {showStopModal && (
        <div className="fixed inset-0 bg-charcoal/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl">
            <h3 className="font-display text-2xl font-bold text-charcoal mb-6">Add Destination</h3>
            <form onSubmit={handleAddStop} className="space-y-6">
              <div className="relative">
                <label className="block text-sm font-semibold tracking-wide text-charcoal/70 mb-2 uppercase">City</label>
                <input
                  type="text" placeholder="Type city name..." className="w-full bg-sand/20 border border-charcoal/10 rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-gold transition-all"
                  value={citySearch}
                  onChange={e => {
                    setCitySearch(e.target.value);
                    setStopForm({...stopForm, city_id: ''});
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                />
                {showSuggestions && cities.length > 0 && (
                  <ul className="absolute z-10 mt-2 w-full bg-white border border-charcoal/10 rounded-xl shadow-xl max-h-60 overflow-auto">
                    {cities.map(c => (
                      <li key={c.id} className="px-4 py-3 hover:bg-sand/30 cursor-pointer font-medium text-charcoal border-b border-charcoal/5 last:border-0" onClick={() => selectCity(c)}>
                        {c.city}, {c.state}
                      </li>
                    ))}
                  </ul>
                )}
                <input type="text" required className="opacity-0 absolute h-0 w-0" value={stopForm.city_id} onChange={() => {}} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold tracking-wide text-charcoal/70 mb-2 uppercase">Start Date</label>
                  <input type="date" required className="w-full bg-sand/20 border border-charcoal/10 rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-gold transition-all" 
                    min={trip.start_date} max={trip.end_date}
                    value={stopForm.start_date} onChange={e => setStopForm({...stopForm, start_date: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold tracking-wide text-charcoal/70 mb-2 uppercase">End Date</label>
                  <input type="date" required className="w-full bg-sand/20 border border-charcoal/10 rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-gold transition-all" 
                    min={trip.start_date} max={trip.end_date}
                    value={stopForm.end_date} onChange={e => setStopForm({...stopForm, end_date: e.target.value})} />
                </div>
              </div>
              <div className="pt-6 flex justify-end gap-3 border-t border-charcoal/10">
                <button type="button" onClick={() => setShowStopModal(false)} className="px-6 py-2.5 text-charcoal font-semibold hover:bg-sand/30 rounded-full transition-colors">Cancel</button>
                <button type="submit" className="bg-charcoal text-white px-8 py-2.5 rounded-full font-semibold shadow-lg hover:-translate-y-0.5 hover:bg-charcoal/90 transition-all">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPlaceModal && (
        <div className="fixed inset-0 bg-charcoal/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl">
            <h3 className="font-display text-2xl font-bold text-charcoal mb-6">Add Custom Place</h3>
            <form onSubmit={handleAddPlace} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold tracking-wide text-charcoal/70 mb-2 uppercase">Place Name</label>
                <input type="text" required className="w-full bg-sand/20 border border-charcoal/10 rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-gold transition-all" placeholder="e.g. Baga Beach" value={placeForm.custom_place_name} onChange={e => setPlaceForm({...placeForm, custom_place_name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold tracking-wide text-charcoal/70 mb-2 uppercase">Date</label>
                <input type="date" required className="w-full bg-sand/20 border border-charcoal/10 rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-gold transition-all" value={placeForm.activity_date} onChange={e => setPlaceForm({...placeForm, activity_date: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold tracking-wide text-charcoal/70 mb-2 uppercase">Time (Optional)</label>
                  <input type="time" className="w-full bg-sand/20 border border-charcoal/10 rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-gold transition-all" value={placeForm.start_time} onChange={e => setPlaceForm({...placeForm, start_time: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold tracking-wide text-charcoal/70 mb-2 uppercase">Cost (₹)</label>
                  <input type="number" className="w-full bg-sand/20 border border-charcoal/10 rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-gold transition-all" value={placeForm.custom_cost} onChange={e => setPlaceForm({...placeForm, custom_cost: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold tracking-wide text-charcoal/70 mb-2 uppercase">Notes</label>
                <input type="text" className="w-full bg-sand/20 border border-charcoal/10 rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-gold transition-all" placeholder="e.g. Morning visit" value={placeForm.notes} onChange={e => setPlaceForm({...placeForm, notes: e.target.value})} />
              </div>
              <div className="pt-6 flex justify-end gap-3 border-t border-charcoal/10">
                <button type="button" onClick={() => setShowPlaceModal(false)} className="px-6 py-2.5 text-charcoal font-semibold hover:bg-sand/30 rounded-full transition-colors">Cancel</button>
                <button type="submit" className="bg-charcoal text-white px-8 py-2.5 rounded-full font-semibold shadow-lg hover:-translate-y-0.5 hover:bg-charcoal/90 transition-all">Add Place</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showActivityModal && (
        <div className="fixed inset-0 bg-charcoal/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl">
            <h3 className="font-display text-2xl font-bold text-charcoal mb-6">Add Activity</h3>
            <form onSubmit={handleAddCatalogActivity} className="space-y-6">
              <div className="relative">
                <label className="block text-sm font-semibold tracking-wide text-charcoal/70 mb-2 uppercase">Activity</label>
                <input 
                  type="text" required placeholder="Type activity name..." className="w-full bg-sand/20 border border-charcoal/10 rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-gold transition-all" 
                  value={activityForm.custom_place_name} 
                  onChange={e => {
                    setActivityForm({...activityForm, custom_place_name: e.target.value, activity_id: ''});
                  }}
                  onFocus={() => setShowActivitySuggestions(true)}
                  onBlur={() => setTimeout(() => setShowActivitySuggestions(false), 200)}
                />
                {showActivitySuggestions && activitiesForCity.filter(a => a.name.toLowerCase().includes((activityForm.custom_place_name || '').toLowerCase())).length > 0 && (
                  <ul className="absolute z-10 mt-2 w-full bg-white border border-charcoal/10 rounded-xl shadow-xl max-h-60 overflow-auto">
                    {activitiesForCity.filter(a => a.name.toLowerCase().includes((activityForm.custom_place_name || '').toLowerCase())).map(a => (
                      <li key={a.id} className="px-4 py-3 hover:bg-sand/30 cursor-pointer font-medium text-charcoal border-b border-charcoal/5 last:border-0" onClick={() => {
                        setActivityForm({...activityForm, activity_id: a.id, custom_place_name: a.name, custom_cost: a.cost});
                        setShowActivitySuggestions(false);
                      }}>
                        {a.name} (₹{a.cost})
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold tracking-wide text-charcoal/70 mb-2 uppercase">Date</label>
                <input type="date" required className="w-full bg-sand/20 border border-charcoal/10 rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-gold transition-all" value={activityForm.activity_date} onChange={e => setActivityForm({...activityForm, activity_date: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold tracking-wide text-charcoal/70 mb-2 uppercase">Time (Optional)</label>
                  <input type="time" className="w-full bg-sand/20 border border-charcoal/10 rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-gold transition-all" value={activityForm.start_time} onChange={e => setActivityForm({...activityForm, start_time: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold tracking-wide text-charcoal/70 mb-2 uppercase">Override Cost (Optional)</label>
                  <input type="number" className="w-full bg-sand/20 border border-charcoal/10 rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-gold transition-all" value={activityForm.custom_cost} onChange={e => setActivityForm({...activityForm, custom_cost: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold tracking-wide text-charcoal/70 mb-2 uppercase">Notes</label>
                <input type="text" className="w-full bg-sand/20 border border-charcoal/10 rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-gold transition-all" value={activityForm.notes} onChange={e => setActivityForm({...activityForm, notes: e.target.value})} />
              </div>
              <div className="pt-6 flex justify-end gap-3 border-t border-charcoal/10">
                <button type="button" onClick={() => setShowActivityModal(false)} className="px-6 py-2.5 text-charcoal font-semibold hover:bg-sand/30 rounded-full transition-colors">Cancel</button>
                <button type="submit" className="bg-charcoal text-white px-8 py-2.5 rounded-full font-semibold shadow-lg hover:-translate-y-0.5 hover:bg-charcoal/90 transition-all">Add Activity</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeEditItem && (
        <div className="fixed inset-0 bg-charcoal/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl">
            <h3 className="font-display text-2xl font-bold text-charcoal mb-6">Edit Item</h3>
            <form onSubmit={handleEditItemSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold tracking-wide text-charcoal/70 mb-2 uppercase">Date</label>
                  <input type="date" required className="w-full bg-sand/20 border border-charcoal/10 rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-gold transition-all" value={editForm.activity_date} onChange={e => setEditForm({...editForm, activity_date: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold tracking-wide text-charcoal/70 mb-2 uppercase">Time</label>
                  <input type="time" className="w-full bg-sand/20 border border-charcoal/10 rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-gold transition-all" value={editForm.start_time} onChange={e => setEditForm({...editForm, start_time: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold tracking-wide text-charcoal/70 mb-2 uppercase">Cost (₹)</label>
                <input type="number" className="w-full bg-sand/20 border border-charcoal/10 rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-gold transition-all" value={editForm.custom_cost} onChange={e => setEditForm({...editForm, custom_cost: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold tracking-wide text-charcoal/70 mb-2 uppercase">Notes</label>
                <input type="text" className="w-full bg-sand/20 border border-charcoal/10 rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-gold transition-all" value={editForm.notes} onChange={e => setEditForm({...editForm, notes: e.target.value})} />
              </div>
              <div className="pt-6 flex justify-end gap-3 border-t border-charcoal/10">
                <button type="button" onClick={() => setActiveEditItem(null)} className="px-6 py-2.5 text-charcoal font-semibold hover:bg-sand/30 rounded-full transition-colors">Cancel</button>
                <button type="submit" className="bg-charcoal text-white px-8 py-2.5 rounded-full font-semibold shadow-lg hover:-translate-y-0.5 hover:bg-charcoal/90 transition-all">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
