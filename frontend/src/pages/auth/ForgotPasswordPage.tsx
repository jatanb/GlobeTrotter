import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowLeft, KeyRound, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { apiRequest } from "../../api/client";


export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [developmentUrl, setDevelopmentUrl] = useState("");


  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await apiRequest<{ message: string; development_reset_url?: string }>(
        "/auth/forgot-password",
        {
          method: "POST",
          body: JSON.stringify({ email }),
        },
      );
      setDevelopmentUrl(response.development_reset_url || "");
      setSubmitted(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to send reset instructions");
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white">
            <KeyRound size={24} />
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Reset your password
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Enter your email and we will help you get back to your journeys.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          {submitted ? (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-800">
              If an account exists for <strong>{email}</strong>, reset instructions have been prepared.
              {developmentUrl && <p className="mt-3 break-all text-xs text-emerald-900">Local reset link: {developmentUrl}</p>}
            </div>
          ) : (
            <>
              {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
              <label
                htmlFor="reset-email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email address
              </label>

              <input
                id="reset-email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              />

              <button
                type="submit"
                disabled={loading}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 font-semibold text-white transition hover:bg-slate-800"
              >
                {loading ? "Sending..." : "Send reset link"}
                {!loading && <Send size={17} />}
              </button>
            </>
          )}

          <Link
            to="/login"
            className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-950 hover:underline"
          >
            <ArrowLeft size={16} />
            Back to sign in
          </Link>
        </form>
      </div>
    </div>
  );
}