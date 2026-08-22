import { useMemo, useState } from "react";
import { ArrowLeft, Check, Clock3, DollarSign, MapPin, Plus, Search, X } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

interface Activity {
  id: string;
  name: string;
  city: string;
  type: string;
  cost: string;
  duration: string;
  description: string;
  image: string;
  amount: number;
}

interface Stop {
  id: string;
  city: string;
  activities: string[];
  activityCosts?: Record<string, number>;
}

const activities: Activity[] = [
  { id: "street-food", name: "Mumbai street-food walk", city: "Mumbai", type: "Food", cost: "₹₹", amount: 1500, duration: "3 hours", description: "Taste iconic local snacks and learn the stories behind Mumbai's favorite flavors.", image: "https://images.unsplash.com/photo-1595658658481-d53d3f999875?auto=format&fit=crop&w=800&q=80" },
  { id: "forts", name: "Jaipur forts and bazaars", city: "Jaipur", type: "Sightseeing", cost: "₹", amount: 500, duration: "4 hours", description: "Explore royal courtyards, colorful markets, and the old city's pink streets.", image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80" },
  { id: "backwaters", name: "Alleppey backwater cruise", city: "Kochi", type: "Adventure", cost: "₹₹₹", amount: 3000, duration: "2.5 hours", description: "Glide through Kerala's quiet waterways aboard a traditional houseboat.", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80" },
  { id: "tea", name: "Munnar tea estate tour", city: "Munnar", type: "Sightseeing", cost: "₹₹", amount: 1500, duration: "4 hours", description: "Walk among misty tea gardens and discover how Kerala's famous tea is made.", image: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=800&q=80" },
  { id: "ghats", name: "Varanasi sunrise boat ride", city: "Varanasi", type: "Sightseeing", cost: "₹₹", amount: 1500, duration: "2 hours", description: "Watch the city wake along the Ganga from a peaceful early-morning boat.", image: "https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&w=800&q=80" },
  { id: "hills", name: "Shillong waterfall trail", city: "Shillong", type: "Adventure", cost: "₹", amount: 500, duration: "5 hours", description: "Follow a forest trail to dramatic waterfalls and wide views across Meghalaya.", image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80" },
];

export default function ActivitySearchPage() {
  const [searchParams] = useSearchParams();
  const tripId = searchParams.get("tripId");
  const stopId = searchParams.get("stopId");
  const trips = JSON.parse(localStorage.getItem("globetrotter_trips") || "[]") as { id: string }[];
  const activeTripId = tripId || trips[0]?.id;
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All types");
  const [cost, setCost] = useState("All costs");
  const [added, setAdded] = useState<string[]>([]);
  const [preview, setPreview] = useState<Activity | null>(null);

  const filteredActivities = useMemo(() => activities.filter((activity) => {
    const matchesQuery = `${activity.name} ${activity.city}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (type === "All types" || activity.type === type) && (cost === "All costs" || activity.cost === cost);
  }), [query, type, cost]);

  function toggleActivity(activity: Activity) {
    if (!activeTripId) return;
    const storageKey = `globetrotter_itinerary_${activeTripId}`;
    const stops = JSON.parse(localStorage.getItem(storageKey) || "[]") as Stop[];
    const targetStop = stops.find((stop) => stop.id === stopId) || stops.find((stop) => stop.city === activity.city) || stops[0];
    if (!targetStop) return;
    const alreadyAdded = targetStop.activities.includes(activity.name);
    targetStop.activities = alreadyAdded ? targetStop.activities.filter((item) => item !== activity.name) : [...targetStop.activities, activity.name];
    targetStop.activityCosts = { ...(targetStop.activityCosts || {}) };
    if (alreadyAdded) {
      delete targetStop.activityCosts[activity.name];
    } else {
      targetStop.activityCosts[activity.name] = activity.amount;
    }
    localStorage.setItem(storageKey, JSON.stringify(stops));
    setAdded((current) => alreadyAdded ? current.filter((id) => id !== activity.id) : [...current, activity.id]);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><Link to={activeTripId ? `/trips/${activeTripId}/itinerary` : "/trips"} className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950"><ArrowLeft size={16} /> Back to itinerary</Link><p className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-500">Discover</p><h1 className="text-3xl font-bold tracking-tight text-slate-950">Find things to do</h1><p className="mt-2 text-slate-600">Add memorable experiences to the stops in your route.</p></div><Link to={activeTripId ? `/discover/cities?tripId=${activeTripId}` : "/discover/cities"} className="text-sm font-semibold text-slate-700 hover:text-slate-950">Browse cities</Link>
        </div>
        <div className="mb-8 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row"><div className="relative flex-1"><Search size={18} className="pointer-events-none absolute left-3 top-3 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search activities or cities" className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10" /></div><select value={type} onChange={(event) => setType(event.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-950"><option>All types</option><option>Food</option><option>Sightseeing</option><option>Adventure</option></select><select value={cost} onChange={(event) => setCost(event.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-950"><option>All costs</option><option>₹</option><option>₹₹</option><option>₹₹₹</option></select></div>
        <div className="mb-4 flex items-center justify-between"><p className="text-sm text-slate-500">{filteredActivities.length} experiences found</p></div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{filteredActivities.map((activity) => { const isAdded = added.includes(activity.id); return <article key={activity.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><img src={activity.image} alt={activity.name} className="h-44 w-full object-cover" /><div className="p-5"><div className="flex items-start justify-between gap-3"><div><h2 className="font-bold text-slate-950">{activity.name}</h2><p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500"><MapPin size={14} /> {activity.city}</p></div><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{activity.type}</span></div><p className="mt-4 min-h-12 text-sm leading-5 text-slate-600">{activity.description}</p><div className="mt-4 flex items-center gap-4 text-xs text-slate-500"><span className="inline-flex items-center gap-1"><Clock3 size={14} /> {activity.duration}</span><span className="inline-flex items-center gap-1"><DollarSign size={14} /> {activity.cost}</span></div><div className="mt-5 flex gap-2"><button type="button" onClick={() => setPreview(activity)} className="flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Quick view</button><button type="button" onClick={() => toggleActivity(activity)} disabled={!activeTripId} className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-3 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50">{isAdded ? <Check size={16} /> : <Plus size={16} />} {isAdded ? "Added" : "Add"}</button></div></div></article>; })}</div>
        {preview && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4" role="dialog" aria-modal="true"><div className="max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl"><img src={preview.image} alt={preview.name} className="h-56 w-full object-cover" /><div className="p-6"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold text-slate-500">{preview.city} · {preview.type}</p><h2 className="mt-1 text-2xl font-bold text-slate-950">{preview.name}</h2></div><button type="button" onClick={() => setPreview(null)} aria-label="Close quick view" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-950"><X size={18} /></button></div><p className="mt-4 leading-6 text-slate-600">{preview.description}</p><div className="mt-5 flex gap-5 text-sm text-slate-500"><span className="inline-flex items-center gap-2"><Clock3 size={16} /> {preview.duration}</span><span className="inline-flex items-center gap-2"><DollarSign size={16} /> {preview.cost}</span></div></div></div></div>}
      </div>
    </div>
  );
}

