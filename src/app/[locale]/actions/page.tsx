/**
 * What we do: 5 domains → 6 themes → formats → method.
 */
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { DomainCard, FeatureGrid, Process } from "@/components/sections/blocks";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHeader } from "@/components/sections/page-header";
import { SectionHeader } from "@/components/sections/section-header";
import type { Locale } from "@/i18n/routing";
import { getActions } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale }> };
type Item = { icon: string; title: string; text: string };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "actions" });
  return pageMetadata({ locale, path: "/actions", title: t("metaTitle"), description: t("metaDescription") });
}

export default async function ActionsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "actions" });
  const home = await getTranslations({ locale, namespace: "home" });
  const common = await getTranslations({ locale, namespace: "common" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  const root = await getTranslations({ locale });
  const domains = getActions(locale);

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} image="/images/workshop-group.jpg" homeLabel={nav("home")} />

      <section aria-labelledby="domains-title" className="py-20 md:py-24">
        <Container>
          <SectionHeader id="domains-title" index={1} eyebrow={home("domainsEyebrow")} title={home("domainsIntro")} />
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {domains.map((d, i) => (
              <li key={d.slug} data-reveal style={{ "--i": i % 3 } as React.CSSProperties}>
                <DomainCard index={i + 1} href={`/actions/${d.slug}`} title={d.title} summary={d.summary} image={d.image} icon={d.icon} cta={common("readMore")} />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="themes-title" className="bg-surface py-20 md:py-24">
        <Container>
          <SectionHeader id="themes-title" index={2} eyebrow={home("themesEyebrow")} title={home("themesTitle")} intro={home("themesIntro")} />
          <FeatureGrid items={root.raw("themes") as Item[]} numbered />
        </Container>
      </section>

      <section aria-labelledby="formats-title" className="py-20 md:py-24">
        <Container>
          <SectionHeader id="formats-title" index={3} eyebrow={t("formatsTitle")} title={t("formatsTitle")} />
          <FeatureGrid items={t.raw("formats") as Item[]} />
        </Container>
      </section>

      <section aria-labelledby="method-title" className="bg-surface py-20 md:py-24">
        <Container>
          <SectionHeader id="method-title" index={4} eyebrow={home("processEyebrow")} title={home("processTitle")} />
          <Process steps={root.raw("process") as { title: string; text: string }[]} />
        </Container>
      </section>

      <CtaBand title={home("ctaTitle")} text={home("ctaText")} primary={{ href: "/partenaires", label: home("ctaPrimary") }} secondary={{ href: "/contact", label: home("ctaSecondary") }} />
    </>
  );
}
