import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Calendar, Heart, Copy, User, ArrowLeft, Globe, Compass } from 'lucide-react';
import { usersApi, communityApi } from '../api';
import AuthenticatedNav from '../components/AuthenticatedNav';
import { resolveCityImage, FALLBACK_IMAGE } from '../utils/imageResolver';

export default function PublicProfile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    usersApi.getPublicProfile(username)
      .then(res => setProfile(res))
      .catch(err => setError(err?.response?.data?.detail || 'Profile not found'))
      .finally(() => setLoading(false));
  }, [username]);

  const handleCloneTrip = async (expId) => {
    try {
      const res = await communityApi.copyExperience(expId);
      navigate(`/trips/${res.new_trip_id}`);
    } catch {
      alert('Error cloning trip. Please try again.');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-sand/20 flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-gold border-t-transparent rounded-full" />
    </div>
  );

  if (error || !profile) return (
    <div className="min-h-screen bg-sand/20 flex flex-col items-center justify-center gap-4">
      <User className="w-16 h-16 text-charcoal/20" />
      <p className="font-display text-2xl text-charcoal/50">{error || 'Profile not found'}</p>
      <Link to="/community" className="text-sm font-semibold text-pine hover:text-gold transition-colors">
        ← Back to Community
      </Link>
    </div>
  );

  const initials = profile.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : profile.username.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-sand/20 flex flex-col">
      <AuthenticatedNav />

      {/* Profile Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-24 bg-charcoal">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2000&auto=format&fit=crop"
            alt="Travel background"
            className="w-full h-full object-cover object-[50%_15%] opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/60 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <Link to="/community" className="inline-flex items-center gap-2 text-gold-light hover:text-gold transition-colors mb-8 text-sm font-semibold tracking-wide uppercase">
            <ArrowLeft className="w-4 h-4" /> Back to Community
          </Link>

          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-8">
            {/* Avatar */}
            <div className="shrink-0">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="w-24 h-24 lg:w-32 lg:h-32 rounded-full object-cover border-4 border-white/20 shadow-2xl"
                />
              ) : (
                <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-gold/20 border-4 border-white/20 flex items-center justify-center shadow-2xl">
                  <span className="font-display text-3xl lg:text-4xl font-bold text-gold-light">{initials}</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 pb-2">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold mb-2">Travel Creator</p>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-2">{profile.full_name}</h1>
              <p className="text-white/60 font-medium mb-4">@{profile.username}</p>
              <div className="flex flex-wrap gap-4 text-sm font-medium text-white/70">
                <span className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-gold-light" />
                  Member since {profile.member_since}
                </span>
                <span className="flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-gold-light" />
                  {profile.experience_count} {profile.experience_count === 1 ? 'Experience' : 'Experiences'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experiences Grid */}
      <main className="flex-grow mx-auto max-w-7xl px-6 lg:px-10 py-16 w-full">
        {profile.experiences.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center border border-charcoal/5 shadow-sm">
            <Compass className="w-12 h-12 text-charcoal/20 mx-auto mb-4" />
            <h3 className="font-display text-2xl font-bold text-charcoal mb-2">No published experiences yet</h3>
            <p className="text-charcoal/50 font-medium">This traveler hasn't shared any trips with the community.</p>
          </div>
        ) : (
          <>
            <h2 className="font-display text-3xl font-bold text-charcoal mb-8">
              Published Experiences
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {profile.experiences.map(exp => {
                const coverImage = exp.cover_image || resolveCityImage(exp.cities?.[0]);
                return (
                  <article
                    key={exp.id}
                    className="group bg-white rounded-3xl shadow-lg shadow-charcoal/5 border border-charcoal/5 overflow-hidden flex flex-col hover:shadow-xl hover:shadow-charcoal/10 transition-all duration-300"
                  >
                    {/* Card Image */}
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={coverImage}
                        alt={exp.trip_name}
                        className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                        onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent" />

                      <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                        <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold border border-white/20">
                          {exp.duration} Days
                        </span>
                        {exp.budget_tier && (
                          <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold border border-white/20 capitalize">
                            {exp.budget_tier}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="font-display text-xl font-bold text-charcoal mb-3 line-clamp-2">
                        {exp.trip_name}
                      </h3>

                      <div className="space-y-2 text-sm text-charcoal/60 mb-6 flex-1">
                        {exp.cities?.length > 0 && (
                          <p className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-gold" />
                            <span className="line-clamp-2">{exp.cities.join(', ')}</span>
                          </p>
                        )}
                        {exp.interests && (
                          <p className="flex items-start gap-2">
                            <Compass className="w-4 h-4 shrink-0 mt-0.5 text-gold" />
                            <span className="line-clamp-1">{exp.interests}</span>
                          </p>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="pt-4 border-t border-charcoal/5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 text-xs font-bold text-charcoal/40 uppercase tracking-widest">
                          <span className="flex items-center gap-1">
                            <Heart className="w-3.5 h-3.5" /> {exp.like_count}
                          </span>
                          <span className="flex items-center gap-1">
                            <Copy className="w-3.5 h-3.5" /> {exp.copy_count}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Link
                            to={`/community/experiences/${exp.id}`}
                            className="px-4 py-2 rounded-full text-sm font-bold text-charcoal bg-sand/30 hover:bg-sand/60 transition-colors"
                          >
                            View
                          </Link>
                          <button
                            onClick={() => handleCloneTrip(exp.id)}
                            className="px-4 py-2 rounded-full text-sm font-bold bg-charcoal text-white hover:-translate-y-0.5 hover:shadow-lg transition-all"
                          >
                            Clone
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
