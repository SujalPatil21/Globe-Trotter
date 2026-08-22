import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { tripsApi } from '../api';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    tripsApi.getDashboard().then(res => setData(res)).catch(() => navigate('/login'));
  }, [navigate]);

  if (!data) return <div className="p-10 text-center">Loading dashboard...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">GlobeTrotter Dashboard</h1>
        <div className="flex gap-4 items-center">
          <Link to="/profile" className="text-slate-600 font-medium hover:text-indigo-600">
            Profile Settings
          </Link>
          <Link to="/trips/create" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700">
            Plan New Trip
          </Link>
        </div>
      </header>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 text-slate-700">Upcoming Trips</h2>
        {data.upcoming_trips.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-slate-500 text-center">
            No upcoming trips. Time to plan one!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.upcoming_trips.map(trip => (
              <div key={trip.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition">
                {trip.cover_image && <img src={trip.cover_image} alt="Cover" className="w-full h-40 object-cover" />}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{trip.name}</h3>
                  <p className="text-sm text-slate-500">{trip.start_date} to {trip.end_date}</p>
                  <Link to={`/trips/${trip.id}`} className="mt-4 block text-indigo-600 font-medium hover:underline">View Trip &rarr;</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 text-slate-700">Recommended Destinations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.recommended_destinations.map(city => (
            <div key={city.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
              <img src={city.image_url} alt={city.name} className="w-full h-48 object-cover brightness-75" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-bold text-xl">{city.name}</h3>
                <p className="text-sm">{city.country}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
