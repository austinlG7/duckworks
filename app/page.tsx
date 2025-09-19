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
            <a href="tel:+1XXXXXXXXXX" className="rounded-2xl px-5 py-3 border">
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
          <a href="tel:+1XXXXXXXXXX" className="rounded-2xl px-5 py-3 border">Call</a>
        </div>
      </section>
    </div>
  );
}
