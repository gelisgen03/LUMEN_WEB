import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getActions, getProjects } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

const staticPaths = ["", "/association", "/actions", "/projets", "/partenaires", "/contact", "/mentions-legales", "/confidentialite"];

/** One entry per page and locale, each with its FR/EN alternates (hreflang). */
export default function sitemap(): MetadataRoute.Sitemap {
  const locale = routing.defaultLocale;
  const paths: { path: string; lastModified?: string }[] = [
    ...staticPaths.map((path) => ({ path })),
    ...getActions(locale).map((a) => ({ path: `/actions/${a.slug}` })),
    ...getProjects(locale).map((p) => ({ path: `/projets/${p.slug}` })),
  ];

  return paths.flatMap(({ path, lastModified }) =>
    routing.locales.map((l) => ({
      url: absoluteUrl(`/${l}${path}`),
      ...(lastModified ? { lastModified } : {}),
      alternates: {
        languages: Object.fromEntries(routing.locales.map((alt) => [alt, absoluteUrl(`/${alt}${path}`)])),
      },
    })),
  );
}
