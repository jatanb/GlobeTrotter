import { CalendarDays, Eye, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface SavedTrip {
  id: string;
  name: string;
  fromPlace?: string;
  toPlace?: string;
  startDate: string;
  endDate: string;
  description: string;
  coverName?: string;
  destinationCount?: number;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${date}T00:00:00`));
}

function loadTrips() {
  return JSON.parse(localStorage.getItem("globetrotter_trips") || "[]") as SavedTrip[];
}

export default function MyTripsPage() {
  const [trips, setTrips] = useState(loadTrips);
  const [expandedTripId, setExpandedTripId] = useState<string | null>(null);

  function deleteTrip(id: string) {
    const remainingTrips = trips.filter((trip) => trip.id !== id);
    localStorage.setItem("globetrotter_trips", JSON.stringify(remainingTrips));
    setTrips(remainingTrips);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-500">Your collection</p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">My trips</h1>
            <p className="mt-2 text-slate-600">{trips.length} {trips.length === 1 ? "trip" : "trips"} planned or in progress.</p>
          </div>
          <Link to="/trips/new" className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"><Plus size={17} /> Plan new trip</Link>
        </div>

        {trips.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <MapPin size={28} className="mx-auto text-slate-400" />
            <h2 className="mt-4 text-xl font-bold text-slate-950">No trips yet</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">Start shaping your next adventure and it will appear here.</p>
            <Link to="/trips/new" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"><Plus size={17} /> Create your first trip</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {trips.map((trip) => {
              const isExpanded = expandedTripId === trip.id;
              return (
                <article key={trip.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600"><MapPin size={22} /></div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3"><h2 className="text-xl font-bold text-slate-950">{trip.name}</h2><span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">Draft</span></div>
                        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500"><span className="inline-flex items-center gap-2"><MapPin size={16} /> {trip.fromPlace || "Starting point"} to {trip.toPlace || "Destination"}</span><span className="inline-flex items-center gap-2"><CalendarDays size={16} /> {formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span><span className="inline-flex items-center gap-2"><MapPin size={16} /> {trip.destinationCount || 0} destinations</span></div>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1 border-t border-slate-100 pt-3 sm:border-0 sm:pt-0">
                      <button type="button" onClick={() => setExpandedTripId(isExpanded ? null : trip.id)} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-950"><Eye size={16} /> {isExpanded ? "Hide" : "View"}</button>
                      <Link to={`/trips/new?edit=${trip.id}`} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-950"><Pencil size={16} /> Edit</Link>
                      <button type="button" onClick={() => deleteTrip(trip.id)} aria-label={`Delete ${trip.name}`} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button>
                    </div>
                  </div>
                  {isExpanded && <div className="mt-5 border-t border-slate-100 pt-4 text-sm leading-6 text-slate-600">{trip.description || "No description added yet."}{trip.coverName && <p className="mt-2 text-xs text-slate-400">Cover photo: {trip.coverName}</p>}</div>}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
