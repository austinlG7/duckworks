"use client";
import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

type ApiResponse = {
  ok?: boolean;
  error?: string;
  id?: string | null;
};

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");

    // 🔒 Save the form ref BEFORE any await (avoid SyntheticEvent pooling)
    const form = e.currentTarget as HTMLFormElement;

    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries()) as Record<string, string>;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      // Try JSON first; if that fails, read as text so we can see what came back
      let body: ApiResponse | null = null;
      let raw = "";
      try {
        body = (await res.json()) as ApiResponse;
      } catch {
        try {
          raw = await res.text();
        } catch {
          /* ignore */
        }
      }

      const success = res.ok && (body?.ok ?? true);
      // Helpful console diagnostics
      console.groupCollapsed("%cContact submit result", "color:#0af");
      console.log("HTTP", res.status, res.statusText);
      console.log("JSON", body);
      if (!body) console.log("Raw response", raw);
      console.groupEnd();

      if (success) {
        form.reset();            // ✅ use saved ref
        setStatus("sent");
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error("Contact submit threw:", err);
      setStatus("error");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mt-8 rounded-2xl border bg-white/5 p-6 shadow md:p-8"
    >
      {/* honeypot (kept out of autofill/tab flow) */}
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, width: 0 }}
      />

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="col-span-1">
          <label className="mb-1 block text-sm text-slate-400">Name</label>
          <input
            className="w-full rounded-xl border bg-slate-900/60 px-3 py-2 text-slate-100 outline-none ring-0 focus:border-blue-500"
            name="name"
            placeholder="Full name"
            required
            autoComplete="name"
          />
        </div>

        <div className="col-span-1">
          <label className="mb-1 block text-sm text-slate-400">Email</label>
          <input
            className="w-full rounded-xl border bg-slate-900/60 px-3 py-2 text-slate-100 outline-none ring-0 focus:border-blue-500"
            name="email"
            type="email"
            placeholder="you@email.com"
            required
            autoComplete="email"
          />
        </div>

        <div className="col-span-1">
          <label className="mb-1 block text-sm text-slate-400">Phone</label>
          <input
            className="w-full rounded-xl border bg-slate-900/60 px-3 py-2 text-slate-100 outline-none ring-0 focus:border-blue-500"
            name="phone"
            type="tel"
            placeholder="(xxx) xxx-xxxx"
            autoComplete="tel"
          />
        </div>

        <div className="md:col-span-3">
          <label className="mb-1 block text-sm text-slate-400">How can we help?</label>
          <textarea
            className="min-h-32 w-full rounded-xl border bg-slate-900/60 px-3 py-2 text-slate-100 outline-none ring-0 focus:border-blue-500"
            name="message"
            placeholder="Tell us about the home, issues you’re seeing, timelines, etc."
            required
          />
        </div>

        <div className="md:col-span-3">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="col-span-1 md:col-span-2 min-w-0">
              <label className="mb-1 block text-sm text-slate-400">Service Address</label>
              <input
                className="w-full rounded-xl border bg-slate-900/60 px-3 py-2 text-slate-100 outline-none ring-0 focus:border-blue-500"
                name="address"
                placeholder="City, ZIP"
                autoComplete="address-line1"
              />
            </div>

            <div className="col-span-1 min-w-0">
              <label className="mb-1 block text-sm text-slate-400">Service</label>
              <select
                className="block w-full rounded-xl border bg-slate-900/60 px-3 py-2 text-slate-100 outline-none ring-0 focus:border-blue-500 appearance-none"
                name="service"
                defaultValue="Install"
              >
                {["Install", "Guards", "Repair", "Cleaning", "Drainage", "Other"].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
        <p className="text-xs text-slate-500">
          By submitting, you agree we may contact you by phone, text, or email about your request.
        </p>

        <button
          className="rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          type="submit"
          disabled={status === "sending"}
        >
          {status === "sending" ? "Sending…" : "Send Request"}
        </button>
      </div>

      {status === "sent" && (
        <p className="mt-4 text-sm text-green-500" role="status" aria-live="polite">
          Thanks! We got your request.
        </p>
      )}
      {status === "error" && (
        <p className="mt-4 text-sm text-red-500" role="alert" aria-live="assertive">
          Something went wrong. Please call (469) 431-4515.
        </p>
      )}
    </form>
  );
}
