// app/contact/page.tsx
export const metadata = { title: "Contact | Duck Works" };

export default function Contact() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold">Request Your Free Estimate</h1>
      <p className="mt-3 text-slate-700">Tell us about your home and what you need. We’ll reply quickly.</p>

      <form
        action="https://formspree.io/f/YOUR_FORMSPREE_ID"
        method="POST"
        className="mt-8 grid gap-4 bg-white p-6 rounded-2xl shadow border"
      >
        <input className="border rounded-xl px-3 py-2" name="name" placeholder="Name" required />
        <input className="border rounded-xl px-3 py-2" name="email" type="email" placeholder="Email" required />
        <input className="border rounded-xl px-3 py-2" name="phone" type="tel" placeholder="Phone" required />
        <input className="border rounded-xl px-3 py-2" name="address" placeholder="Service Address (City, ZIP)" />
        <select name="service" className="border rounded-xl px-3 py-2">
          {["Install","Guards","Repair","Cleaning","Drainage","Other"].map(s=>(
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <textarea className="border rounded-xl px-3 py-2 min-h-32" name="message" placeholder="How can we help?" required />
        {/* Honeypot anti-spam */}
        <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />
        <button className="rounded-2xl px-5 py-3 bg-blue-600 text-white" type="submit">Send Request</button>
        <p className="text-xs text-slate-500">By submitting, you agree to be contacted by Duck Works via phone, SMS, or email.</p>
      </form>

      <div className="mt-8 text-sm">
        Prefer to talk? <a className="text-blue-700 underline" href="tel:+1XXXXXXXXXX">Call now</a> or{" "}
        <a className="text-blue-700 underline" href="mailto:hello@goduckworks.com">email us</a>.
      </div>
    </div>
  );
}
