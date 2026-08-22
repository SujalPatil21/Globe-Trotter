import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tripsApi } from '../api';

export default function TripCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', start_date: '', end_date: '', description: '', budget_limit: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await tripsApi.createTrip({
        ...formData,
        budget_limit: formData.budget_limit ? parseFloat(formData.budget_limit) : null
      });
      navigate(`/trips/${res.id}`);
    } catch (err) {
      alert("Error creating trip. Check dates.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">Plan a New Trip</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Trip Name</label>
            <input type="text" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border" required
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Start Date</label>
              <input type="date" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border" required
                value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">End Date</label>
              <input type="date" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border" required
                value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Budget Limit (optional)</label>
            <input type="number" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border" 
              value={formData.budget_limit} onChange={e => setFormData({...formData, budget_limit: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Description</label>
            <textarea className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border" rows="3"
              value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => navigate('/dashboard')} className="px-4 py-2 text-slate-600 font-medium">Cancel</button>
            <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700">Create Trip</button>
          </div>
        </form>
      </div>
    </div>
  );
}
