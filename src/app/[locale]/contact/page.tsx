import { Mail, MapPin } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/contact/contact-form";
import { getContactFormLabels } from "@/components/contact/contact-labels";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/sections/page-header";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return pageMetadata({ locale, path: "/contact", title: t("metaTitle"), description: t("metaDescription") });
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "contact" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  const labels = await getContactFormLabels(locale);

  const cards = [
    { icon: <Mail aria-hidden className="size-5" />, label: t("email"), value: <a href={`mailto:${site.email}`} className="link-grow break-all">{site.email}</a> },
    {
      icon: <MapPin aria-hidden className="size-5" />,
      label: t("address"),
      value: (
        <>
          {site.address.street}
          <br />
          {site.address.postalCode} {site.address.city}, France
        </>
      ),
    },
  ];

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} homeLabel={nav("home")} />
      <Container className="grid gap-10 py-16 md:grid-cols-12 md:py-20">
        <aside className="space-y-4 md:col-span-4">
          <h2 className="text-step-1 font-bold" data-reveal>
            {t("directTitle")}
          </h2>
          {cards.map((c, i) => (
            <div key={c.label} data-reveal style={{ "--i": i } as React.CSSProperties} className="spot flex gap-4 rounded-2xl border border-border bg-card p-5">
              <span className="spot-icon grid size-11 shrink-0 place-items-center rounded-xl bg-surface text-accent-text">{c.icon}</span>
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.12em] text-muted">{c.label}</p>
                <p className="mt-1 font-semibold">{c.value}</p>
              </div>
            </div>
          ))}
        </aside>
        <div className="rounded-3xl border border-border bg-card p-6 md:col-span-8 md:p-10" data-reveal>
          <ContactForm locale={locale} labels={labels} />
        </div>
      </Container>
    </>
  );
}
