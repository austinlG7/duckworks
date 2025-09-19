// app/services/page.tsx
export const metadata = { title: "Services | Duck Works" };

export default function Services() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold">Gutter Services Built for Texas Homes</h1>
      <p className="mt-3 text-slate-700">
        Whether you need brand-new seamless gutters, a quick repair, or a drainage upgrade, Duck Works has you covered.
      </p>

      <div className="mt-8 space-y-8">
        {[
          {
            h:"Seamless Aluminum Gutters",
            b:[
              "Measured and cut onsite for a perfect fit (fewer seams = fewer leaks).",
              "K-style 5” & 6”, color-matched to your exterior.",
              "Oversized downspouts for heavy rains."
            ]
          },
          {
            h:"Gutter Guards",
            b:[
              "Proven leaf-block systems to reduce cleanings.",
              "Sized for Texas oak/cedar seasons.",
              "Works with existing gutters in many cases."
            ]
          },
          {
            h:"Repair & Tune-Ups",
            b:[
              "Seal leaks, re-pitch gutters, replace damaged sections.",
              "Rehangers, end caps, and corners.",
              "Extend the life of your system."
            ]
          },
          {
            h:"Drainage & French Drains",
            b:[
              "Downspout extensions & pop-ups to move water away.",
              "French drains to protect foundations & yards.",
              "Clay soil-aware layouts for Central Texas."
            ]
          },
          {
            h:"Commercial / Multifamily",
            b:["Scaled installs, fast turnarounds, maintenance programs."]
          },
          {
            h:"Annual Maintenance",
            b:["Spring/Fall cleanouts and inspections.", "Priority scheduling for plan members."]
          }
        ].map(sec=>(
          <section key={sec.h} className="rounded-2xl bg-white p-6 shadow border">
            <h2 className="text-xl font-semibold">{sec.h}</h2>
            <ul className="mt-3 list-disc pl-5 text-slate-700">
              {sec.b.map((x,i)=><li key={i}>{x}</li>)}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-10">
        <a className="rounded-2xl px-5 py-3 bg-blue-600 text-white" href="/contact">Request a Free On-Site Estimate</a>
      </div>
    </div>
  );
}
