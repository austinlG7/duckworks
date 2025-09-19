// app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "Duck Works — Aqua Management Solutions",
  description:
    "Seamless gutters, gutter guards, repairs, and drainage solutions. Free on-site estimates. Licensed & insured.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-800">
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <span className="text-xl font-extrabold">🦆 Duck Works</span>
              <span className="text-sm text-slate-500">Aqua Management Solutions</span>
            </a>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <a href="/services">Services</a>
              <a href="/about">About</a>
              <a href="/contact">Contact</a>
              <a href="tel:+1XXXXXXXXXX" className="rounded-2xl px-4 py-2 bg-blue-600 text-white">
                Call Now
              </a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="mt-16 border-t">
          <div className="max-w-6xl mx-auto px-4 py-8 text-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Duck Works</span>
              <span className="text-slate-500">Aqua Management Solutions</span>
            </div>
            <div className="text-slate-500">&copy; {new Date().getFullYear()} Duck Works. All rights reserved.</div>
          </div>
        </footer>
      </body>
    </html>
  );
}
