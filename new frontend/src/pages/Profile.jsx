import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Settings, Heart, LogOut, AlertTriangle, ArrowLeft } from 'lucide-react';
import { authApi, savedDestinationsApi, masterApi } from '../api';
import AuthenticatedNav from '../components/AuthenticatedNav';
import { resolveCityImage } from '../utils/imageResolver';
import { useToast, ToastContainer } from '../components/Toast';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [profileForm, setProfileForm] = useState({ full_name: '', language: 'en', avatar_url: '' });
  const { toasts, showToast, removeToast } = useToast();
  
  const [savedDestinations, setSavedDestinations] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [cityToAdd, setCityToAdd] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await authApi.getMe();
        if (userRes?.data?.user) {
          const u = userRes.data.user;
          setUser(u);
          setProfileForm({
            full_name: u.full_name || '',
            language: u.language || 'en',
            avatar_url: u.avatar_url || ''
          });
        }
        
        const destRes = await savedDestinationsApi.getSavedDestinations();
        setSavedDestinations(destRes || []);
        
        const citiesRes = await masterApi.getCities();
        setAllCities(citiesRes || []);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await authApi.updateMe(profileForm);
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      showToast('Error updating profile. Please try again.', 'error');
    }
  };

  const handleAddDestination = async (e) => {
    e.preventDefault();
    if (!cityToAdd) return;
    try {
      await savedDestinationsApi.saveDestination(cityToAdd);
      const destRes = await savedDestinationsApi.getSavedDestinations();
      setSavedDestinations(destRes || []);
      setCityToAdd('');
    } catch (err) {
      alert("Error saving destination.");
    }
  };

  const handleRemoveDestination = async (cityId) => {
    try {
      await savedDestinationsApi.removeDestination(cityId);
      setSavedDestinations(prev => prev.filter(d => d.city_id !== cityId));
    } catch (err) {
      alert("Error removing destination.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to permanently delete your account? This action cannot be undone.")) {
      try {
        await authApi.deleteMe();
        localStorage.removeItem('access_token');
        navigate('/login');
      } catch (err) {
        alert("Failed to delete account.");
      }
    }
  };

  if (loading) return <div className="min-h-screen bg-sand/20 flex items-center justify-center font-display text-2xl text-charcoal/50">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-sand/20 flex flex-col">
      <AuthenticatedNav />

      {/* Header Spacer */}
      <div className="bg-charcoal pt-32 pb-16 lg:pt-40 lg:pb-24">
         <div className="mx-auto max-w-5xl px-6 lg:px-10">
            <Link to="/dashboard" className="inline-flex items-center gap-2 text-gold-light hover:text-gold transition-colors mb-6 text-sm font-semibold tracking-wide uppercase">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-2">Your Profile</h1>
            <p className="text-white/70 font-medium text-lg">Manage your settings and saved places.</p>
         </div>
      </div>

      <main className="flex-grow mx-auto max-w-5xl px-6 lg:px-10 -mt-8 pb-20 w-full space-y-8">
        
        {/* Profile Card */}
        <section className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl shadow-charcoal/5 border border-charcoal/5 flex flex-col md:flex-row gap-12 relative z-10">
          <div className="md:w-1/3 flex flex-col items-center text-center">
            <div className="w-40 h-40 rounded-full overflow-hidden bg-sand/50 mb-6 flex items-center justify-center text-5xl font-bold text-charcoal shadow-inner border-4 border-white">
              {profileForm.avatar_url ? (
                <img src={profileForm.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{(user?.username || 'U')[0].toUpperCase()}</span>
              )}
            </div>
            <h2 className="font-display text-2xl font-bold text-charcoal mb-1">@{user?.username}</h2>
            <p className="text-sm font-bold text-charcoal/50 uppercase tracking-widest mb-6">{user?.role || 'Traveler'}</p>
            
            <button 
              onClick={handleLogout}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-sand/30 hover:bg-sand/60 text-charcoal rounded-full font-bold transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
          
          <div className="md:w-2/3 border-t md:border-t-0 md:border-l border-charcoal/10 pt-8 md:pt-0 md:pl-12">
            <div className="flex items-center gap-3 mb-8">
              <Settings className="w-6 h-6 text-charcoal/50" />
              <h3 className="font-display text-2xl font-bold text-charcoal">Account Settings</h3>
            </div>
            
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-charcoal/50 uppercase tracking-widest mb-2">Email Address</label>
                <input type="email" disabled className="w-full bg-sand/20 border border-transparent rounded-xl px-4 py-3 text-charcoal/50 cursor-not-allowed" value={user?.email || ''} />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-charcoal/50 uppercase tracking-widest mb-2">Full Name</label>
                <input type="text" className="w-full bg-white border border-charcoal/10 rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-gold transition-all" value={profileForm.full_name} onChange={e => setProfileForm({...profileForm, full_name: e.target.value})} />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-charcoal/50 uppercase tracking-widest mb-2">Avatar URL (Optional)</label>
                <input type="url" placeholder="https://example.com/avatar.jpg" className="w-full bg-white border border-charcoal/10 rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-gold transition-all" value={profileForm.avatar_url} onChange={e => setProfileForm({...profileForm, avatar_url: e.target.value})} />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-charcoal/50 uppercase tracking-widest mb-2">Language Preference</label>
                <select className="w-full bg-white border border-charcoal/10 rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-gold transition-all appearance-none" value={profileForm.language} onChange={e => setProfileForm({...profileForm, language: e.target.value})}>
                  <option value="en">English (US)</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                </select>
              </div>
              
              <div className="pt-4 text-right">
                <button type="submit" className="bg-charcoal text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-black/10 hover:-translate-y-0.5 hover:shadow-xl transition-all">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Saved Destinations */}
        <section className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl shadow-charcoal/5 border border-charcoal/5">
          <div className="flex items-center gap-3 mb-8">
            <Heart className="w-6 h-6 text-red-500" />
            <h3 className="font-display text-2xl font-bold text-charcoal">Saved Destinations</h3>
          </div>
          
          <form onSubmit={handleAddDestination} className="flex flex-col sm:flex-row gap-4 mb-10">
            <select required className="flex-grow bg-sand/20 border border-charcoal/10 rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-gold transition-all appearance-none" value={cityToAdd} onChange={e => setCityToAdd(e.target.value)}>
              <option value="">Select a city to save for later...</option>
              {allCities.map(c => <option key={c.id} value={c.id}>{c.city}, {c.state}</option>)}
            </select>
            <button type="submit" className="shrink-0 bg-gold text-charcoal px-8 py-3 rounded-full font-bold shadow-md hover:-translate-y-0.5 hover:shadow-lg hover:bg-gold-light transition-all">
              Save Place
            </button>
          </form>

          {savedDestinations.length === 0 ? (
            <div className="text-center py-12 bg-sand/20 rounded-2xl border border-charcoal/10 border-dashed">
              <p className="text-charcoal/50 font-medium">You haven't saved any destinations yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {savedDestinations.map(sd => {
                const cityName = sd.city?.city || 'Unknown';
                const image = resolveCityImage(cityName);
                
                return (
                  <div key={sd.id} className="group relative h-48 rounded-2xl overflow-hidden shadow-sm border border-charcoal/5">
                    <img src={image} alt={cityName} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-transparent"></div>
                    
                    <button 
                      onClick={() => handleRemoveDestination(sd.city_id)} 
                      className="absolute top-3 right-3 w-8 h-8 bg-white/20 hover:bg-red-500 text-white backdrop-blur-md rounded-full flex items-center justify-center transition-colors"
                      title="Remove from saved"
                    >
                      &times;
                    </button>
                    
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <h4 className="font-display text-xl font-bold text-white mb-1">{cityName}</h4>
                      <p className="text-white/70 text-sm font-medium">{sd.city?.state}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Danger Zone */}
        <section className="bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-red-100 bg-red-50/30">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <h3 className="font-display text-2xl font-bold text-red-600">Danger Zone</h3>
          </div>
          <p className="text-charcoal/70 font-medium mb-6">
            Once you delete your account, there is no going back. All your trips, budgets, and saved destinations will be permanently erased. Please be certain.
          </p>
          <button 
            onClick={handleDeleteAccount} 
            className="bg-red-100 hover:bg-red-200 text-red-600 px-6 py-3 rounded-full font-bold transition-colors"
          >
            Permanently Delete Account
          </button>
        </section>

      </main>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
