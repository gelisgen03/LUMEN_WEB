import { absoluteUrl, site } from "@/lib/site";

/** Renders a JSON-LD script. `<` is escaped so content can never close the tag. */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function organizationJsonLd(description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "NGO",
    "@id": `${site.url}/#organization`,
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    logo: absoluteUrl("/brand/lumen-mark.png"),
    email: site.email,
    description,
    foundingDate: site.legal.founded,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      postalCode: site.address.postalCode,
      addressLocality: site.address.city,
      addressCountry: site.address.country,
    },
    sameAs: Object.values(site.social),
  };
}

export const organizationRef = { "@id": `${site.url}/#organization` };
