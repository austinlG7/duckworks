// app/[city]/page.tsx
import { cities } from "../../content/cities";

export async function generateStaticParams() {
  return cities.map(c => ({ city: c.slug }));
}
export const dynamicParams = false;

export default function CityPage({ params }: { params: { city: string } }) {
  const c = cities.find(x => x.slug === params.city);
  if (!c) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold">Seamless Gutters in {c.city}, {c.state}</h1>
      <p className="mt-3 text-slate-700">{c.intro}</p>

      {!!(c.neighborhoods?.length) && (
        <ul className="mt-4 flex flex-wrap gap-2 text-sm text-slate-600">
          {c.neighborhoods!.map(n => <li key={n} className="px-2 py-1 bg-white rounded border">{n}</li>)}
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
            Landmarks: {(c.landmarks ?? []).join(", ") || "—"}. Seasonal sizing and layouts tailored to local rainfall and roof pitch norms.
          </p>
        </div>
      </section>

      {!!c.faqs?.length && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold">FAQs for {c.city}</h2>
          <div className="mt-4 space-y-4">
            {c.faqs!.map((f,i)=>(
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
