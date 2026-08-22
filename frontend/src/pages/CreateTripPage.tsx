import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { ArrowLeft, CalendarDays, ImagePlus, Save } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

interface SavedTrip {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  description: string;
  coverName?: string;
}

export default function CreateTripPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editingId = searchParams.get("edit");
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [cover, setCover] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!editingId) {
      return;
    }

    const savedTrips = JSON.parse(localStorage.getItem("globetrotter_trips") || "[]") as SavedTrip[];
    const trip = savedTrips.find((savedTrip) => savedTrip.id === editingId);
    if (trip) {
      setName(trip.name);
      setStartDate(trip.startDate);
      setEndDate(trip.endDate);
      setDescription(trip.description);
    }
  }, [editingId]);

  useEffect(() => {
    if (!cover) {
      setCoverPreview("");
      return;
    }

    const previewUrl = URL.createObjectURL(cover);
    setCoverPreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [cover]);

  function handleCoverChange(event: ChangeEvent<HTMLInputElement>) {
    setCover(event.target.files?.[0] || null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (endDate < startDate) {
      setError("The end date must be on or after the start date.");
      return;
    }

    const savedTrips = JSON.parse(localStorage.getItem("globetrotter_trips") || "[]") as SavedTrip[];
    const savedTrip = {
      id: crypto.randomUUID(),
      name: name.trim(),
      startDate,
      endDate,
      description: description.trim(),
      coverName: cover?.name,
    };
    const updatedTrips = editingId
      ? savedTrips.map((trip) => trip.id === editingId ? { ...trip, ...savedTrip, id: editingId } : trip)
      : [...savedTrips, savedTrip];
    localStorage.setItem("globetrotter_trips", JSON.stringify(updatedTrips));
    navigate("/trips");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950">
          <ArrowLeft size={16} /> Back to dashboard
        </Link>

        <div className="mb-8 mt-7">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-500">{editingId ? "Edit itinerary" : "New itinerary"}</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">{editingId ? "Edit your trip" : "Create a new trip"}</h1>
          <p className="mt-2 text-slate-600">Give your journey a name, a timeframe, and a little character.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            {error && <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

            <div className="space-y-6">
              <div>
                <label htmlFor="trip-name" className="mb-2 block text-sm font-semibold text-slate-800">Trip name</label>
                <input id="trip-name" type="text" required minLength={2} value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Kerala in Monsoon" className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10" />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="start-date" className="mb-2 block text-sm font-semibold text-slate-800">Start date</label>
                  <div className="relative"><CalendarDays size={17} className="pointer-events-none absolute left-3 top-3 text-slate-400" /><input id="start-date" type="date" required value={startDate} onChange={(event) => setStartDate(event.target.value)} className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10" /></div>
                </div>
                <div>
                  <label htmlFor="end-date" className="mb-2 block text-sm font-semibold text-slate-800">End date</label>
                  <div className="relative"><CalendarDays size={17} className="pointer-events-none absolute left-3 top-3 text-slate-400" /><input id="end-date" type="date" required min={startDate} value={endDate} onChange={(event) => setEndDate(event.target.value)} className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10" /></div>
                </div>
              </div>

              <div>
                <label htmlFor="trip-description" className="mb-2 block text-sm font-semibold text-slate-800">Trip description <span className="font-normal text-slate-400">(optional)</span></label>
                <textarea id="trip-description" rows={6} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What do you want to see, do, or remember?" className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10" />
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-slate-900">Cover photo <span className="font-normal text-slate-400">(optional)</span></h2>
              <label htmlFor="cover-photo" className="mt-4 block cursor-pointer overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50 text-center transition hover:border-slate-500">
                {coverPreview ? <img src={coverPreview} alt="Selected trip cover preview" className="h-40 w-full object-cover" /> : <div className="flex h-40 flex-col items-center justify-center gap-2 px-4 text-sm text-slate-500"><ImagePlus size={24} /><span>Choose an image</span><span className="text-xs text-slate-400">JPG, PNG up to 10MB</span></div>}
                <input id="cover-photo" type="file" accept="image/png,image/jpeg,image/webp" onChange={handleCoverChange} className="sr-only" />
              </label>
              {cover && <p className="mt-2 truncate text-xs text-slate-500">{cover.name}</p>}
            </div>

            <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"><Save size={17} /> {editingId ? "Update trip" : "Save trip"}</button>
          </aside>
        </form>
      </div>
    </div>
  );
}