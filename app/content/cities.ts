// content/cities.ts
export type City = {
  slug: string; city: string; state: string;
  neighborhoods?: string[]; landmarks?: string[];
  intro: string; faqs?: {q:string;a:string}[]; testimonial?: {quote:string;author:string}|null;
};

export const cities: City[] = [
  {
    slug: "round-rock-tx",
    city: "Round Rock", state: "TX",
    neighborhoods: ["Forest Creek","Teravista","Behrens Ranch"],
    landmarks: ["Old Settlers Park","Round Rock Premium Outlets"],
    intro: "Premium seamless gutters, guards, and drainage tailored to Round Rock rains and oak leaf seasons.",
    testimonial: { quote: "Fast, clean install and no more overflowing corners.", author: "K. Ramirez, Round Rock" },
    faqs: [{ q: "5\" or 6\" here?", a: "Two-story or large roof areas often benefit from 6\" with 3×4 downspouts." }]
  },
  {
    slug: "waco-tx",
    city: "Waco", state: "TX",
    neighborhoods: ["Castle Heights","Brookview","Woodway"],
    landmarks: ["Cameron Park","Baylor University"],
    intro: "Seamless aluminum, leaf protection, and French drains sized for Waco storm patterns.",
    testimonial: null, faqs: []
  }
];
