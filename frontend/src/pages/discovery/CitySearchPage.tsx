import { useMemo, useState } from "react";
import { Check, MapPin, Search, SlidersHorizontal } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

interface City {
  id: string;
  name: string;
  country: string;
  region: string;
  cost: string;
  popularity: string;
  description: string;
  image: string;
}

interface SavedTrip {
  id: string;
  startDate: string;
  endDate: string;
}

interface Stop {
  id: string;
  city: string;
  startDate: string;
  endDate: string;
  activities: string[];
}

const cities: City[] = [
  { id: "tokyo", name: "Tokyo", country: "Japan", region: "Asia", cost: "High", popularity: "98%", description: "Neon nights, quiet shrines, and endless neighborhoods to explore.", image: "https://images.unsplash.com/photo-1540959733332-eab4de?auto=format&fit=crop&w=800&q=80" },
  { id: "kyoto", name: "Kyoto", country: "Japan", region: "Asia", cost: "Medium", popularity: "94%", description: "A slower rhythm of temples, gardens, and remarkable seasonal food.", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80" },
  { id: "lisbon", name: "Lisbon", country: "Portugal", region: "Europe", cost: "Medium", popularity: "91%", description: "Sunlit streets, tiled facades, and a beautiful Atlantic edge.", image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=800&q=80" },
  { id: "marrakech", name: "Marrakech", country: "Morocco", region: "Africa", cost: "Low", popularity: "88%", description: "Colorful souks, rooftop dinners, and desert landscapes nearby.", image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=800&q=80" },
  { id: "paris", name: "Paris", country: "France", region: "Europe", cost: "High", popularity: "96%", description: "Grand boulevards, small cafés, and art around every corner.", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80" },
  { id: "barcelona", name: "Barcelona", country: "Spain", region: "Europe", cost: "Medium", popularity: "93%", description: "Bold architecture, late dinners, and a city made for wandering.", image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80" },
];

export default function CitySearchPage() {
  const [searchParams] = useSearchParams();
  const tripId = searchParams.get("tripId");
  const trips = JSON.parse(localStorage.getItem("globetrotter_trips") || "[]") as SavedTrip[];
  const trip = trips.find((item) => item.id === tripId) || trips[0];
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("All regions");
  const [addedCities, setAddedCities] = useState<string[]>([]);

  const filteredCities = useMemo(() => cities.filter((city) => {
    const matchesQuery = `${city.name} ${city.country}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (region === "All regions" || city.region === region);
  }), [query, region]);

  function addCity(city: City) {
    if (!trip) return;
    const storageKey = `globetrotter_itinerary_${trip.id}`;
    const stops = JSON.parse(localStorage.getItem(storageKey) || "[]") as Stop[];
    stops.push({ id: crypto.randomUUID(), city: city.name, startDate: trip.startDate, endDate: trip.endDate, activities: [] });
    localStorage.setItem(storageKey, JSON.stringify(stops));
    setAddedCities((current) => [...current, city.id]);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><p className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-500">Discover</p><h1 className="text-3xl font-bold tracking-tight text-slate-950">Find your next city</h1><p className="mt-2 text-slate-600">Compare places at a glance and add the right stops to your route.</p></div>
          <Link to={trip ? `/trips/${trip.id}/itinerary` : "/trips"} className="text-sm font-semibold text-slate-700 hover:text-slate-950">Back to itinerary</Link>
        </div>
        <div className="mb-8 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">
          <div className="relative flex-1"><Search size={18} className="pointer-events-none absolute left-3 top-3 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search cities or countries" className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10" /></div>
          <div className="relative sm:w-52"><SlidersHorizontal size={16} className="pointer-events-none absolute left-3 top-3 text-slate-400" /><select value={region} onChange={(event) => setRegion(event.target.value)} className="w-full appearance-none rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-slate-950"><option>All regions</option><option>Asia</option><option>Europe</option><option>Africa</option></select></div>
        </div>
        <div className="mb-4 flex items-center justify-between"><p className="text-sm text-slate-500">{filteredCities.length} destinations found</p><Link to="/discover/activities" className="text-sm font-semibold text-slate-700 hover:text-slate-950">Browse activities</Link></div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCities.map((city) => { const isAdded = addedCities.includes(city.id); return <article key={city.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><img src={city.image} alt={`${city.name}, ${city.country}`} className="h-44 w-full object-cover" /><div className="p-5"><div className="flex items-start justify-between gap-3"><div><h2 className="text-xl font-bold text-slate-950">{city.name}</h2><p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500"><MapPin size={14} /> {city.country}</p></div><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{city.region}</span></div><p className="mt-4 min-h-12 text-sm leading-5 text-slate-600">{city.description}</p><div className="mt-5 grid grid-cols-2 gap-3 border-y border-slate-100 py-3 text-xs"><span><b className="block text-slate-900">{city.cost}</b><span className="text-slate-500">Cost index</span></span><span><b className="block text-slate-900">{city.popularity}</b><span className="text-slate-500">Popularity</span></span></div><button type="button" onClick={() => addCity(city)} disabled={isAdded || !trip} className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-emerald-600">{isAdded ? <><Check size={16} /> Added to trip</> : <><PlusIcon /> Add to trip</>}</button></div></article>; })}
        </div>
      </div>
    </div>
  );
}

function PlusIcon() {
  return <span aria-hidden="true" className="text-lg leading-none">+</span>;
}
