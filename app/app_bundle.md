# Source Bundle for `app`

> Generated in Jupyter. Each section shows the file path and its contents.

---

## `[city]/page.tsx`

```tsx
import { cities } from "../../content/cities";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  // you can keep this async or make it sync — either is fine
  return cities.map(c => ({ city: c.slug }));
}
export const dynamicParams = false;

export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params; // 👈 lazy params in Next 15
  const c = cities.find(x => x.slug === city);
  if (!c) return notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold">
        Seamless Gutters in {c.city}, {c.state}
      </h1>
      <p className="mt-3 text-slate-700">{c.intro}</p>

      {!!(c.neighborhoods?.length) && (
        <ul className="mt-4 flex flex-wrap gap-2 text-sm text-slate-600">
          {c.neighborhoods!.map(n => (
            <li key={n} className="px-2 py-1 bg-white rounded border">
              {n}
            </li>
          ))}
        </ul>
      )}

      <section className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="rounded-2xl bg-white p-6 shadow border">
          <h2 className="text-xl font-semibold">Services in {c.city}</h2>
          <ul className="mt-3 list-disc pl-5 text-slate-700">
            <li>Seamless aluminum gutters (5”/6” K-style)</li>
            <li>Gutter guards & oversized downspouts</li>
            <li>Repairs, tune-ups & resealing</li>
            <li>Drainage & French drains</li>
          </ul>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow border">
          <h2 className="text-xl font-semibold">Local Considerations</h2>
          <p className="mt-3 text-slate-700">
            Landmarks: {(c.landmarks ?? []).join(", ") || "—"}. Seasonal sizing and layouts
            tailored to local rainfall and roof pitch norms.
          </p>
        </div>
      </section>

      {!!c.faqs?.length && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold">FAQs for {c.city}</h2>
          <div className="mt-4 space-y-4">
            {c.faqs!.map((f, i) => (
              <details key={i} className="rounded-2xl bg-white p-4 shadow border">
                <summary className="cursor-pointer font-medium">{f.q}</summary>
                <p className="mt-2 text-slate-700">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        <iframe
          className="w-full h-64 rounded-2xl border-0"
          loading="lazy"
          src={`https://www.google.com/maps?q=${encodeURIComponent(c.city + " " + c.state)}&output=embed`}
        />
      </section>
    </div>
  );
}

```

---

## `about/page.tsx`

```tsx
// app/about/page.tsx
export const metadata = { title: "About | Duck Works" };

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold">Meet Duck Works — Aqua Management Solutions</h1>
      <p className="mt-3 text-slate-700">
        Duck Works was founded with a simple goal: protect Texas homes from water damage with professional gutter systems that last.
        We’re fully insured, trained for safety, and committed to clean, respectful service on every job.
      </p>
      <div className="mt-6 rounded-2xl bg-white p-6 shadow border">
        <h2 className="text-xl font-semibold">Our Promise</h2>
        <ul className="mt-3 list-disc pl-5 text-slate-700">
          <li>Honest estimates and clear communication.</li>
          <li>Quality materials sized for real Texas weather.</li>
          <li>Workmanship we stand behind with warranties.</li>
        </ul>
      </div>
    </div>
  );
}

```

---

## `api/contact/route.ts`

```ts
// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs"; // Resend SDK requires Node runtime

const resend = new Resend(process.env.RESEND_API_KEY);

// small helper to sanitize/limit input
function pick(x?: string, n = 2000) {
  return (x ?? "").toString().trim().slice(0, n);
}

/** GET /api/contact  -> quick health check (no secrets) */
export async function GET() {
  const hasKey = !!process.env.RESEND_API_KEY;
  const hasTo = !!(process.env.EMAIL_TO || "").trim();
  const from = (process.env.EMAIL_FROM || "notifications@onresend.com").trim();
  return NextResponse.json({
    ok: true,
    runtime: "node",
    configured: { RESEND_API_KEY: hasKey, EMAIL_TO: hasTo, EMAIL_FROM: from },
  });
}

/** POST /api/contact -> form submit */
export async function POST(req: Request) {
  try {
    // accept JSON or form-encoded
    const ct = req.headers.get("content-type") || "";
    let data: Record<string, string> = {};
    if (ct.includes("application/json")) {
      data = await req.json();
    } else {
      const form = await req.formData();
      form.forEach((v, k) => (data[k] = String(v)));
    }

    // honeypot
    if (data._gotcha) return NextResponse.json({ ok: true });

    // fields
    const name = pick(data.name);
    const email = pick(data.email);
    const phone = pick(data.phone);
    const address = pick(data.address);
    const service = pick(data.service);
    const message = pick(data.message, 8000);

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // env checks
    const to = (process.env.EMAIL_TO || "").trim(); // your receiving inbox
    const from = (process.env.EMAIL_FROM || "notifications@onresend.com").trim(); // must be verified or onresend.com
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { ok: false, error: "Server not configured: RESEND_API_KEY missing" },
        { status: 500 }
      );
    }
    if (!to) {
      return NextResponse.json(
        { ok: false, error: "Server not configured: EMAIL_TO missing" },
        { status: 500 }
      );
    }

    const html = `
      <h2>New Quote Request — Duck Works</h2>
      <p><b>Name:</b> ${name}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Phone:</b> ${phone || "-"}</p>
      <p><b>Address:</b> ${address || "-"}</p>
      <p><b>Service:</b> ${service || "-"}</p>
      <p><b>Message:</b></p>
      <p>${message.replace(/\n/g, "<br/>")}</p>
    `;

    const result = await resend.emails.send({
      from: `Duck Works <${from}>`, // ✅ FROM = your domain/alias (or notifications@onresend.com)
      to: [to],                     // ✅ TO = where you receive the lead
      replyTo: email,               // ✅ REPLY-TO = customer email (so “Reply” goes to them)
      subject: `New Quote Request from ${name}`,
      html,
      text:
        `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n` +
        `Address: ${address}\nService: ${service}\n\n${message}`,
    });

    // v6 returns { data, error }
    if ("error" in result && result.error) {
      console.error("Resend error:", result.error);
      return NextResponse.json(
        { ok: false, error: `Email failed: ${result.error.message || "unknown"}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
    } catch (e: unknown) {
    const msg =
      e instanceof Error ? e.message : typeof e === "string" ? e : "Server error";
    console.error("Contact API error:", e);
    return NextResponse.json({ ok: false, error: String(msg) }, { status: 500 });
     }

}

```

---

## `contact/ContactForm.tsx`

```tsx
"use client";
import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const fd   = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries()) as Record<string, string>;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      // ✅ any 2xx status → success
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

      {/* MAIN GRID */}
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
          <label className="mb-1 block text-sm text-slate-400">
            How can we help?
          </label>
          <textarea
            className="min-h-32 w-full rounded-xl border bg-slate-900/60 px-3 py-2 text-slate-100 outline-none ring-0 focus:border-blue-500"
            name="message"
            placeholder="Tell us about the home, issues you’re seeing, timelines, etc."
            required
          />
        </div>

        {/* Row 3: Address + Service (nested grid for this row only) */}
        <div className="md:col-span-3">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="col-span-1 md:col-span-2 min-w-0">
              <label className="mb-1 block text-sm text-slate-400">
                Service Address
              </label>
              <input
                className="w-full rounded-xl border bg-slate-900/60 px-3 py-2 text-slate-100 outline-none ring-0 focus:border-blue-500"
                name="address"
                placeholder="City, ZIP"
                autoComplete="address-line1"
              />
            </div>

            <div className="col-span-1 min-w-0">
              <label className="mb-1 block text-sm text-slate-400">
                Service
              </label>
              <select
                className="block w-full rounded-xl border bg-slate-900/60 px-3 py-2 text-slate-100 outline-none ring-0 focus:border-blue-500 appearance-none"
                name="service"
                defaultValue="Install"
              >
                {["Install", "Guards", "Repair", "Cleaning", "Drainage", "Other"].map(
                  (s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>
        </div>
      </div>
      {/* <-- CLOSES MAIN GRID ABOVE */}

      {/* Actions + Status */}
      <div className="mt-6 flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
        <p className="text-xs text-slate-500">
          By submitting, you agree we may contact you by phone, text, or email
          about your request.
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
        <p className="mt-4 text-sm text-green-500">
          Thanks! We got your request.
        </p>
      )}
      {status === "error" && (
        <p className="mt-4 text-sm text-red-500">
          Something went wrong. Please call (469) 431-4515.
        </p>
      )}
    </form>
  );
}

```

---

## `contact/page.tsx`

```tsx
import ContactForm from "./ContactForm";

export const metadata = { title: "Contact | Duck Works" };

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold">Request Your Free Estimate</h1>
      <p className="mt-3 text-slate-400">
        Tell us about your home and what you need. We’ll reply quickly.
      </p>

      <ContactForm />

      <div className="mt-8 text-sm">
        Prefer to talk?{" "}
        <a className="text-blue-500 underline" href="tel:+14694314515">
          Call now
        </a>{" "}
        or{" "}
        <a className="text-blue-500 underline" href="mailto:help@goduckworks.com">
          email us
        </a>.
      </div>
    </div>
  );
}

```

---

## `globals.css`

```css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: Arial, Helvetica, sans-serif;
}

```

---

## `layout.tsx`

```tsx
// app/layout.tsx
import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Duck Works — Aqua Management Solutions",
  description:
    "Seamless gutters, gutter guards, repairs, and drainage solutions. Free on-site estimates. Licensed & insured.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-800">
        {/* HEADER */}
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-extrabold">🦆 Duck Works</span>
              <span className="text-sm text-slate-500">Aqua Management Solutions</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link href="/services">Services</Link>
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
              {/* External/tel links can remain <a> */}
              <a
                href="tel:+14694314515"
                className="rounded-2xl px-4 py-2 bg-blue-600 text-white"
              >
                Call Now
              </a>
            </nav>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main>{children}</main>

        {/* FOOTER */}
        <footer className="mt-16 border-t">
          <div className="max-w-6xl mx-auto px-4 py-8 text-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Duck Works</span>
              <span className="text-slate-500">Aqua Management Solutions</span>
            </div>
            <div className="text-slate-500">
              &copy; {new Date().getFullYear()} Duck Works. All rights reserved.
            </div>
          </div>
        </footer>

        {/* Sticky mobile call button */}
        <div className="md:hidden fixed bottom-4 left-0 right-0 flex justify-center pointer-events-none">
          <a
            href="tel:+14694314515"
            className="pointer-events-auto rounded-full px-6 py-3 shadow-lg bg-blue-600 text-white font-semibold"
          >
            📞 Call (469) 431-4515
          </a>
        </div>
      </body>
    </html>
  );
}

```

---

## `page.tsx`

```tsx
// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* HERO */}
      <section className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Keep Water Moving. Keep Homes Dry.
          </h1>
          <p className="mt-4 text-slate-700">
            Seamless gutters, gutter guards, repairs, and drainage solutions that protect your home year-round.
            Licensed & insured. Free on-site estimates. 24/7 response.
          </p>
          <div className="mt-6 flex gap-3">
            <Link href="/contact" className="rounded-2xl px-5 py-3 bg-blue-600 text-white">
              Get a Free Estimate
            </Link>
          <a href="tel:+14694314515" className="rounded-2xl px-5 py-3 border">
            Call Now
          </a>
          </div>
          <ul className="mt-6 flex flex-wrap gap-2 text-xs text-slate-600">
            {["Licensed & Insured","24/7 Response","Warranty on All Installs"].map(b=>(
              <li key={b} className="px-3 py-1 bg-white rounded-xl border">{b}</li>
            ))}
          </ul>
        </div>
        <div className="flex items-center justify-center">
          <div className="w-56 h-56 rounded-full bg-white shadow flex items-center justify-center text-6xl">🦆</div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold">Our Services</h2>
        <p className="text-slate-700 mt-2">
          Expert installation, durable materials, and honest service. We keep water flowing the right way.
        </p>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {t:"Seamless Aluminum Gutters",d:"Custom-fit K-style 5”/6”, color-matched, fewer leaks."},
            {t:"Gutter Guards",d:"Clog-resistant systems sized for Texas leaf loads."},
            {t:"Repair & Tune-Ups",d:"Leaks, reseals, pitch corrections, sections replaced."},
            {t:"Drainage & French Drains",d:"Downspout extensions, pop-ups, french drains."},
            {t:"Commercial / Multifamily",d:"Scaled installs and maintenance programs."},
            {t:"Annual Maintenance",d:"Spring/Fall cleanouts and inspections."},
          ].map(card=>(
            <div key={card.t} className="rounded-2xl bg-white p-6 shadow border">
              <h3 className="font-semibold">{card.t}</h3>
              <p className="mt-2 text-sm text-slate-700">{card.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Link href="/services" className="underline text-blue-700">See all services →</Link>
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="mt-16 rounded-2xl bg-white p-6 shadow border flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold">Ready to protect your home?</h3>
          <p className="text-slate-700">Free on-site estimates. No pressure—just honest advice.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/contact" className="rounded-2xl px-5 py-3 bg-blue-600 text-white">Get My Free Quote</Link>
          <a href="tel:+14694314515" className="rounded-2xl px-5 py-3 border">
            Call
          </a>

        </div>
      </section>
    </div>
  );
}

```

---

## `robots.txt/route.ts`

```ts
// app/robots.txt/route.ts
export function GET() {
  const body = `User-agent: *
Allow: /
Sitemap: https://www.goduckworks.com/sitemap.xml
`;
  return new Response(body, { headers: { "Content-Type": "text/plain" } });
}

```

---

## `services/page.tsx`

```tsx
// app/services/page.tsx
import Link from "next/link";

export const metadata = { title: "Services | Duck Works" };

export default function Services() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold">Gutter Services Built for Texas Homes</h1>
      <p className="mt-3 text-slate-700">
        Whether you need brand-new seamless gutters, a quick repair, or a drainage upgrade, Duck Works has you covered.
      </p>

      <div className="mt-8 space-y-8">
        {/* …sections unchanged… */}
      </div>

      <div className="mt-10">
        <Link className="rounded-2xl px-5 py-3 bg-blue-600 text-white" href="/contact">
          Request a Free On-Site Estimate
        </Link>
      </div>
    </div>
  );
}

```

---

## `sitemap.ts`

```ts
// app/sitemap.ts
import { cities } from "../content/cities";
export default function sitemap() {
  const base = "https://www.goduckworks.com"; // change after domain connects
  const staticPages = ["", "/services", "/about", "/contact"].map(p=>({
    url: `${base}${p}`, lastModified: new Date(), changeFrequency:"weekly", priority: p===""?1.0:0.7
  }));
  const cityPages = cities.map(c=>({ url: `${base}/${c.slug}`, lastModified: new Date(), changeFrequency:"monthly", priority: 0.6 }));
  return [...staticPages, ...cityPages];
}

```

