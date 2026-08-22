import { Map, Plus, Plane, Compass, Search, Wallet, CalendarDays, UserRound, ShieldCheck, Menu, X } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useState } from "react";


export default function AppLayout() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const storedUser = localStorage.getItem("globetrotter_user");
  const isAdmin = storedUser ? (JSON.parse(storedUser) as { is_admin?: boolean }).is_admin : false;

  const navigation = [
    {
      label: "Dashboard",
      path: "/",
      icon: Compass,
    },
    {
      label: "My Trips",
      path: "/trips",
      icon: Plane,
    },
    {
      label: "Discover",
      path: "/discover/cities",
      icon: Search,
    },
    {
      label: "Budget",
      path: "/budget",
      icon: Wallet,
    },
    {
      label: "Calendar",
      path: "/calendar",
      icon: CalendarDays,
    },
  ];


  return (
    <div className="min-h-screen bg-slate-50">

      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
              <Map size={20} />
            </div>

            <div>
              <div className="text-lg font-bold tracking-tight text-slate-900">
                GlobeTrotter
              </div>

              <div className="hidden text-xs text-slate-500 sm:block">
                Plan. Explore. Experience.
              </div>
            </div>
          </Link>


          <nav className="hidden items-center gap-1 md:flex">

            {navigation.map((item) => {
              const Icon = item.icon;

              const active = item.path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon size={17} />
                  {item.label}
                </Link>
              );
            })}

          </nav>


          <Link
            to="/trips/new"
            className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <Plus size={17} />
            <span className="hidden sm:inline">
              Plan New Trip
            </span>
          </Link>

          <Link to="/profile" aria-label="Open profile settings" className="ml-2 rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-950">
            <UserRound size={19} />
          </Link>
          {isAdmin && <Link to="/admin" aria-label="Open admin dashboard" className="ml-1 rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-950"><ShieldCheck size={19} /></Link>}
          <button type="button" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation menu" aria-expanded={menuOpen} className="ml-1 rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

        </div>

        {menuOpen && <nav className="border-t border-slate-100 bg-white px-4 py-3 md:hidden sm:px-6">
          {navigation.map((item) => { const Icon = item.icon; const active = item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path); return <Link key={item.path} to={item.path} onClick={() => setMenuOpen(false)} className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold ${active ? "bg-slate-100 text-slate-950" : "text-slate-600 hover:bg-slate-50"}`}><Icon size={17} /> {item.label}</Link>; })}
          {isAdmin && <Link to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"><ShieldCheck size={17} /> Admin</Link>}
        </nav>}

      </header>


      <main>
        <Outlet />
      </main>

    </div>
  );
}