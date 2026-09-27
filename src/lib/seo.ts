import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { absoluteUrl, site } from "./site";

type PageMetaInput = {
  locale: Locale;
  /** Path without locale prefix, e.g. "/projets/foo". Use "" for home. */
  path: string;
  title?: string;
  description: string;
  type?: "website" | "article";
};

/** Canonical + hreflang alternates + OpenGraph for one page. */
export function pageMetadata({ locale, path, title, description, type = "website" }: PageMetaInput): Metadata {
  const languages = Object.fromEntries(routing.locales.map((l) => [l, absoluteUrl(`/${l}${path}`)]));
  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(`/${locale}${path}`),
      languages: { ...languages, "x-default": absoluteUrl(`/${routing.defaultLocale}${path}`) },
    },
    openGraph: {
      type,
      siteName: site.name,
      title: title ?? site.name,
      description,
      url: absoluteUrl(`/${locale}${path}`),
      locale: locale === "fr" ? "fr_FR" : "en_GB",
    },
    twitter: { card: "summary_large_image" },
  };
}
