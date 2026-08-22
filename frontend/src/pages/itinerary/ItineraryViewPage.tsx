import { useState } from "react";
import { ArrowLeft, CalendarDays, Clock3, DollarSign, List, MapPin, Table2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";

interface Stop {
  id: string;
  city: string;
  startDate: string;
  endDate: string;
  activities: string[];
}

interface SavedTrip {
  id: string;
  name: string;
}

function formatDate(date: string) {
  if (!date) return "Date to be confirmed";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${date}T00:00:00`));
}

export default function ItineraryViewPage() {
  const { tripId } = useParams();
  const trips = JSON.parse(localStorage.getItem("globetrotter_trips") || "[]") as SavedTrip[];
  const trip = trips.find((item) => item.id === tripId) || trips[0];
  const stops = JSON.parse(localStorage.getItem(`globetrotter_itinerary_${trip?.id || "draft"}`) || "[]") as Stop[];
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <Link to={`/trips/${trip?.id || tripId}/itinerary`} className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950"><ArrowLeft size={16} /> Back to builder</Link>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-500">Itinerary preview</p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">{trip?.name || "Your itinerary"}</h1>
            <p className="mt-2 text-slate-600">A clear view of every stop, day, and plan in your journey.</p>
          </div>
          <div className="flex rounded-lg border border-slate-300 bg-white p-1" aria-label="Itinerary view mode">
            <button type="button" onClick={() => setViewMode("calendar")} className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold ${viewMode === "calendar" ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100"}`}><Table2 size={16} /> Calendar</button>
            <button type="button" onClick={() => setViewMode("list")} className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold ${viewMode === "list" ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100"}`}><List size={16} /> List</button>
          </div>
        </div>

        {stops.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center"><MapPin size={28} className="mx-auto text-slate-400" /><h2 className="mt-4 text-lg font-bold text-slate-950">Nothing planned yet</h2><p className="mt-2 text-sm text-slate-500">Add stops and activities in the builder to see your itinerary here.</p><Link to={`/trips/${trip?.id || tripId}/itinerary`} className="mt-5 inline-flex rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white">Open builder</Link></div> : viewMode === "calendar" ? <div className="space-y-4">{stops.map((stop, index) => <section key={stop.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">{index + 1}</span><div><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Day {index + 1}</p><h2 className="text-xl font-bold text-slate-950">{stop.city}</h2></div></div><div className="inline-flex items-center gap-2 text-sm text-slate-500"><CalendarDays size={16} /> {formatDate(stop.startDate)}</div></div><div className="space-y-3 p-5 sm:p-6">{(stop.activities.length ? stop.activities : ["Open day - add an activity in the builder"]).map((activity, activityIndex) => <div key={`${stop.id}-${activity}`} className="flex gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4"><div className="w-16 shrink-0 pt-0.5 text-xs font-semibold text-slate-500">{activityIndex === 0 ? "09:00" : `${String(9 + activityIndex * 2).padStart(2, "0")}:00`}</div><div className="min-w-0 flex-1"><h3 className="font-semibold text-slate-900">{activity}</h3><p className="mt-1 text-sm text-slate-500">{activityIndex === 0 ? "Morning plan" : "Flexible timing"}</p></div><div className="flex shrink-0 items-center gap-1 text-sm text-slate-500"><DollarSign size={15} /> {activityIndex === 0 ? "45" : "30"}</div></div>)}</div></section>)}</div> : <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="hidden grid-cols-[1fr_1.2fr_1fr_100px] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 sm:grid"><span>Stop</span><span>City</span><span>Date</span><span>Plans</span></div>{stops.map((stop, index) => <div key={stop.id} className="grid gap-2 border-b border-slate-100 px-5 py-4 last:border-0 sm:grid-cols-[1fr_1.2fr_1fr_100px] sm:items-center sm:gap-4"><span className="text-sm font-semibold text-slate-500">Day {index + 1}</span><span className="inline-flex items-center gap-2 font-semibold text-slate-900"><MapPin size={15} className="text-slate-400" /> {stop.city}</span><span className="inline-flex items-center gap-2 text-sm text-slate-500"><CalendarDays size={15} /> {formatDate(stop.startDate)}</span><span className="text-sm text-slate-500">{stop.activities.length} {stop.activities.length === 1 ? "activity" : "activities"}</span></div>)}</div>}
        <div className="mt-5 flex flex-wrap gap-5 text-xs text-slate-500"><span className="inline-flex items-center gap-2"><Clock3 size={14} /> Times are flexible</span><span className="inline-flex items-center gap-2"><DollarSign size={14} /> Estimated activity costs</span></div>
      </div>
    </div>
  );
}