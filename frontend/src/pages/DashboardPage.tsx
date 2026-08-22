import {
  ArrowRight,
  MapPin,
  Sparkles,
  Wallet,
} from "lucide-react";

import { Link } from "react-router-dom";


export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

      {/* Header */}

      <section className="mb-8">

        <p className="mb-2 text-sm font-semibold text-slate-500">
          Welcome back
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Plan your next adventure.
        </h1>

        <p className="mt-3 max-w-2xl text-slate-600">
          Create personalized multi-city trips, organize your
          itinerary, discover experiences, and keep your budget
          under control.
        </p>

      </section>


      {/* Quick action */}

      <section className="mb-8 grid gap-4 md:grid-cols-3">

        <Link
          to="/trips/new"
          className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-lg"
        >

          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
            <MapPin size={21} />
          </div>

          <h2 className="font-semibold text-slate-900">
            Plan a new trip
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Build a personalized itinerary across multiple cities.
          </p>

          <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-slate-900">
            Get started
            <ArrowRight
              size={16}
              className="transition group-hover:translate-x-1"
            />
          </div>

        </Link>


        <div className="rounded-2xl border border-slate-200 bg-white p-6">

          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
            <Sparkles size={21} />
          </div>

          <h2 className="font-semibold text-slate-900">
            Discover destinations
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Explore cities and experiences for your next journey.
          </p>

        </div>


        <div className="rounded-2xl border border-slate-200 bg-white p-6">

          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
            <Wallet size={21} />
          </div>

          <h2 className="font-semibold text-slate-900">
            Track your budget
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Keep your travel expenses organized in one place.
          </p>

        </div>

      </section>


      {/* Empty state */}

      <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">

        <div className="mx-auto max-w-md">

          <h2 className="text-xl font-semibold text-slate-900">
            No trips yet
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Your upcoming and previous trips will appear here.
            Start by creating your first itinerary.
          </p>

          <Link
            to="/trips/new"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <MapPin size={17} />
            Create your first trip
          </Link>

        </div>

      </section>

    </div>
  );
}