import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowDown, ArrowLeft, ArrowUp, CalendarDays, Check, GripVertical, MapPin, Plus, Save, X } from "lucide-react";
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
  startDate: string;
  endDate: string;
}

const cities = ["Tokyo", "Kyoto", "Osaka", "Lisbon", "Sintra", "Marrakech", "Paris", "Barcelona", "New York"];

function createStop(startDate: string, endDate: string): Stop {
  return { id: crypto.randomUUID(), city: "Tokyo", startDate, endDate, activities: [] };
}

export default function ItineraryBuilderPage() {
  const { tripId } = useParams();
  const trips = JSON.parse(localStorage.getItem("globetrotter_trips") || "[]") as SavedTrip[];
  const trip = trips.find((item) => item.id === tripId) || trips[0];
  const storageKey = `globetrotter_itinerary_${trip?.id || "draft"}`;
  const initialStops = JSON.parse(localStorage.getItem(storageKey) || "null") as Stop[] | null;
  const [stops, setStops] = useState<Stop[]>(initialStops || (trip ? [createStop(trip.startDate, trip.endDate)] : []));
  const [activityDrafts, setActivityDrafts] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  function updateStop(id: string, field: "city" | "startDate" | "endDate", value: string) {
    setStops((currentStops) => currentStops.map((stop) => stop.id === id ? { ...stop, [field]: value } : stop));
    setSaved(false);
  }

  function addStop() {
    const lastStop = stops[stops.length - 1];
    setStops((currentStops) => [...currentStops, createStop(lastStop?.startDate || trip?.startDate || "", lastStop?.endDate || trip?.endDate || "")]);
    setSaved(false);
  }

  function removeStop(id: string) {
    setStops((currentStops) => currentStops.filter((stop) => stop.id !== id));
    setSaved(false);
  }

  function moveStop(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= stops.length) return;
    setStops((currentStops) => {
      const reordered = [...currentStops];
      [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
      return reordered;
    });
    setSaved(false);
  }

  function addActivity(event: FormEvent<HTMLFormElement>, stopId: string) {
    event.preventDefault();
    const activity = activityDrafts[stopId]?.trim();
    if (!activity) return;
    setStops((currentStops) => currentStops.map((stop) => stop.id === stopId ? { ...stop, activities: [...stop.activities, activity] } : stop));
    setActivityDrafts((currentDrafts) => ({ ...currentDrafts, [stopId]: "" }));
    setSaved(false);
  }

  function saveItinerary() {
    localStorage.setItem(storageKey, JSON.stringify(stops));
    setSaved(true);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <Link to="/trips" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950"><ArrowLeft size={16} /> Back to my trips</Link>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-500">Itinerary builder</p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">{trip?.name || "Build your itinerary"}</h1>
            <p className="mt-2 text-slate-600">Arrange your stops and give each day something to look forward to.</p>
          </div>
          <div className="flex flex-wrap gap-2"><Link to={`/trips/${trip?.id || tripId}/itinerary/view`} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-slate-500 hover:text-slate-950">Preview</Link><button type="button" onClick={saveItinerary} className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">{saved ? <Check size={17} /> : <Save size={17} />} {saved ? "Saved" : "Save itinerary"}</button></div>
        </div>

        <div className="mb-5 flex items-center justify-between"><div><h2 className="text-xl font-bold text-slate-950">Your stops</h2><p className="mt-1 text-sm text-slate-500">{stops.length} {stops.length === 1 ? "city" : "cities"} in your route</p></div><button type="button" onClick={addStop} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-slate-500 hover:text-slate-950"><Plus size={17} /> Add stop</button></div>
        {stops.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center"><MapPin size={28} className="mx-auto text-slate-400" /><h2 className="mt-4 text-lg font-bold text-slate-950">Your route is empty</h2><p className="mt-2 text-sm text-slate-500">Add your first city to start building the journey.</p><button type="button" onClick={addStop} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white"><Plus size={17} /> Add first stop</button></div> : <div className="space-y-4">{stops.map((stop, index) => <article key={stop.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex gap-4"><div className="hidden items-start pt-2 text-slate-300 sm:flex"><GripVertical size={18} /></div><div className="min-w-0 flex-1">
            <div className="mb-5 flex items-start justify-between gap-3"><div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">{index + 1}</span><h3 className="text-lg font-bold text-slate-950">Stop {index + 1}</h3></div><div className="flex items-center gap-1"><button type="button" onClick={() => moveStop(index, -1)} disabled={index === 0} aria-label="Move stop up" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-30"><ArrowUp size={17} /></button><button type="button" onClick={() => moveStop(index, 1)} disabled={index === stops.length - 1} aria-label="Move stop down" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-30"><ArrowDown size={17} /></button><button type="button" onClick={() => removeStop(stop.id)} aria-label={`Remove stop ${index + 1}`} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"><X size={17} /></button></div></div>
            <div className="grid gap-5 sm:grid-cols-3"><div><label htmlFor={`city-${stop.id}`} className="mb-2 block text-sm font-semibold text-slate-800">City</label><select id={`city-${stop.id}`} value={stop.city} onChange={(event) => updateStop(stop.id, "city", event.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10">{cities.map((city) => <option key={city}>{city}</option>)}</select></div><div><label htmlFor={`start-${stop.id}`} className="mb-2 block text-sm font-semibold text-slate-800">Arrival</label><div className="relative"><CalendarDays size={16} className="pointer-events-none absolute left-3 top-3 text-slate-400" /><input id={`start-${stop.id}`} type="date" value={stop.startDate} onChange={(event) => updateStop(stop.id, "startDate", event.target.value)} className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-2 outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10" /></div></div><div><label htmlFor={`end-${stop.id}`} className="mb-2 block text-sm font-semibold text-slate-800">Departure</label><div className="relative"><CalendarDays size={16} className="pointer-events-none absolute left-3 top-3 text-slate-400" /><input id={`end-${stop.id}`} type="date" min={stop.startDate} value={stop.endDate} onChange={(event) => updateStop(stop.id, "endDate", event.target.value)} className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-2 outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10" /></div></div></div>
            <div className="mt-6 border-t border-slate-100 pt-5"><p className="mb-3 text-sm font-semibold text-slate-800">Activities</p>{stop.activities.length > 0 && <div className="mb-3 flex flex-wrap gap-2">{stop.activities.map((activity) => <span key={activity} className="rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700">{activity}</span>)}</div>}<form onSubmit={(event) => addActivity(event, stop.id)} className="flex gap-2"><input value={activityDrafts[stop.id] || ""} onChange={(event) => setActivityDrafts((drafts) => ({ ...drafts, [stop.id]: event.target.value }))} placeholder="Add an activity, e.g. Visit Fushimi Inari" className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10" /><button type="submit" className="rounded-lg border border-slate-300 px-3 text-slate-600 hover:bg-slate-100 hover:text-slate-950" aria-label="Add activity"><Plus size={17} /></button></form></div>
          </div></div>
        </article>)}</div>}
+      </div>
+    </div>
  );
}
