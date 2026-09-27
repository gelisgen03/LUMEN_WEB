import "@/styles/index.css";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Inter, Inter_Tight } from "next/font/google";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Motion } from "@/components/motion/motion";
import { JsonLd, organizationJsonLd } from "@/components/seo/json-ld";
import { routing, type Locale } from "@/i18n/routing";
import { site } from "@/lib/site";
import { themeInitScript } from "@/lib/theme-script";

// display "swap": text shows immediately in the size-adjusted fallback, then switches to Inter once loaded.
const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter", display: "swap" });
const interTight = Inter_Tight({ subsets: ["latin", "latin-ext"], variable: "--font-inter-tight", display: "swap" });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: "meta" });
  return {
    metadataBase: new URL(site.url),
    title: { default: t("siteTitle"), template: `%s · ${site.name}` },
    description: t("siteDescription"),
    applicationName: site.name,
    icons: { icon: "/brand/lumen-mark.png", apple: "/brand/lumen-mark.png" },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1630" },
  ],
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "nav" });
  const meta = await getTranslations({ locale, namespace: "meta" });

  return (
    <html lang={locale} className={`${inter.variable} ${interTight.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only z-50 rounded-full bg-gold px-5 py-3 font-semibold text-navy focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          {t("skipToContent")}
        </a>
        {/* messages={null}: no translation JSON is shipped to the browser; client components get strings as props. */}
        <NextIntlClientProvider locale={locale} messages={null}>
          <SiteHeader locale={locale} />
          <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
            {children}
          </main>
          <SiteFooter locale={locale} />
          <Motion />
        </NextIntlClientProvider>
        <JsonLd data={organizationJsonLd(meta("siteDescription"))} />
        <Analytics />
      </body>
    </html>
  );
}
