import { setRequestLocale } from "next-intl/server";
import { LegalPage } from "@/components/sections/legal-page";
import type { Locale } from "@/i18n/routing";
import { getPage } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const { data } = getPage("mentions-legales", locale);
  return pageMetadata({ locale, path: "/mentions-legales", title: data.title, description: data.description });
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LegalPage name="mentions-legales" locale={locale} />;
}
