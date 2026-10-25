import { getTranslations } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { ogSize, renderOg } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "LUMEN";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Image({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return renderOg({ eyebrow: t("heroBadge"), title: t("metaTitle").replace(/^LUMEN – /, "") });
}
