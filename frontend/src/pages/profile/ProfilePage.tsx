import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Check, Globe2, LogOut, Save, Trash2, UserRound, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface User { name?: string; email?: string; }

export default function ProfilePage() {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("globetrotter_user");
  const user = storedUser ? JSON.parse(storedUser) as User : {};
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [language, setLanguage] = useState(localStorage.getItem("globetrotter_language") || "English");
  const [photo, setPhoto] = useState(localStorage.getItem("globetrotter_profile_photo") || "");
  const [saved, setSaved] = useState(false);
  const destinations = ["Kyoto, Japan", "Lisbon, Portugal", "Marrakech, Morocco"];

  function handlePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(String(reader.result));
    reader.readAsDataURL(file);
  }

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    localStorage.setItem("globetrotter_user", JSON.stringify({ ...user, name: name.trim(), email: email.trim() }));
    localStorage.setItem("globetrotter_language", language);
    if (photo) localStorage.setItem("globetrotter_profile_photo", photo);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  function signOut() {
    localStorage.removeItem("globetrotter_token");
    navigate("/login");
  }

  function deleteAccount() {
    if (!window.confirm("Delete your account and all saved local trip data?")) return;
    ["globetrotter_token", "globetrotter_user", "globetrotter_trips", "globetrotter_language", "globetrotter_profile_photo"].forEach((key) => localStorage.removeItem(key));
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50"><div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
+      <div className="mb-8"><p className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-500">Account</p><h1 className="text-3xl font-bold tracking-tight text-slate-950">Profile & settings</h1><p className="mt-2 text-slate-600">Keep your account details and planning preferences up to date.</p></div>
+      <form onSubmit={saveProfile} className="space-y-6">
+        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><div className="mb-6 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600"><UserRound size={20} /></div><div><h2 className="font-bold text-slate-950">Personal information</h2><p className="text-sm text-slate-500">How you appear across GlobeTrotter.</p></div></div><div className="grid gap-5 sm:grid-cols-2"><div><label htmlFor="profile-name" className="mb-2 block text-sm font-semibold text-slate-800">Full name</label><input id="profile-name" required minLength={2} value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10" /></div><div><label htmlFor="profile-email" className="mb-2 block text-sm font-semibold text-slate-800">Email address</label><input id="profile-email" required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10" /></div></div><div className="mt-5"><label htmlFor="profile-photo" className="mb-2 block text-sm font-semibold text-slate-800">Profile photo</label><div className="flex items-center gap-4"><div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-slate-500">{photo ? <img src={photo} alt="Profile preview" className="h-full w-full object-cover" /> : <UserRound size={22} />}</div><label htmlFor="profile-photo" className="cursor-pointer rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Choose photo<input id="profile-photo" type="file" accept="image/*" onChange={handlePhoto} className="sr-only" /></label>{photo && <button type="button" onClick={() => setPhoto("")} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-red-600"><X size={15} /> Remove</button>}</div></div></section>
+        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><div className="mb-6 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700"><Globe2 size={20} /></div><div><h2 className="font-bold text-slate-950">Preferences</h2><p className="text-sm text-slate-500">Choose how the app communicates with you.</p></div></div><label htmlFor="language" className="mb-2 block text-sm font-semibold text-slate-800">Language</label><select id="language" value={language} onChange={(event) => setLanguage(event.target.value)} className="w-full max-w-sm rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"><option>English</option><option>Spanish</option><option>French</option><option>Japanese</option></select></section>
+        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><div className="mb-5 flex items-center justify-between"><div><h2 className="font-bold text-slate-950">Saved destinations</h2><p className="mt-1 text-sm text-slate-500">Places you may want to visit next.</p></div><span className="text-sm font-semibold text-slate-500">{destinations.length} saved</span></div><div className="flex flex-wrap gap-2">{destinations.map((destination) => <span key={destination} className="rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">{destination}</span>)}</div></section>
+        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><button type="submit" className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">{saved ? <Check size={17} /> : <Save size={17} />} {saved ? "Saved" : "Save changes"}</button><button type="button" onClick={signOut} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"><LogOut size={16} /> Sign out</button></div>
+      </form>
+      <section className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-6"><h2 className="font-bold text-red-900">Delete account</h2><p className="mt-1 text-sm text-red-800">This removes your local profile, trips, and preferences from this browser.</p><button type="button" onClick={deleteAccount} className="mt-4 inline-flex items-center gap-2 rounded-lg border border-red-300 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100"><Trash2 size={16} /> Delete account</button></section>
+    </div></div>
  );
}
