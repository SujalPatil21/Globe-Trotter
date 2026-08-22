import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Settings, Share, ArrowLeft } from 'lucide-react';
import { tripsApi } from '../api';
import AuthenticatedNav from '../components/AuthenticatedNav';
import TripOverviewTab from '../components/trip/TripOverviewTab';
import TripItineraryTab from '../components/trip/TripItineraryTab';
import TripBudgetTab from '../components/trip/TripBudgetTab';
import { resolveCityImage } from '../utils/imageResolver';

const INTEREST_OPTIONS = ['Heritage', 'Nature', 'Adventure', 'Food', 'Religious', 'Shopping'];
const TIER_OPTIONS = ['budget', 'mid-range', 'luxury'];

export default function TripWorkspace() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [budget, setBudget] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const [showEditTripModal, setShowEditTripModal] = useState(false);
  const [editTripForm, setEditTripForm] = useState({});

  const refreshTrip = useCallback(() => {
    tripsApi.getTrip(tripId).then(res => setTrip(res)).catch(console.error);
    tripsApi.getBudget(tripId).then(res => setBudget(res)).catch(console.error);
  }, [tripId]);

  useEffect(() => {
    refreshTrip();
  }, [refreshTrip]);

  const handlePublishToggle = async () => {
    try {
      if (trip.is_published) {
        await tripsApi.unpublishTrip(tripId);
        setTrip({ ...trip, is_published: false });
      } else {
        await tripsApi.publishTrip(tripId);
        setTrip({ ...trip, is_published: true });
      }
    } catch (err) {
      alert('Error changing publish status');
    }
  };

  const openEditTrip = () => {
    setEditTripForm({
      name: trip.name,
      start_date: trip.start_date,
      end_date: trip.end_date,
      budget_limit: trip.budget_limit || '',
      description: trip.description || '',
      interests: trip.interests || '',
      budget_tier: trip.budget_tier || '',
    });
    setShowEditTripModal(true);
  };

  const handleUpdateTrip = async (e) => {
    e.preventDefault();
    try {
      await tripsApi.updateTrip(trip.id, {
        ...editTripForm,
        budget_limit: editTripForm.budget_limit ? parseFloat(editTripForm.budget_limit) : null,
        interests: editTripForm.interests || null,
        budget_tier: editTripForm.budget_tier || null,
      });
      setShowEditTripModal(false);
      refreshTrip();
    } catch (err) {
      alert('Error updating trip. Check dates.');
    }
  };

  const toggleInterest = (interest) => {
    const current = editTripForm.interests
      ? editTripForm.interests.split(',').map(i => i.trim()).filter(Boolean)
      : [];
    const updated = current.includes(interest)
      ? current.filter(i => i !== interest)
      : [...current, interest];
    setEditTripForm({ ...editTripForm, interests: updated.join(',') });
  };

  if (!trip) return <div className="min-h-screen bg-sand/20 flex items-center justify-center font-display text-2xl text-charcoal/50">Loading trip details...</div>;

  const selectedInterests = trip.interests ? trip.interests.split(',').map(i => i.trim()).filter(Boolean) : [];
  
  // Use first stop's city for the hero image, or fallback
  const firstCity = trip.stops && trip.stops.length > 0 ? trip.stops[0].city?.city : null;
  const heroImage = resolveCityImage(firstCity);

  return (
    <div className="min-h-screen bg-sand/20 flex flex-col">
      <AuthenticatedNav />

      {/* Hero Header */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 bg-charcoal">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt={trip.name} 
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/70 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <Link to="/dashboard#trips" className="inline-flex items-center gap-2 text-gold-light hover:text-gold transition-colors mb-6 text-sm font-semibold tracking-wide uppercase">
            <ArrowLeft className="w-4 h-4" /> Back to Trips
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
                {trip.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-white/80 mb-6 font-medium">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gold" />
                  <span>{trip.start_date} &mdash; {trip.end_date}</span>
                </div>
                {trip.budget_tier && (
                  <span className="bg-white/10 px-3 py-1 rounded-full text-sm capitalize backdrop-blur-sm border border-white/10">
                    {trip.budget_tier}
                  </span>
                )}
                {selectedInterests.length > 0 && (
                  <span className="hidden sm:inline-block px-3 py-1 rounded-full text-sm bg-white/10 backdrop-blur-sm border border-white/10">
                    {selectedInterests.join(', ')}
                  </span>
                )}
              </div>
              
              {trip.description && (
                <p className="text-white/70 text-lg max-w-2xl leading-relaxed">
                  {trip.description}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <button 
                onClick={openEditTrip} 
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full font-semibold transition-colors backdrop-blur-sm border border-white/20"
              >
                <Settings className="w-4 h-4" /> Edit Settings
              </button>
              <button 
                onClick={handlePublishToggle} 
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold transition-colors shadow-lg ${
                  trip.is_published 
                    ? 'bg-gold-light text-charcoal hover:bg-gold'
                    : 'bg-gold text-charcoal hover:bg-gold-light'
                }`}
              >
                <Share className="w-4 h-4" /> {trip.is_published ? 'Published' : 'Publish'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="bg-charcoal border-b border-white/10 sticky top-0 z-20 shadow-md">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <nav className="flex space-x-8 overflow-x-auto hide-scrollbar">
            {['overview', 'itinerary', 'budget', 'timeline'].map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap py-4 px-2 border-b-2 font-semibold tracking-wide uppercase text-sm transition-colors ${
                  activeTab === tab 
                    ? 'border-gold text-gold' 
                    : 'border-transparent text-white/50 hover:text-white/80 hover:border-white/30'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Workspace Content */}
      <main className="flex-grow mx-auto max-w-7xl px-6 lg:px-10 py-12 w-full">
        {activeTab === 'overview' && <TripOverviewTab trip={trip} refreshTrip={refreshTrip} />}
        {activeTab === 'itinerary' && <TripItineraryTab trip={trip} refreshTrip={refreshTrip} />}
        {activeTab === 'budget' && <TripBudgetTab trip={trip} budget={budget} refreshTrip={refreshTrip} />}
        
        {activeTab === 'timeline' && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl shadow-charcoal/5 border border-charcoal/5">
            <h2 className="font-display text-3xl font-bold text-charcoal mb-10">Visual Timeline</h2>
            <div className="space-y-12">
              {(trip.stops || []).map(stop => (
                <div key={stop.id} className="relative pl-8 sm:pl-12 border-l-2 border-gold/30 pb-4">
                  <div className="absolute w-4 h-4 bg-gold rounded-full -left-[9px] top-1.5 shadow-[0_0_0_4px_rgba(255,255,255,1)]"></div>
                  
                  <div className="mb-6">
                    <h3 className="font-display text-2xl font-bold text-charcoal mb-1">
                      {stop.city?.city || 'Unknown'}{stop.city?.state ? `, ${stop.city.state}` : ''}
                    </h3>
                    <p className="text-charcoal/50 font-semibold text-sm uppercase tracking-wider">{stop.start_date} &mdash; {stop.end_date}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(stop.activities || []).map(act => (
                      <div key={act.id} className="bg-sand/20 p-4 rounded-2xl border border-charcoal/5 hover:border-gold/50 transition-colors">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-xs font-bold bg-white px-2 py-1 rounded text-charcoal/60 shadow-sm">
                            {act.start_time ? act.start_time.substring(0, 5) : 'Anytime'}
                          </span>
                          <span className="text-xs font-medium text-charcoal/40">{act.activity_date}</span>
                        </div>
                        <div className="font-bold text-charcoal">{act.custom_place_name || act.activity?.name}</div>
                      </div>
                    ))}
                    {(!stop.activities || stop.activities.length === 0) && (
                      <div className="text-charcoal/40 italic text-sm py-2">No activities scheduled yet.</div>
                    )}
                  </div>
                </div>
              ))}
              {(!trip.stops || trip.stops.length === 0) && (
                <div className="text-center py-12 bg-sand/20 rounded-3xl border border-dashed border-charcoal/20">
                  <p className="text-charcoal/50 font-medium">No destinations added yet.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Edit Modal */}
      {showEditTripModal && (
        <div className="fixed inset-0 bg-charcoal/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <h3 className="font-display text-3xl font-bold text-charcoal mb-8 pb-4 border-b border-charcoal/10">Edit Trip Settings</h3>
            <form onSubmit={handleUpdateTrip} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold tracking-wide text-charcoal/70 mb-2 uppercase">Trip Name</label>
                <input type="text" required className="w-full bg-sand/20 border border-charcoal/10 rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-gold transition-all" value={editTripForm.name} onChange={e => setEditTripForm({...editTripForm, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold tracking-wide text-charcoal/70 mb-2 uppercase">Start Date</label>
                  <input type="date" required className="w-full bg-sand/20 border border-charcoal/10 rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-gold transition-all" value={editTripForm.start_date} onChange={e => setEditTripForm({...editTripForm, start_date: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold tracking-wide text-charcoal/70 mb-2 uppercase">End Date</label>
                  <input type="date" required className="w-full bg-sand/20 border border-charcoal/10 rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-gold transition-all" value={editTripForm.end_date} onChange={e => setEditTripForm({...editTripForm, end_date: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold tracking-wide text-charcoal/70 mb-2 uppercase">Budget Limit (₹)</label>
                <input type="number" className="w-full bg-sand/20 border border-charcoal/10 rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-gold transition-all" value={editTripForm.budget_limit} onChange={e => setEditTripForm({...editTripForm, budget_limit: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold tracking-wide text-charcoal/70 mb-3 uppercase">Travel Style</label>
                <div className="flex flex-wrap gap-3">
                  {TIER_OPTIONS.map(tier => (
                    <button key={tier} type="button"
                      onClick={() => setEditTripForm({...editTripForm, budget_tier: editTripForm.budget_tier === tier ? '' : tier})}
                      className={`px-5 py-2 rounded-full text-sm font-semibold transition-all capitalize border ${
                        editTripForm.budget_tier === tier
                          ? 'bg-charcoal text-white border-charcoal shadow-md'
                          : 'bg-white text-charcoal/70 border-charcoal/20 hover:border-charcoal/40 hover:text-charcoal'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold tracking-wide text-charcoal/70 mb-3 uppercase">Travel Interests</label>
                <div className="flex flex-wrap gap-3">
                  {INTEREST_OPTIONS.map(interest => {
                    const current = editTripForm.interests ? editTripForm.interests.split(',').map(i => i.trim()) : [];
                    const selected = current.includes(interest);
                    return (
                      <button key={interest} type="button" onClick={() => toggleInterest(interest)}
                        className={`px-5 py-2 rounded-full text-sm font-semibold transition-all border ${
                          selected
                            ? 'bg-charcoal text-white border-charcoal shadow-md'
                            : 'bg-white text-charcoal/70 border-charcoal/20 hover:border-charcoal/40 hover:text-charcoal'
                        }`}
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold tracking-wide text-charcoal/70 mb-2 uppercase">Description</label>
                <textarea className="w-full bg-sand/20 border border-charcoal/10 rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-gold transition-all resize-none h-24" value={editTripForm.description} onChange={e => setEditTripForm({...editTripForm, description: e.target.value})} />
              </div>
              <div className="pt-6 flex justify-end gap-4 border-t border-charcoal/10">
                <button type="button" onClick={() => setShowEditTripModal(false)} className="px-6 py-3 text-charcoal font-semibold hover:bg-sand/30 rounded-full transition-colors">Cancel</button>
                <button type="submit" className="bg-gold text-charcoal px-8 py-3 rounded-full font-semibold shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-0.5 transition-all">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
