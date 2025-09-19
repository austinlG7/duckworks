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
