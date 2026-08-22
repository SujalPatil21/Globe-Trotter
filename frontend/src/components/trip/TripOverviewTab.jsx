import { useState, useEffect, useMemo } from 'react';
import { tripsApi, masterApi } from '../../api';
import RecommendationPanel from './RecommendationPanel';

export default function TripOverviewTab({ trip, refreshTrip }) {
  const [showStopModal, setShowStopModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showPlaceModal, setShowPlaceModal] = useState(false);
  const [activeStopId, setActiveStopId] = useState(null);

  const [cities, setCities] = useState([]);
  const [citySearch, setCitySearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCityName, setSelectedCityName] = useState('');
  const [activities, setActivities] = useState([]);

  // Form states
  const [stopForm, setStopForm] = useState({ city_id: '', start_date: '', end_date: '' });
  const [activityForm, setActivityForm] = useState({ activity_id: '', activity_date: '', start_time: '', custom_cost: '' });
  const [placeForm, setPlaceForm] = useState({ custom_place_name: '', activity_date: '', start_time: '', custom_cost: '', notes: '' });

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

  const openActivityModal = (stopId, cityId) => {
    setActiveStopId(stopId);
    masterApi.getActivities(cityId).then(res => setActivities(res)).catch(console.error);
    setShowActivityModal(true);
  };

  const openPlaceModal = (stopId) => {
    setActiveStopId(stopId);
    setShowPlaceModal(true);
  };

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
      alert(err.response?.data?.detail || 'Error adding destination.');
    }
  };

  const handleDeleteStop = async (stopId) => {
    if (!window.confirm('Delete this destination?')) return;
    try {
      await tripsApi.deleteStop(trip.id, stopId);
      refreshTrip();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    try {
      await tripsApi.addActivity(activeStopId, {
        activity_id: parseInt(activityForm.activity_id),
        activity_date: activityForm.activity_date,
        start_time: activityForm.start_time || null,
        custom_cost: activityForm.custom_cost ? parseFloat(activityForm.custom_cost) : null
      });
      setShowActivityModal(false);
      setActivityForm({ activity_id: '', activity_date: '', start_time: '', custom_cost: '' });
      refreshTrip();
    } catch (err) {
      alert('Error adding activity. Ensure date is within stop boundaries.');
    }
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
      setPlaceForm({ custom_place_name: '', activity_date: '', start_time: '', custom_cost: '', notes: '' });
      refreshTrip();
    } catch (err) {
      alert('Error adding custom place. Ensure date is within stop boundaries.');
    }
  };

  const handleDeleteActivity = async (stopId, activityId) => {
    if (!window.confirm('Delete this activity?')) return;
    try {
      await tripsApi.deleteActivity(stopId, activityId);
      refreshTrip();
    } catch (err) {
      console.error(err);
    }
  };

  // Collect all place names already in any stop's activities (for exclusion)
  const allSelectedPlaceNames = useMemo(() => {
    const names = [];
    for (const stop of (trip.stops || [])) {
      for (const act of (stop.activities || [])) {
        if (act.custom_place_name) names.push(act.custom_place_name);
      }
    }
    return names;
  }, [trip.stops]);

  const tripDurationDays = useMemo(() => {
    if (!trip.start_date || !trip.end_date) return null;
    const diff = Math.round((new Date(trip.end_date) - new Date(trip.start_date)) / 86400000) + 1;
    return Math.max(1, diff);
  }, [trip.start_date, trip.end_date]);

  const filteredCities = cities.filter(c =>
    !citySearch || `${c.city} ${c.state}`.toLowerCase().includes(citySearch.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Destinations & Activities</h2>
        <button onClick={() => setShowStopModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-indigo-700">
          + Add Destination
        </button>
      </div>

      <p className="text-slate-700 mb-6">{trip.description || 'No description provided.'}</p>

      <div className="space-y-8">
        {(trip.stops || []).map(stop => {
          const stopDays = stop.start_date && stop.end_date
            ? Math.max(1, Math.round((new Date(stop.end_date) - new Date(stop.start_date)) / 86400000) + 1)
            : tripDurationDays;

          return (
            <div key={stop.id} className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg text-slate-800">
                    {stop.city?.city || 'Unknown'}
                    {stop.city?.state && <span className="font-normal text-slate-500 text-base">, {stop.city.state}</span>}
                  </h3>
                  <p className="text-sm text-slate-500">{stop.start_date} → {stop.end_date}</p>
                </div>
                <div className="flex space-x-3">
                  <button onClick={() => openPlaceModal(stop.id)} className="text-indigo-600 text-sm font-medium hover:underline">Add Place</button>
                  <button onClick={() => openActivityModal(stop.id, stop.city_id)} className="text-indigo-600 text-sm font-medium hover:underline ml-2">Add Activity</button>
                  <button onClick={() => handleDeleteStop(stop.id)} className="text-red-500 text-sm font-medium hover:underline ml-2">Remove</button>
                </div>
              </div>

              <div className="p-5">
                <div className="space-y-2 pl-4 border-l-2 border-slate-100">
                  {(stop.activities || []).length === 0 ? (
                    <p className="text-sm text-slate-400 italic">No activities added yet.</p>
                  ) : (
                    (stop.activities || []).map(act => (
                      <div key={act.id} className="flex justify-between items-center py-2">
                        <div>
                          <p className="font-medium text-slate-700">{act.custom_place_name || act.activity?.name}</p>
                          <p className="text-xs text-slate-500">{act.activity_date}{act.start_time ? ` at ${act.start_time}` : ''}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          {act.custom_cost !== null ? <span className="text-sm font-medium text-emerald-600">₹{act.custom_cost}</span> :
                           act.activity?.cost ? <span className="text-sm font-medium text-slate-500">₹{act.activity.cost}</span> : null}
                          <button onClick={() => handleDeleteActivity(stop.id, act.id)} className="text-red-400 hover:text-red-600">×</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Recommendation Panel per stop */}
                {stop.city_id && (
                  <RecommendationPanel
                    cityId={stop.city_id}
                    stopId={stop.id}
                    activityDate={stop.start_date}
                    interests={trip.interests}
                    budgetTier={trip.budget_tier}
                    tripDurationDays={stopDays}
                    excludePlaceNames={allSelectedPlaceNames}
                    onAdded={refreshTrip}
                  />
                )}
              </div>
            </div>
          );
        })}
        {(!trip.stops || trip.stops.length === 0) && (
          <div className="text-center py-10 bg-slate-50 rounded-lg border border-dashed border-slate-300">
            <p className="text-slate-500 font-medium">No destinations added yet.</p>
            <p className="text-slate-400 text-sm mt-1">Add a city to see personalized recommendations.</p>
          </div>
        )}
      </div>

      {/* Add Destination Modal */}
      {showStopModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Add Destination</h3>
            <form onSubmit={handleAddStop} className="space-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700">City</label>
                <input
                  type="text" placeholder="Type city name..." className="mt-1 w-full border rounded-md p-2 text-sm"
                  value={citySearch}
                  onChange={e => {
                    setCitySearch(e.target.value);
                    setStopForm({...stopForm, city_id: ''});
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                />
                {showSuggestions && cities.length > 0 && (
                  <ul className="absolute z-10 mt-1 w-full bg-white border border-slate-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {cities.map(c => (
                      <li key={c.id} className="px-4 py-2 hover:bg-indigo-50 cursor-pointer text-sm" onClick={() => selectCity(c)}>
                        {c.city}, {c.state}
                      </li>
                    ))}
                  </ul>
                )}
                {/* Hidden input to ensure native form validation triggers if no city selected */}
                <input type="text" required className="opacity-0 absolute h-0 w-0" value={stopForm.city_id} onChange={() => {}} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Start Date</label>
                  <input type="date" required className="mt-1 w-full border rounded-md p-2" value={stopForm.start_date} onChange={e => setStopForm({...stopForm, start_date: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">End Date</label>
                  <input type="date" required className="mt-1 w-full border rounded-md p-2" value={stopForm.end_date} onChange={e => setStopForm({...stopForm, end_date: e.target.value})} />
                </div>
              </div>
              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setShowStopModal(false)} className="text-slate-500 px-4 py-2">Cancel</button>
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Place Modal */}
      {showPlaceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Add Custom Place</h3>
            <form onSubmit={handleAddPlace} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Place Name</label>
                <input type="text" required className="mt-1 w-full border rounded-md p-2" placeholder="e.g. Baga Beach" value={placeForm.custom_place_name} onChange={e => setPlaceForm({...placeForm, custom_place_name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Date</label>
                <input type="date" required className="mt-1 w-full border rounded-md p-2" value={placeForm.activity_date} onChange={e => setPlaceForm({...placeForm, activity_date: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Time (Optional)</label>
                  <input type="time" className="mt-1 w-full border rounded-md p-2" value={placeForm.start_time} onChange={e => setPlaceForm({...placeForm, start_time: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Cost (₹)</label>
                  <input type="number" className="mt-1 w-full border rounded-md p-2" value={placeForm.custom_cost} onChange={e => setPlaceForm({...placeForm, custom_cost: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Notes</label>
                <input type="text" className="mt-1 w-full border rounded-md p-2" placeholder="e.g. Morning visit" value={placeForm.notes} onChange={e => setPlaceForm({...placeForm, notes: e.target.value})} />
              </div>
              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setShowPlaceModal(false)} className="text-slate-500 px-4 py-2">Cancel</button>
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium">Add Place</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Activity Modal */}
      {showActivityModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Add Activity</h3>
            <form onSubmit={handleAddActivity} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Activity</label>
                <select required className="mt-1 w-full border rounded-md p-2" value={activityForm.activity_id} onChange={e => setActivityForm({...activityForm, activity_id: e.target.value})}>
                  <option value="">Select an activity</option>
                  {activities.map(a => <option key={a.id} value={a.id}>{a.name} (₹{a.cost})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Date</label>
                <input type="date" required className="mt-1 w-full border rounded-md p-2" value={activityForm.activity_date} onChange={e => setActivityForm({...activityForm, activity_date: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Time (Optional)</label>
                <input type="time" className="mt-1 w-full border rounded-md p-2" value={activityForm.start_time} onChange={e => setActivityForm({...activityForm, start_time: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Custom Cost (Optional)</label>
                <input type="number" className="mt-1 w-full border rounded-md p-2" placeholder="Override default cost" value={activityForm.custom_cost} onChange={e => setActivityForm({...activityForm, custom_cost: e.target.value})} />
              </div>
              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setShowActivityModal(false)} className="text-slate-500 px-4 py-2">Cancel</button>
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
