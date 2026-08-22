import { useState } from "react";
import type { FormEvent } from "react";
import { AlertTriangle, ArrowLeft, BedDouble, Bus, CircleDollarSign, Coffee, MapPin, Pencil, Trash2, Utensils } from "lucide-react";
import { Link } from "react-router-dom";

interface Stop { id: string; city: string; activities: string[]; cityCost?: number; activityCosts?: Record<string, number>; }
interface Trip { id: string; name: string; startDate: string; endDate: string; budgetLimit?: number; }
interface Expense { id: string; category: string; amount: number; note: string; date: string; }

const categories = [
  { name: "Transport", amount: 0, icon: Bus, color: "bg-sky-500" },
  { name: "Stay", amount: 0, icon: BedDouble, color: "bg-indigo-500" },
  { name: "Activities", amount: 0, icon: MapPin, color: "bg-amber-500" },
  { name: "Meals", amount: 0, icon: Utensils, color: "bg-emerald-500" },
  { name: "Other", amount: 0, icon: CircleDollarSign, color: "bg-slate-500" },
];

export default function BudgetPage() {
  const trips = JSON.parse(localStorage.getItem("globetrotter_trips") || "[]") as Trip[];
  const trip = trips[0];
  const stops = JSON.parse(localStorage.getItem(`globetrotter_itinerary_${trip?.id || "draft"}`) || "[]") as Stop[];
  const expenseKey = `globetrotter_expenses_${trip?.id || "draft"}`;
  const [expenses, setExpenses] = useState<Expense[]>(() => JSON.parse(localStorage.getItem(expenseKey) || "[]") as Expense[]);
  const [expenseCategory, setExpenseCategory] = useState("Transport");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseNote, setExpenseNote] = useState("");
  const activityCosts = stops.map((stop) => Object.values(stop.activityCosts || {}).reduce((total, amount) => total + amount, 0));
  const dailyBudgets = stops.map((stop, index) => ({ city: stop.city, day: index + 1, amount: (stop.cityCost || 0) + activityCosts[index] }));
  const cityTotal = stops.reduce((total, stop) => total + (stop.cityCost || 0), 0);
  const plannedTotal = cityTotal + activityCosts.reduce((total, amount) => total + amount, 0);
  const expenseTotal = expenses.reduce((total, expense) => total + expense.amount, 0);
  const totalCost = plannedTotal + expenseTotal;
  const budgetLimit = trip?.budgetLimit || 0;
  const remaining = budgetLimit - totalCost;
  const categoryAmounts = categories.map((category) => {
    const plannedAmount = category.name === "Stay" ? cityTotal : category.name === "Activities" ? plannedTotal - cityTotal : category.amount;
    return plannedAmount + expenses.filter((expense) => expense.category === category.name).reduce((total, expense) => total + expense.amount, 0);
  });

  function addExpense(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = Number(expenseAmount);
    if (!amount || amount < 0) return;
    const nextExpenses = [...expenses, { id: crypto.randomUUID(), category: expenseCategory, amount, note: expenseNote.trim(), date: new Date().toISOString().slice(0, 10) }];
    setExpenses(nextExpenses);
    localStorage.setItem(expenseKey, JSON.stringify(nextExpenses));
    setExpenseAmount("");
    setExpenseNote("");
  }

  function removeExpense(id: string) {
    const nextExpenses = expenses.filter((expense) => expense.id !== id);
    setExpenses(nextExpenses);
    localStorage.setItem(expenseKey, JSON.stringify(nextExpenses));
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><Link to="/" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950"><ArrowLeft size={16} /> Back to dashboard</Link><p className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-500">Trip finances</p><h1 className="text-3xl font-bold tracking-tight text-slate-950">Budget overview</h1><p className="mt-2 text-slate-600">Stay clear on what your journey costs before you go.</p></div>
          <Link to={trip ? `/trips/${trip.id}/itinerary` : "/trips"} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-950"><Pencil size={16} /> Edit itinerary</Link>
        </div>
        <section className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-950 p-6 text-white"><CircleDollarSign size={22} className="text-slate-300" /><p className="mt-6 text-sm text-slate-400">Estimated total</p><p className="mt-1 text-3xl font-bold">₹{plannedTotal.toLocaleString("en-IN")}</p><p className="mt-2 text-sm text-slate-400">Across {stops.length || 1} travel {stops.length === 1 ? "day" : "days"}</p></div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6"><p className="text-sm font-medium text-slate-500">Budget limit</p><p className="mt-1 text-3xl font-bold text-slate-950">₹{budgetLimit.toLocaleString("en-IN")}</p><p className="mt-2 text-sm text-slate-500">₹{expenseTotal.toLocaleString("en-IN")} added expenses</p></div>
          <div className={`rounded-2xl border p-6 ${remaining >= 0 ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}`}><p className="text-sm font-medium text-slate-600">{remaining >= 0 ? "Remaining" : "Over budget"}</p><p className={`mt-1 text-3xl font-bold ${remaining >= 0 ? "text-emerald-800" : "text-red-800"}`}>₹{Math.abs(remaining).toLocaleString("en-IN")}</p><p className="mt-2 text-sm text-slate-600">{remaining >= 0 ? "Available to allocate" : "Reduce planned costs"}</p></div>
        </section>
        {remaining < 0 && <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"><AlertTriangle size={18} className="mt-0.5 shrink-0" /> Your estimated trip cost is above the current budget limit.</div>}
        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5"><h2 className="text-xl font-bold text-slate-950">Add an expense</h2><p className="mt-1 text-sm text-slate-500">Track actual spending against this trip's budget.</p></div>
          <form onSubmit={addExpense} className="grid gap-3 md:grid-cols-[1fr_1fr_1.5fr_auto]"><select value={expenseCategory} onChange={(event) => setExpenseCategory(event.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"><option>Transport</option><option>Stay</option><option>Activities</option><option>Meals</option><option>Other</option></select><input type="number" min="0" step="1" required value={expenseAmount} onChange={(event) => setExpenseAmount(event.target.value)} placeholder="Amount" className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-950" /><input type="text" value={expenseNote} onChange={(event) => setExpenseNote(event.target.value)} placeholder="What was it for?" className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-950" /><button type="submit" className="rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">Add expense</button></form>
          {expenses.length > 0 && <div className="mt-5 divide-y divide-slate-100 rounded-lg border border-slate-100">{expenses.map((expense) => <div key={expense.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm"><div><span className="font-semibold text-slate-800">{expense.category}</span>{expense.note && <span className="ml-2 text-slate-500">{expense.note}</span>}</div><div className="flex items-center gap-3"><span className="font-bold text-slate-950">₹{expense.amount.toLocaleString("en-IN")}</span><button type="button" onClick={() => removeExpense(expense.id)} aria-label={`Remove ${expense.note || expense.category} expense`} className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={15} /></button></div></div>)}</div>}
        </section>
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div><div className="mb-4"><h2 className="text-xl font-bold text-slate-950">Cost breakdown</h2><p className="mt-1 text-sm text-slate-500">Where your estimated spend goes.</p></div><div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="mb-8 flex h-5 overflow-hidden rounded-full bg-slate-100">{categories.map((category, index) => <div key={category.name} style={{ width: `${plannedTotal ? (categoryAmounts[index] / plannedTotal) * 100 : 0}%` }} className={category.color} />)}</div><div className="space-y-5">{categories.map((category, index) => { const Icon = category.icon; const amount = categoryAmounts[index]; return <div key={category.name}><div className="mb-2 flex items-center justify-between text-sm"><span className="inline-flex items-center gap-2 font-semibold text-slate-800"><Icon size={16} className="text-slate-500" /> {category.name}</span><span className="font-bold text-slate-950">₹{amount.toLocaleString("en-IN")}</span></div><div className="h-2 rounded-full bg-slate-100"><div className={`h-full rounded-full ${category.color}`} style={{ width: `${plannedTotal ? (amount / plannedTotal) * 100 : 0}%` }} /></div></div>; })}</div></div></div>
          <div><div className="mb-4"><h2 className="text-xl font-bold text-slate-950">Daily outlook</h2><p className="mt-1 text-sm text-slate-500">Average planned cost per day.</p></div><div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="mb-6 flex items-end gap-3"><Coffee size={20} className="mb-1 text-slate-500" /><div><p className="text-3xl font-bold text-slate-950">₹{Math.round(plannedTotal / Math.max(stops.length, 1)).toLocaleString("en-IN")}</p><p className="text-sm text-slate-500">average per day</p></div></div><div className="space-y-4">{(dailyBudgets.length ? dailyBudgets : [{ city: "Your next stop", day: 1, amount: plannedTotal }]).map((day) => <div key={`${day.city}-${day.day}`} className="flex items-center gap-3"><div className="w-16 text-xs font-semibold uppercase tracking-wider text-slate-400">Day {day.day}</div><div className="h-2 flex-1 rounded-full bg-slate-100"><div className={`h-full rounded-full ${day.amount > 12500 ? "bg-red-400" : "bg-slate-700"}`} style={{ width: `${Math.min((day.amount / 17500) * 100, 100)}%` }} /></div><span className="w-20 text-right text-sm font-semibold text-slate-700">₹{day.amount.toLocaleString("en-IN")}</span></div>)}</div>{dailyBudgets.some((day) => day.amount > 12500) && <div className="mt-6 flex gap-2 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800"><AlertTriangle size={15} className="mt-0.5 shrink-0" /> One or more days are above your ₹12,500 daily comfort range.</div>}</div></div>
        </section>
      </div>
    </div>
  );
}
