import { AlertTriangle, ArrowLeft, BedDouble, Bus, CircleDollarSign, Coffee, MapPin, Pencil, Utensils } from "lucide-react";
import { Link } from "react-router-dom";

interface Stop { id: string; city: string; activities: string[]; }
interface Trip { id: string; name: string; startDate: string; endDate: string; }

const categories = [
  { name: "Transport", amount: 420, icon: Bus, color: "bg-sky-500" },
  { name: "Stay", amount: 980, icon: BedDouble, color: "bg-indigo-500" },
  { name: "Activities", amount: 360, icon: MapPin, color: "bg-amber-500" },
  { name: "Meals", amount: 280, icon: Utensils, color: "bg-emerald-500" },
];

export default function BudgetPage() {
  const trips = JSON.parse(localStorage.getItem("globetrotter_trips") || "[]") as Trip[];
  const trip = trips[0];
  const stops = JSON.parse(localStorage.getItem(`globetrotter_itinerary_${trip?.id || "draft"}`) || "[]") as Stop[];
  const activityCount = stops.reduce((total, stop) => total + stop.activities.length, 0);
  const plannedTotal = categories.reduce((total, category) => total + category.amount, 0) + activityCount * 45;
  const budgetLimit = 2480;
  const remaining = budgetLimit - plannedTotal;
  const dailyBudgets = stops.map((stop, index) => ({ city: stop.city, day: index + 1, amount: 180 + stop.activities.length * 45 }));

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><Link to="/" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950"><ArrowLeft size={16} /> Back to dashboard</Link><p className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-500">Trip finances</p><h1 className="text-3xl font-bold tracking-tight text-slate-950">Budget overview</h1><p className="mt-2 text-slate-600">Stay clear on what your journey costs before you go.</p></div>
          <Link to={trip ? `/trips/${trip.id}/itinerary` : "/trips"} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-950"><Pencil size={16} /> Edit itinerary</Link>
        </div>
        <section className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-950 p-6 text-white"><CircleDollarSign size={22} className="text-slate-300" /><p className="mt-6 text-sm text-slate-400">Estimated total</p><p className="mt-1 text-3xl font-bold">${plannedTotal.toLocaleString()}</p><p className="mt-2 text-sm text-slate-400">Across {stops.length || 1} travel {stops.length === 1 ? "day" : "days"}</p></div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6"><p className="text-sm font-medium text-slate-500">Budget limit</p><p className="mt-1 text-3xl font-bold text-slate-950">${budgetLimit.toLocaleString()}</p><p className="mt-2 text-sm text-slate-500">Set for this trip</p></div>
          <div className={`rounded-2xl border p-6 ${remaining >= 0 ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}`}><p className="text-sm font-medium text-slate-600">{remaining >= 0 ? "Remaining" : "Over budget"}</p><p className={`mt-1 text-3xl font-bold ${remaining >= 0 ? "text-emerald-800" : "text-red-800"}`}>${Math.abs(remaining).toLocaleString()}</p><p className="mt-2 text-sm text-slate-600">{remaining >= 0 ? "Available to allocate" : "Reduce planned costs"}</p></div>
        </section>
        {remaining < 0 && <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"><AlertTriangle size={18} className="mt-0.5 shrink-0" /> Your estimated trip cost is above the current budget limit.</div>}
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div><div className="mb-4"><h2 className="text-xl font-bold text-slate-950">Cost breakdown</h2><p className="mt-1 text-sm text-slate-500">Where your estimated spend goes.</p></div><div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="mb-8 flex h-5 overflow-hidden rounded-full bg-slate-100">{categories.map((category) => <div key={category.name} style={{ width: `${(category.amount / plannedTotal) * 100}%` }} className={category.color} />)}</div><div className="space-y-5">{categories.map((category) => { const Icon = category.icon; const amount = category.amount + (category.name === "Activities" ? activityCount * 45 : 0); return <div key={category.name}><div className="mb-2 flex items-center justify-between text-sm"><span className="inline-flex items-center gap-2 font-semibold text-slate-800"><Icon size={16} className="text-slate-500" /> {category.name}</span><span className="font-bold text-slate-950">${amount}</span></div><div className="h-2 rounded-full bg-slate-100"><div className={`h-full rounded-full ${category.color}`} style={{ width: `${(amount / plannedTotal) * 100}%` }} /></div></div>; })}</div></div></div>
          <div><div className="mb-4"><h2 className="text-xl font-bold text-slate-950">Daily outlook</h2><p className="mt-1 text-sm text-slate-500">Average planned cost per day.</p></div><div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="mb-6 flex items-end gap-3"><Coffee size={20} className="mb-1 text-slate-500" /><div><p className="text-3xl font-bold text-slate-950">${Math.round(plannedTotal / Math.max(stops.length, 1))}</p><p className="text-sm text-slate-500">average per day</p></div></div><div className="space-y-4">{(dailyBudgets.length ? dailyBudgets : [{ city: "Your next stop", day: 1, amount: plannedTotal }]).map((day) => <div key={`${day.city}-${day.day}`} className="flex items-center gap-3"><div className="w-16 text-xs font-semibold uppercase tracking-wider text-slate-400">Day {day.day}</div><div className="h-2 flex-1 rounded-full bg-slate-100"><div className={`h-full rounded-full ${day.amount > 250 ? "bg-red-400" : "bg-slate-700"}`} style={{ width: `${Math.min((day.amount / 350) * 100, 100)}%` }} /></div><span className="w-16 text-right text-sm font-semibold text-slate-700">${day.amount}</span></div>)}</div>{dailyBudgets.some((day) => day.amount > 250) && <div className="mt-6 flex gap-2 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800"><AlertTriangle size={15} className="mt-0.5 shrink-0" /> One or more days are above your $250 daily comfort range.</div>}</div></div>
        </section>
      </div>
    </div>
  );
}
