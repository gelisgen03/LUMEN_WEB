/**
 * Organisation facts used in the footer, legal pages and JSON-LD.
 * Source: statuts (20 août 2026) and Journal officiel des associations n°35, annonce 1618 (1er septembre 2026).
 */
export const site = {
  name: "LUMEN",
  legalName: "Réseau Européen pour l'Apprentissage et la Modernisation Numérique",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  email: "reseau.numerique.eu@gmail.com",
  address: {
    street: "Les Tricolores, 138 avenue Victor Hugo",
    postalCode: "75016",
    city: "Paris",
    country: "FR",
  },
  legal: {
    form: "Association loi 1901",
    rna: "W751285790",
    declared: "2026-08-21",
    joPublication: "JOAFE n°35 du 1er septembre 2026, annonce n°1618",
    founded: "2026",
    president: "Muhammet Emir Boz",
    host: "Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis",
  },
  social: {
    linkedin: "https://www.linkedin.com/",
  },
  /** EU programmes the association works with (statuts, art. 2). */
  programmes: ["Erasmus+", "Corps européen de solidarité", "CERV", "Horizon Europe", "Digital Europe"],
} as const;

export function absoluteUrl(path = "/") {
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}
