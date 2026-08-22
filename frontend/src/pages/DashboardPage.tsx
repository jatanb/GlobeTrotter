import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  CircleDollarSign,
  MapPin,
  Plane,
  Plus,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

const recentTrips = [
  { name: "Japan in Spring", route: "Tokyo - Kyoto - Osaka", dates: "Apr 12 - Apr 24, 2026", status: "Planning", color: "bg-rose-100 text-rose-700" },
  { name: "A weekend in Lisbon", route: "Lisbon - Sintra", dates: "Jun 06 - Jun 09, 2026", status: "Draft", color: "bg-amber-100 text-amber-700" },
];

const destinations = [
  { city: "Kyoto", country: "Japan", detail: "Culture and calm", color: "bg-red-100" },
  { city: "Lisbon", country: "Portugal", detail: "Coastal city breaks", color: "bg-sky-100" },
  { city: "Marrakech", country: "Morocco", detail: "Markets and color", color: "bg-orange-100" },
];

export default function DashboardPage() {
  const storedUser = localStorage.getItem("globetrotter_user");
  let userName = "traveller";

  if (storedUser) {
    try {
      userName = (JSON.parse(storedUser) as { name?: string }).name?.split(" ")[0] || userName;
    } catch {
      userName = "traveller";
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-500">Your travel workspace</p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Good morning, {userName}.</h1>
            <p className="mt-2 max-w-xl text-slate-600">Keep your plans moving and find the next place worth getting lost in.</p>
          </div>
          <Link to="/trips/new" className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
            <Plus size={17} /> Plan new trip
          </Link>
        </section>

        <section className="mb-8 grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="relative overflow-hidden rounded-2xl bg-slate-950 p-6 text-white sm:p-8">
            <div className="relative z-10 max-w-lg">
              <div className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-300"><Plane size={16} /> Next on your calendar</div>
              <p className="text-sm text-slate-400">12 days from now</p>
              <h2 className="mt-1 text-2xl font-bold">Japan in Spring</h2>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-300">
                <span className="inline-flex items-center gap-2"><MapPin size={15} /> Tokyo, Kyoto, Osaka</span>
                <span className="inline-flex items-center gap-2"><CalendarDays size={15} /> Apr 12 - Apr 24</span>
              </div>
              <Link to="/trips" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-slate-300">Open itinerary <ArrowRight size={16} /></Link>
            </div>
            <div className="absolute -right-10 -top-16 h-64 w-64 rounded-full border-[32px] border-slate-800/80" />
            <div className="absolute -bottom-24 right-24 h-48 w-48 rounded-full border-[24px] border-slate-800/50" />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700"><CircleDollarSign size={21} /></div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">On track</span>
            </div>
            <p className="mt-7 text-sm font-medium text-slate-500">Japan trip budget</p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-slate-950">$2,480</p>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full w-[62%] rounded-full bg-emerald-500" /></div>
            <div className="mt-2 flex justify-between text-xs text-slate-500"><span>$1,540 spent</span><span>$2,480 limit</span></div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div><h2 className="text-xl font-bold text-slate-950">Recent trips</h2><p className="mt-1 text-sm text-slate-500">Pick up where you left off.</p></div>
              <Link to="/trips" className="inline-flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-slate-950">View all <ChevronRight size={16} /></Link>
            </div>
            <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white px-5">
              {recentTrips.map((trip) => (
                <div key={trip.name} className="flex items-center justify-between gap-4 py-5">
                  <div className="flex min-w-0 items-center gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600"><MapPin size={19} /></div><div className="min-w-0"><h3 className="truncate font-semibold text-slate-900">{trip.name}</h3><p className="mt-1 truncate text-sm text-slate-500">{trip.route}</p><p className="mt-1 text-xs text-slate-400">{trip.dates}</p></div></div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${trip.color}`}>{trip.status}</span>
                </div>
              ))}
              <Link to="/trips/new" className="flex items-center gap-2 py-4 text-sm font-semibold text-slate-700 hover:text-slate-950"><Plus size={16} /> Start another trip</Link>
            </div>
          </div>

          <div>
            <div className="mb-4"><h2 className="text-xl font-bold text-slate-950">Worth discovering</h2><p className="mt-1 text-sm text-slate-500">Ideas for your next route.</p></div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {destinations.map((destination) => (
                <div key={destination.city} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm">
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${destination.color}`}><Sparkles size={20} className="text-slate-700" /></div>
                  <div><h3 className="font-semibold text-slate-900">{destination.city}</h3><p className="text-sm text-slate-500">{destination.country}</p><p className="mt-1 text-xs font-medium text-slate-400">{destination.detail}</p></div>
                  <ChevronRight size={17} className="ml-auto text-slate-400" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
