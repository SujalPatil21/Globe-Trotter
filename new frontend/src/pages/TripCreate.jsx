import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tripsApi } from '../api';
import AuthenticatedNav from '../components/AuthenticatedNav';

const INTEREST_OPTIONS = ['Heritage', 'Nature', 'Adventure', 'Food', 'Religious', 'Shopping'];
const TIER_OPTIONS = ['budget', 'mid-range', 'luxury'];

export default function TripCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', start_date: '', end_date: '', description: '', budget_limit: '', budget_tier: '', interests: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await tripsApi.createTrip({
        ...formData,
        budget_limit: formData.budget_limit ? parseFloat(formData.budget_limit) : null,
        budget_tier: formData.budget_tier || null,
        interests: formData.interests || null
      });
      navigate(`/trips/${res.id}`);
    } catch (err) {
      alert("Error creating trip. Check dates.");
    }
  };

  const toggleInterest = (interest) => {
    const current = formData.interests
      ? formData.interests.split(',').map(i => i.trim()).filter(Boolean)
      : [];
    const updated = current.includes(interest)
      ? current.filter(i => i !== interest)
      : [...current, interest];
    setFormData({ ...formData, interests: updated.join(',') });
  };

  return (
    <div className="min-h-screen bg-sand/20 pb-20">
      <div className="bg-charcoal h-32 relative">
        <AuthenticatedNav />
      </div>

      <main className="mx-auto max-w-4xl px-6 lg:px-10 mt-12">
        <header className="mb-12 text-center">
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-charcoal mb-4">Plan a New Trip</h1>
          <p className="text-lg text-charcoal/60">Start building your next adventure.</p>
        </header>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl shadow-charcoal/5 p-8 sm:p-12 border border-charcoal/5">
          {/* Section: Trip Details */}
          <div className="mb-10">
            <h3 className="font-display text-2xl font-semibold text-charcoal mb-6 pb-2 border-b border-charcoal/10">Trip Details</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold tracking-wide text-charcoal/70 mb-2 uppercase">Trip Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="E.g., Summer in Kerala"
                  className="w-full bg-sand/20 border border-charcoal/10 rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all"
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold tracking-wide text-charcoal/70 mb-2 uppercase">Start Date</label>
                  <input 
                    type="date" 
                    required
                    className="w-full bg-sand/20 border border-charcoal/10 rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-gold transition-all"
                    value={formData.start_date} 
                    onChange={e => setFormData({...formData, start_date: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold tracking-wide text-charcoal/70 mb-2 uppercase">End Date</label>
                  <input 
                    type="date" 
                    required
                    className="w-full bg-sand/20 border border-charcoal/10 rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-gold transition-all"
                    value={formData.end_date} 
                    onChange={e => setFormData({...formData, end_date: e.target.value})} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Budget & Preferences */}
          <div className="mb-10">
            <h3 className="font-display text-2xl font-semibold text-charcoal mb-6 pb-2 border-b border-charcoal/10">Budget & Preferences</h3>
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-semibold tracking-wide text-charcoal/70 mb-2 uppercase">Budget Limit (₹)</label>
                <input 
                  type="number" 
                  placeholder="Optional total budget limit"
                  className="w-full bg-sand/20 border border-charcoal/10 rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-gold transition-all"
                  value={formData.budget_limit} 
                  onChange={e => setFormData({...formData, budget_limit: e.target.value})} 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold tracking-wide text-charcoal/70 mb-3 uppercase">Travel Style (Budget Tier)</label>
                <div className="flex flex-wrap gap-3">
                  {TIER_OPTIONS.map(tier => (
                    <button 
                      key={tier} 
                      type="button"
                      onClick={() => setFormData({...formData, budget_tier: formData.budget_tier === tier ? '' : tier})}
                      className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all capitalize border ${
                        formData.budget_tier === tier
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
                    const current = formData.interests ? formData.interests.split(',').map(i => i.trim()) : [];
                    const selected = current.includes(interest);
                    return (
                      <button 
                        key={interest} 
                        type="button" 
                        onClick={() => toggleInterest(interest)}
                        className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${
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
            </div>
          </div>

          {/* Section: Description */}
          <div className="mb-10">
            <h3 className="font-display text-2xl font-semibold text-charcoal mb-6 pb-2 border-b border-charcoal/10">About this Trip</h3>
            <div>
              <label className="block text-sm font-semibold tracking-wide text-charcoal/70 mb-2 uppercase">Description / Notes</label>
              <textarea 
                placeholder="What is the purpose of this trip? Any special plans?"
                className="w-full bg-sand/20 border border-charcoal/10 rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-gold transition-all resize-none h-32"
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-charcoal/10">
            <button 
              type="button" 
              onClick={() => navigate('/dashboard')} 
              className="px-6 py-3 text-charcoal font-semibold hover:bg-sand/30 rounded-full transition-colors text-center"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="bg-gold text-charcoal px-8 py-3 rounded-full font-semibold shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5 hover:bg-gold-light transition-all text-center"
            >
              Create Trip
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
