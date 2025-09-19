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
