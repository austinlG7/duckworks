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
