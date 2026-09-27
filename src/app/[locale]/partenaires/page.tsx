/**
 * Be our partner. Audience: NGOs, schools, authorities, companies looking for a
 * coordinator / partner / hosting organisation. Why → roles → steps → FAQ → form.
 */
import { Mail } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/contact/contact-form";
import { getContactFormLabels } from "@/components/contact/contact-labels";
import { Container } from "@/components/layout/container";
import { Faq, FeatureGrid, Process } from "@/components/sections/blocks";
import { PageHeader } from "@/components/sections/page-header";
import { SectionHeader } from "@/components/sections/section-header";
import { EuFlag } from "@/components/ui/eu-flag";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "partner" });
  return pageMetadata({ locale, path: "/partenaires", title: t("metaTitle"), description: t("metaDescription") });
}

export default async function PartnerPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "partner" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  const home = await getTranslations({ locale, namespace: "home" });
  const labels = await getContactFormLabels(locale);
  const roles = t.raw("roles") as { title: string; text: string }[];

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} image="/images/training-room.jpg" homeLabel={nav("home")}>
        <ul className="mt-7 flex flex-wrap gap-2">
          {(home.raw("marquee") as string[]).slice(0, 5).map((p) => (
            <li key={p} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-sm font-semibold">
              <EuFlag className="h-3 w-auto rounded-[2px]" />
              {p}
            </li>
          ))}
        </ul>
      </PageHeader>

      <section aria-labelledby="why" className="py-20 md:py-24">
        <Container>
          <SectionHeader id="why" index={1} eyebrow={t("eyebrow")} title={t("whyTitle")} />
          <FeatureGrid items={t.raw("why") as { icon: string; title: string; text: string }[]} columns={4} />
        </Container>
      </section>

      <section aria-labelledby="roles" className="bg-surface py-20 md:py-24">
        <Container>
          <SectionHeader id="roles" index={2} eyebrow={t("rolesTitle")} title={t("rolesTitle")} />
          <ul className="grid gap-5 md:grid-cols-2">
            {roles.map((r, i) => (
              <li key={r.title} data-reveal style={{ "--i": i % 2 } as React.CSSProperties}>
                <article className="spot flex h-full gap-5 rounded-3xl border border-border bg-card p-7">
                  <span className="spot-icon grid size-12 shrink-0 place-items-center rounded-2xl bg-gold font-display text-lg font-bold text-navy">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <div>
                    <h3 className="text-step-1 font-bold">{r.title}</h3>
                    <p className="mt-2 text-muted">{r.text}</p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="steps" className="py-20 md:py-24">
        <Container>
          <SectionHeader id="steps" index={3} eyebrow={t("stepsTitle")} title={t("stepsTitle")} />
          <Process steps={t.raw("steps") as { title: string; text: string }[]} />
        </Container>
      </section>

      <section aria-labelledby="faq" className="bg-surface py-20 md:py-24">
        <Container className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <SectionHeader id="faq" index={4} eyebrow={t("faqTitle")} title={t("faqTitle")} />
          </div>
          <div className="md:col-span-8">
            <Faq items={t.raw("faq") as { q: string; a: string }[]} />
          </div>
        </Container>
      </section>

      <section id="form" aria-labelledby="form-title" className="scroll-mt-24 py-20 md:py-24">
        <Container className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <SectionHeader id="form-title" index={5} eyebrow={nav("contact")} title={t("formTitle")} intro={t("formIntro")} />
            <a href={`mailto:${site.email}`} data-reveal className="spot flex items-center gap-3 rounded-2xl border border-border bg-card p-4 font-semibold">
              <span className="spot-icon grid size-10 place-items-center rounded-xl bg-surface text-accent-text">
                <Mail aria-hidden className="size-5" />
              </span>
              <span className="break-all">{site.email}</span>
            </a>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 md:col-span-8 md:p-10" data-reveal>
            <ContactForm locale={locale} labels={labels} defaultReason="partnership" />
          </div>
        </Container>
      </section>
    </>
  );
}
