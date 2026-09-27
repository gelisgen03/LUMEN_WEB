import { getTranslations } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { getProject, getProjects } from "@/lib/content";
import { ogSize, renderOg } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "LUMEN";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => getProjects(locale).map((e) => ({ locale, slug: e.slug })));
}

export default async function Image({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "projects" });
  const entry = getProject(locale, slug);
  return renderOg({ eyebrow: t("eyebrow"), title: entry?.title ?? "LUMEN" });
}
