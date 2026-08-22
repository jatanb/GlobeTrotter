import { useState } from "react";
import { ArrowLeft, CalendarDays, ChevronDown, ChevronUp, Clock3, GripVertical, MapPin, Pencil, X } from "lucide-react";
import { Link } from "react-router-dom";

interface Stop {
  id: string;
  city: string;
  startDate: string;
  endDate: string;
  activities: string[];
}
interface Trip { id: string; name: string; }

function formatDate(date: string) {
  if (!date) return "Date to be confirmed";
  return new Intl.DateTimeFormat("en", { weekday: "short", month: "short", day: "numeric" }).format(new Date(`${date}T00:00:00`));
}

export default function CalendarPage() {
  const trips = JSON.parse(localStorage.getItem("globetrotter_trips") || "[]") as Trip[];
  const trip = trips[0];
  const storageKey = `globetrotter_itinerary_${trip?.id || "draft"}`;
  const [stops, setStops] = useState<Stop[]>(JSON.parse(localStorage.getItem(storageKey) || "[]"));
  const [openDays, setOpenDays] = useState<string[]>(stops.map((stop) => stop.id));
  const [dragged, setDragged] = useState<{ stopId: string; activity: string } | null>(null);

  function toggleDay(id: string) {
    setOpenDays((current) => current.includes(id) ? current.filter((dayId) => dayId !== id) : [...current, id]);
  }

  function persist(nextStops: Stop[]) {
    setStops(nextStops);
    localStorage.setItem(storageKey, JSON.stringify(nextStops));
  }

  function removeActivity(stopId: string, activity: string) {
    persist(stops.map((stop) => stop.id === stopId ? { ...stop, activities: stop.activities.filter((item) => item !== activity) } : stop));
  }

  function dropActivity(targetStopId: string, targetActivity: string) {
    if (!dragged || (dragged.stopId === targetStopId && dragged.activity === targetActivity)) return;
    const nextStops = stops.map((stop) => ({ ...stop, activities: [...stop.activities] }));
    const source = nextStops.find((stop) => stop.id === dragged.stopId);
    const target = nextStops.find((stop) => stop.id === targetStopId);
    if (!source || !target) return;
    source.activities = source.activities.filter((activity) => activity !== dragged.activity);
    const targetIndex = target.activities.indexOf(targetActivity);
    target.activities.splice(targetIndex < 0 ? target.activities.length : targetIndex, 0, dragged.activity);
    persist(nextStops);
    setDragged(null);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><Link to="/" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950"><ArrowLeft size={16} /> Back to dashboard</Link><p className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-500">Trip timeline</p><h1 className="text-3xl font-bold tracking-tight text-slate-950">{trip?.name || "Your travel calendar"}</h1><p className="mt-2 text-slate-600">See the flow of your journey and adjust plans as you go.</p></div><Link to={trip ? `/trips/${trip.id}/itinerary` : "/trips"} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-950"><Pencil size={16} /> Edit itinerary</Link></div>
        {stops.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center"><CalendarDays size={28} className="mx-auto text-slate-400" /><h2 className="mt-4 text-lg font-bold text-slate-950">Your calendar is empty</h2><p className="mt-2 text-sm text-slate-500">Build your itinerary first to see the day-by-day timeline.</p><Link to="/trips" className="mt-5 inline-flex rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white">View my trips</Link></div> : <div className="relative space-y-4 before:absolute before:bottom-5 before:left-5 before:top-5 before:w-px before:bg-slate-200 sm:before:left-6">{stops.map((stop, index) => { const isOpen = openDays.includes(stop.id); return <section key={stop.id} className="relative pl-12 sm:pl-16"><div className="absolute left-2 top-6 flex h-7 w-7 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white ring-4 ring-slate-50 sm:left-3">{index + 1}</div><div className="rounded-2xl border border-slate-200 bg-white shadow-sm"><button type="button" onClick={() => toggleDay(stop.id)} className="flex w-full items-center justify-between gap-4 p-5 text-left sm:p-6"><div><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Day {index + 1} · {formatDate(stop.startDate)}</p><h2 className="mt-1 flex items-center gap-2 text-xl font-bold text-slate-950"><MapPin size={18} className="text-slate-500" /> {stop.city}</h2></div>{isOpen ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}</button>{isOpen && <div className="border-t border-slate-100 p-5 sm:p-6">{stop.activities.length === 0 ? <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">No activities planned for this day.</p> : <div className="space-y-3">{stop.activities.map((activity, activityIndex) => <div key={`${stop.id}-${activity}`} draggable onDragStart={() => setDragged({ stopId: stop.id, activity })} onDragOver={(event) => event.preventDefault()} onDrop={() => dropActivity(stop.id, activity)} className="group flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3"><GripVertical size={17} className="shrink-0 cursor-grab text-slate-300 group-hover:text-slate-500" /><div className="w-14 shrink-0 text-xs font-semibold text-slate-500"><Clock3 size={14} className="mb-1" /> {activityIndex === 0 ? "09:00" : `${String(9 + activityIndex * 2).padStart(2, "0")}:00`}</div><p className="min-w-0 flex-1 text-sm font-semibold text-slate-800">{activity}</p><span className="text-xs font-medium text-slate-500">?{activityIndex === 0 ? 2200 : 1500}</span><button type="button" onClick={() => removeActivity(stop.id, activity)} aria-label={`Remove ${activity}`} className="rounded-lg p-1.5 text-slate-300 hover:bg-red-50 hover:text-red-600"><X size={16} /></button></div>)}</div>}<Link to={`/discover/activities?tripId=${trip?.id}&stopId=${stop.id}`} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-950">Add activity</Link></div>}</div></section>; })}</div>}
        <p className="mt-6 text-xs text-slate-500">Drag an activity onto another activity to change its position in the timeline.</p>
      </div>
    </div>
  );
}


