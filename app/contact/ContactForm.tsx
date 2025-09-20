// app/contact/ContactForm.tsx
"use client";
import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget) as any);

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
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 rounded-2xl bg-white p-6 shadow border space-y-4">
      <input type="text" name="_gotcha" className="hidden" />

      <input className="border rounded-xl px-3 py-2" name="name" placeholder="Name" required />
      <input className="border rounded-xl px-3 py-2" name="email" type="email" placeholder="Email" required />
      <input className="border rounded-xl px-3 py-2" name="phone" type="tel" placeholder="Phone" />
      <input className="border rounded-xl px-3 py-2" name="address" placeholder="Service Address (City, ZIP)" />

      <select className="border rounded-xl px-3 py-2" name="service">
        {["Install", "Guards", "Repair", "Cleaning", "Drainage", "Other"].map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <textarea className="border rounded-xl px-3 py-2 min-h-32" name="message" placeholder="How can we help?" required />

      <button
        className="rounded-2xl px-5 py-3 bg-blue-600 text-white font-semibold disabled:opacity-60"
        type="submit"
        disabled={status === "sending"}
      >
        {status === "sending" ? "Sending…" : "Send Request"}
      </button>

      {status === "sent" && <p className="text-green-700 text-sm">Thanks! We got your request.</p>}
      {status === "error" && <p className="text-red-700 text-sm">Something went wrong. Please call (469) 431-4515.</p>}

      <p className="text-xs text-slate-500">
        By submitting, you agree we may contact you by phone, text, or email about your request.
      </p>
    </form>
  );
}
