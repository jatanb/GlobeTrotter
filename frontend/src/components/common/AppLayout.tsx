import { Map, Plus, Plane, Compass } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";


export default function AppLayout() {
  const location = useLocation();

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

              const active =
                location.pathname === item.path;

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

        </div>

      </header>


      <main>
        <Outlet />
      </main>

    </div>
  );
}