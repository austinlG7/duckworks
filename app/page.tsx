import Image from "next/image";

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <section className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Keep Water Moving. Keep Homes Dry.
          </h1>
          <p className="mt-4 text-slate-700">
            Premium seamless gutters, gutter guards, repairs, and drainage solutions.
            Licensed & insured. Free on-site estimates. 24/7 response.
          </p>
          <div className="mt-6 flex gap-3">
            <a href="/contact" className="rounded-2xl px-5 py-3 bg-blue-600 text-white">
              Get a Free Estimate
            </a>
            <a href="tel:+1XXXXXXXXXX" className="rounded-2xl px-5 py-3 border">
              Call Now
            </a>
          </div>
          <ul className="mt-6 flex flex-wrap gap-2 text-xs text-slate-600">
            <li className="px-3 py-1 bg-white rounded-xl border">Licensed & Insured</li>
            <li className="px-3 py-1 bg-white rounded-xl border">Pro Installers</li>
            <li className="px-3 py-1 bg-white rounded-xl border">Leaf Guards & French Drains</li>
          </ul>
        </div>
        <div className="flex items-center justify-center">
          <div className="w-56 h-56 rounded-full bg-white shadow flex items-center justify-center text-6xl">
            🦆
          </div>
        </div>
      </section>
    </main>
  );
}
