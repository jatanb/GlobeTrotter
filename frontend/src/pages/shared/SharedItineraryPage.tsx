import { useState } from "react";
import { CalendarDays, Check, Copy, Globe2, MapPin, Share2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

interface Stop { id: string; city: string; startDate: string; endDate: string; activities: string[]; }
interface Trip { id: string; name: string; description: string; startDate: string; endDate: string; }

function formatDate(date: string) {
  if (!date) return "Date to be confirmed";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${date}T00:00:00`));
}

export default function SharedItineraryPage() {
  const { shareId } = useParams();
  const navigate = useNavigate();
  const trips = JSON.parse(localStorage.getItem("globetrotter_trips") || "[]") as Trip[];
  const trip = trips.find((item) => item.id === shareId);
  const stops = trip ? JSON.parse(localStorage.getItem(`globetrotter_itinerary_${trip.id}`) || "[]") as Stop[] : [];
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  async function copyTrip() {
    if (!trip) return;
    const newTrip = { ...trip, id: crypto.randomUUID(), name: `${trip.name} (copy)` };
    const savedTrips = [...trips, newTrip];
    localStorage.setItem("globetrotter_trips", JSON.stringify(savedTrips));
    localStorage.setItem(`globetrotter_itinerary_${newTrip.id}`, JSON.stringify(stops.map((stop) => ({ ...stop, id: crypto.randomUUID() }))));
    setCopied(true);
    setTimeout(() => navigate("/trips"), 700);
  }

  async function shareTrip() {
    const url = window.location.href;
    if (navigator.share) await navigator.share({ title: trip?.name || "GlobeTrotter itinerary", url });
    else { await navigator.clipboard?.writeText(url); setShared(true); }
  }

  if (!trip) return <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4"><div className="text-center"><Globe2 size={32} className="mx-auto text-slate-400" /><h1 className="mt-4 text-2xl font-bold text-slate-950">Itinerary not found</h1><p className="mt-2 text-slate-500">This shared itinerary may have been removed or is not available.</p></div></div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8"><div className="flex items-center gap-2 font-bold text-slate-950"><Globe2 size={20} /> GlobeTrotter</div><span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Shared itinerary</span></div></header>
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-2xl bg-slate-950 p-6 text-white sm:p-10"><p className="text-sm font-semibold uppercase tracking-wider text-slate-400">A journey worth sharing</p><h1 className="mt-3 text-3xl font-bold sm:text-4xl">{trip.name}</h1><p className="mt-3 max-w-2xl text-slate-300">{trip.description || "A thoughtfully planned journey across memorable places."}</p><div className="mt-6 flex flex-wrap gap-5 text-sm text-slate-300"><span className="inline-flex items-center gap-2"><CalendarDays size={16} /> {formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span><span className="inline-flex items-center gap-2"><MapPin size={16} /> {stops.length} stops</span></div></section>
        <div className="my-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Public URL</p><p className="truncate text-sm text-slate-600">{window.location.href}</p></div><div className="flex shrink-0 gap-2"><button type="button" onClick={shareTrip} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"><Share2 size={16} /> {shared ? "Link copied" : "Share"}</button><button type="button" onClick={copyTrip} className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-3 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">{copied ? <Check size={16} /> : <Copy size={16} />} {copied ? "Copied" : "Copy trip"}</button></div></div>
        <div className="space-y-4">{stops.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">No stops have been added to this itinerary yet.</div> : stops.map((stop, index) => <section key={stop.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center gap-4 border-b border-slate-100 p-5 sm:p-6"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">{index + 1}</span><div><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Stop {index + 1}</p><h2 className="text-xl font-bold text-slate-950">{stop.city}</h2></div><span className="ml-auto text-sm text-slate-500">{formatDate(stop.startDate)}</span></div><div className="space-y-3 p-5 sm:p-6">{stop.activities.length ? stop.activities.map((activity, activityIndex) => <div key={`${stop.id}-${activity}`} className="flex items-center gap-4 rounded-xl bg-slate-50 p-4"><span className="w-14 text-xs font-semibold text-slate-500">{activityIndex === 0 ? "09:00" : "11:00"}</span><span className="font-medium text-slate-800">{activity}</span></div>) : <p className="text-sm text-slate-500">Open time to explore {stop.city}.</p>}</div></section>)}</div>
        <p className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-slate-400"><Share2 size={14} /> Read-only view · Shared by a GlobeTrotter traveler</p>
      </main>
    </div>
  );
}

