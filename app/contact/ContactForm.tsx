"use client";
import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    // typed form extraction (no `any`)
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries()) as Record<string, string>;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("sent");
        e.currentTarget.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mt-8 rounded-2xl border bg-white/5 p-6 shadow md:p-8"
    >
      {/* honeypot */}
      <input type="text" name="_gotcha" className="hidden" />

      {/* GRID */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Row 1 */}
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

        {/* Row 2: Message (full width on md) */}
        <div className="md:col-span-3">
          <label className="mb-1 block text-sm text-slate-400">How can we help?</label>
          <textarea
            className="min-h-32 w-full rounded-xl border bg-slate-900/60 px-3 py-2 text-slate-100 outline-none ring-0 focus:border-blue-500"
            name="message"
            placeholder="Tell us about the home, issues you’re seeing, timelines, etc."
            required
          />
        </div>
        {/* Row 3: Address + Service */}
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
              {["Install","Guards","Repair","Cleaning","Drainage","Other"].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>


      {/* Actions + Status */}
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

      {/* Feedback */}
      {status === "sent" && (
        <p className="mt-4 text-sm text-green-500">Thanks! We got your request.</p>
      )}
      {status === "error" && (
        <p className="mt-4 text-sm text-red-500">
          Something went wrong. Please call (469) 431-4515.
        </p>
      )}
    </form>
  );
}
