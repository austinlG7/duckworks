"use client";
import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries()) as Record<string, string>;

    // type guard to check for `{ ok: true }`
    function hasOkTrue(x: unknown): x is { ok: boolean } {
      return (
        typeof x === "object" &&
        x !== null &&
        "ok" in x &&
        (x as Record<string, unknown>).ok === true
      );
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      // try to parse JSON; if it fails but status is 2xx, still treat as success
      let json: unknown = null;
      try {
        json = await res.json();
      } catch {
        /* ignore parse error */
      }

      const success =
        (res.ok && hasOkTrue(json)) ||
        (res.ok && json === null); // 2xx with non-JSON body

      if (success) {
        setStatus("sent");
        e.currentTarget.reset();
        return;
      }

      setStatus("error");
    } catch {
      setStatus("error");
    }
  }



  // Consistent field styles (light UI, clear borders, good focus state)
  const baseField =
    "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 " +
    "outline-none ring-0 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition";

  return (
    <form
      onSubmit={onSubmit}
      className="mt-8 rounded-2xl border bg-white p-6 shadow md:p-8"
      aria-labelledby="quote-form-title"
    >
      {/* honeypot */}
      <input type="text" name="_gotcha" className="hidden" tabIndex={-1} />

      <div className="mb-6">
        <h2 id="quote-form-title" className="text-xl font-semibold">
          Get your free quote
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Tell us about your home and what you need. We’ll reply quickly.
        </p>
      </div>

      {/* Single responsive grid: 1 col on mobile, 12 cols on md+ */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        {/* Row 1: Name / Email / Phone (three equal columns on md+) */}
        <div className="md:col-span-4">
          <label className="mb-1 block text-sm text-slate-600">Name<span className="text-red-500">*</span></label>
          <input
            className={baseField}
            name="name"
            placeholder="Full name"
            required
            autoComplete="name"
          />
        </div>

        <div className="md:col-span-4">
          <label className="mb-1 block text-sm text-slate-600">Email<span className="text-red-500">*</span></label>
          <input
            className={baseField}
            name="email"
            type="email"
            placeholder="you@email.com"
            required
            autoComplete="email"
          />
        </div>

        <div className="md:col-span-4">
          <label className="mb-1 block text-sm text-slate-600">Phone</label>
          <input
            className={baseField}
            name="phone"
            type="tel"
            placeholder="(xxx) xxx-xxxx"
            autoComplete="tel"
          />
        </div>

        {/* Row 2: Message (full width) */}
        <div className="md:col-span-12">
          <label className="mb-1 block text-sm text-slate-600">
            How can we help?<span className="text-red-500">*</span>
          </label>
          <textarea
            className={`${baseField} min-h-32`}
            name="message"
            placeholder="Tell us about the home, issues you’re seeing, timelines, etc."
            required
          />
        </div>

        {/* Row 3: Address (8) + Service (4) on md+ */}
        <div className="md:col-span-8">
          <label className="mb-1 block text-sm text-slate-600">Service Address</label>
          <input
            className={baseField}
            name="address"
            placeholder="City, ZIP"
            autoComplete="address-line1"
          />
        </div>

        <div className="md:col-span-4">
          <label className="mb-1 block text-sm text-slate-600">Service</label>
          <div className="relative">
            <select
              className={`${baseField} appearance-none pr-9`}
              name="service"
              defaultValue="Install"
            >
              {["Install", "Guards", "Repair", "Cleaning", "Drainage", "Other"].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {/* simple caret */}
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
              ▾
            </span>
          </div>
        </div>

        {/* Row 4: Actions + legal copy (full width) */}
        <div className="md:col-span-12 mt-2 flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
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
      </div>

      {/* Feedback */}
      {status === "sent" && (
        <p className="mt-4 text-sm text-green-600">Thanks! We got your request.</p>
      )}
      {status === "error" && (
        <p className="mt-4 text-sm text-red-600">
          Something went wrong. Please call (469) 431-4515.
        </p>
      )}
    </form>
  );
}
