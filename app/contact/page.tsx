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
