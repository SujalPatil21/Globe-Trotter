import { useState } from 'react';
import { IndianRupee, PieChart, Plus, Trash2, Edit2, TrendingUp, TrendingDown, Target } from 'lucide-react';
import { tripsApi } from '../../api';
import BudgetReferencePanel from './BudgetReferencePanel';

export default function TripBudgetTab({ trip, budget, refreshTrip }) {
  const [isEditingLimit, setIsEditingLimit] = useState(false);
  const [budgetLimit, setBudgetLimit] = useState(budget?.budget_limit || '');

  const [expenseForm, setExpenseForm] = useState({ category: 'OTHER', amount: '', description: '', expense_date: '' });
  const [isAddingExpense, setIsAddingExpense] = useState(false);

  const handleUpdateLimit = async (e) => {
    e.preventDefault();
    try {
      await tripsApi.updateTrip(trip.id, { budget_limit: parseFloat(budgetLimit) });
      setIsEditingLimit(false);
      refreshTrip();
    } catch (err) {
      alert('Error updating budget limit');
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      await tripsApi.addExpense(trip.id, {
        ...expenseForm,
        amount: parseFloat(expenseForm.amount)
      });
      setIsAddingExpense(false);
      setExpenseForm({ category: 'OTHER', amount: '', description: '', expense_date: '' });
      refreshTrip();
    } catch (err) {
      alert('Error adding expense');
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await tripsApi.deleteExpense(trip.id, expenseId);
        refreshTrip();
      } catch (err) {
        alert('Error deleting expense');
      }
    }
  };

  if (!budget) return <div className="text-center py-12 text-charcoal/50 font-medium text-lg">Loading budget...</div>;

  const pct = budget.budget_limit ? Math.min((budget.grand_total / budget.budget_limit) * 100, 100) : 0;
  const isOver = budget.is_over_budget;

  return (
    <div className="space-y-12">
      {/* ── Actual user budget ── */}
      <section className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl shadow-charcoal/5 border border-charcoal/5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
          <div>
            <h2 className="font-display text-3xl font-bold text-charcoal">Travel Finance</h2>
            <p className="text-charcoal/60 font-medium mt-1">Track your spending against your goals.</p>
          </div>
          
          {!isEditingLimit ? (
            <button onClick={() => setIsEditingLimit(true)} className="inline-flex items-center gap-2 bg-sand/30 hover:bg-sand/60 text-charcoal px-5 py-2.5 rounded-full text-sm font-semibold transition-colors border border-charcoal/5">
              <Target className="w-4 h-4" /> Edit Budget Goal
            </button>
          ) : (
            <form onSubmit={handleUpdateLimit} className="flex flex-wrap gap-3 items-center bg-sand/20 p-2 rounded-full border border-charcoal/10">
              <input type="number" required placeholder="New Limit" className="bg-white rounded-full px-4 py-2 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-gold" value={budgetLimit} onChange={e => setBudgetLimit(e.target.value)} />
              <button type="submit" className="bg-charcoal text-white px-4 py-2 rounded-full text-sm font-semibold">Save</button>
              <button type="button" onClick={() => setIsEditingLimit(false)} className="text-charcoal/60 text-sm font-semibold px-2 hover:text-charcoal transition-colors">Cancel</button>
            </form>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-sand/20 p-6 rounded-2xl border border-charcoal/5 flex flex-col justify-between h-32">
            <div className="text-charcoal/50 text-xs font-bold uppercase tracking-widest">Budget Goal</div>
            <div className="text-3xl font-display font-bold text-charcoal">
              {budget.budget_limit ? `₹${budget.budget_limit.toLocaleString()}` : 'Not set'}
            </div>
          </div>
          <div className="bg-sand/20 p-6 rounded-2xl border border-charcoal/5 flex flex-col justify-between h-32">
            <div className="text-charcoal/50 text-xs font-bold uppercase tracking-widest">Total Spent</div>
            <div className="text-3xl font-display font-bold text-charcoal">₹{budget.grand_total.toLocaleString()}</div>
          </div>
          <div className="bg-sand/20 p-6 rounded-2xl border border-charcoal/5 flex flex-col justify-between h-32 relative overflow-hidden">
            <div className="relative z-10">
              <div className="text-charcoal/50 text-xs font-bold uppercase tracking-widest">Remaining</div>
              <div className={`text-3xl font-display font-bold ${isOver ? 'text-red-500' : 'text-emerald-600'}`}>
                {budget.budget_limit ? `₹${Math.abs(budget.budget_limit - budget.grand_total).toLocaleString()}` : 'N/A'}
              </div>
            </div>
            {budget.budget_limit && (
              <div className="absolute right-4 bottom-4 opacity-20">
                {isOver ? <TrendingDown className="w-12 h-12 text-red-500" /> : <TrendingUp className="w-12 h-12 text-emerald-600" />}
              </div>
            )}
          </div>
          <div className="bg-sand/20 p-6 rounded-2xl border border-charcoal/5 flex flex-col justify-between h-32">
            <div className="text-charcoal/50 text-xs font-bold uppercase tracking-widest">Avg / Day</div>
            <div className="text-3xl font-display font-bold text-charcoal">₹{budget.average_per_day.toLocaleString()}</div>
          </div>
        </div>

        {budget.budget_limit && (
          <div className="mb-2">
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold text-charcoal text-sm uppercase tracking-wider">Budget Usage</span>
              <span className={`font-bold text-lg ${isOver ? 'text-red-500' : 'text-emerald-600'}`}>
                {pct.toFixed(1)}% {isOver && '(Over)'}
              </span>
            </div>
            <div className="w-full bg-sand/30 rounded-full h-4 overflow-hidden border border-charcoal/5">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ease-out ${isOver ? 'bg-red-500' : 'bg-emerald-500'}`} 
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-8 rounded-3xl shadow-xl shadow-charcoal/5 border border-charcoal/5 h-fit">
          <div className="flex items-center gap-3 mb-8">
            <PieChart className="w-6 h-6 text-gold-dark" />
            <h3 className="font-display text-2xl font-bold text-charcoal">Breakdown</h3>
          </div>
          
          <div className="space-y-5 text-sm font-medium">
            <div className="flex justify-between items-center pb-3 border-b border-charcoal/5">
              <span className="text-charcoal/60">Activities (Auto)</span>
              <span className="text-charcoal font-bold">₹{budget.activity_total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-charcoal/5">
              <span className="text-charcoal/60">Transport</span>
              <span className="text-charcoal font-bold">₹{budget.transport_total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-charcoal/5">
              <span className="text-charcoal/60">Accommodation</span>
              <span className="text-charcoal font-bold">₹{budget.accommodation_total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-charcoal/5">
              <span className="text-charcoal/60">Meals</span>
              <span className="text-charcoal font-bold">₹{budget.meal_total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-charcoal/5">
              <span className="text-charcoal/60">Other</span>
              <span className="text-charcoal font-bold">₹{budget.other_total.toLocaleString()}</span>
            </div>
            <div className="pt-4 flex justify-between items-center text-lg font-bold text-charcoal">
              <span>Total</span>
              <span className="text-gold-dark">₹{budget.grand_total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-xl shadow-charcoal/5 border border-charcoal/5">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-display text-2xl font-bold text-charcoal">Manual Expenses</h3>
            <button 
              onClick={() => setIsAddingExpense(!isAddingExpense)} 
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors shadow-sm ${
                isAddingExpense ? 'bg-sand/30 text-charcoal hover:bg-sand/50' : 'bg-charcoal text-white hover:bg-charcoal/90 hover:-translate-y-0.5 hover:shadow-md'
              }`}
            >
              {isAddingExpense ? 'Cancel' : <><Plus className="w-4 h-4" /> Add Expense</>}
            </button>
          </div>

          {isAddingExpense && (
             <form onSubmit={handleAddExpense} className="bg-sand/20 p-6 rounded-2xl border border-charcoal/5 mb-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   <div>
                      <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-widest mb-2">Category</label>
                      <select className="w-full bg-white border border-charcoal/10 rounded-xl p-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-gold" value={expenseForm.category} onChange={e => setExpenseForm({...expenseForm, category: e.target.value})}>
                         <option value="TRANSPORT">Transport</option>
                         <option value="ACCOMMODATION">Accommodation</option>
                         <option value="MEAL">Meal</option>
                         <option value="OTHER">Other</option>
                      </select>
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-widest mb-2">Amount (₹)</label>
                      <input type="number" step="0.01" required className="w-full bg-white border border-charcoal/10 rounded-xl p-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-gold" value={expenseForm.amount} onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})} />
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-widest mb-2">Date</label>
                      <input type="date" required className="w-full bg-white border border-charcoal/10 rounded-xl p-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-gold" value={expenseForm.expense_date} onChange={e => setExpenseForm({...expenseForm, expense_date: e.target.value})} />
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-widest mb-2">Description</label>
                      <input type="text" className="w-full bg-white border border-charcoal/10 rounded-xl p-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-gold" placeholder="e.g. Taxi to hotel" value={expenseForm.description} onChange={e => setExpenseForm({...expenseForm, description: e.target.value})} />
                   </div>
                </div>
                <div className="pt-2 flex justify-end">
                   <button type="submit" className="bg-gold text-charcoal px-8 py-3 rounded-full font-bold shadow-lg shadow-black/5 hover:-translate-y-0.5 hover:shadow-xl transition-all">Save Expense</button>
                </div>
             </form>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-charcoal/10 text-xs font-bold text-charcoal/50 uppercase tracking-widest">
                  <th className="py-4 pr-4">Date</th>
                  <th className="py-4 pr-4">Category</th>
                  <th className="py-4 pr-4">Description</th>
                  <th className="py-4 pl-4 text-right">Amount</th>
                  <th className="py-4 pl-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/5">
                {budget.expenses && budget.expenses.length > 0 ? (
                  budget.expenses.map(exp => (
                    <tr key={exp.id} className="hover:bg-sand/10 transition-colors group">
                      <td className="py-4 pr-4 text-sm font-medium text-charcoal/80">{exp.expense_date}</td>
                      <td className="py-4 pr-4">
                        <span className="bg-sand/50 border border-charcoal/5 text-charcoal/80 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{exp.category}</span>
                      </td>
                      <td className="py-4 pr-4 text-sm font-medium text-charcoal">{exp.description || '-'}</td>
                      <td className="py-4 pl-4 text-sm font-bold text-charcoal text-right">₹{exp.amount.toLocaleString()}</td>
                      <td className="py-4 pl-4 text-center">
                        <button onClick={() => handleDeleteExpense(exp.id)} className="text-charcoal/30 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                          <Trash2 className="w-4 h-4 mx-auto" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-12 text-center">
                       <div className="text-charcoal/40 font-medium">No manual expenses recorded.</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Reference Budget ── */}
      <div className="pt-8 border-t border-charcoal/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
          <h2 className="font-display text-2xl font-bold text-charcoal">Reference Budget Estimates</h2>
          <span className="bg-charcoal/5 text-charcoal/60 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
            Approximate Guide Only
          </span>
        </div>
        <BudgetReferencePanel trip={trip} budget={budget} budgetTier={trip.budget_tier} />
      </div>
    </div>
  );
}
