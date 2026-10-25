/**
 * About. Partners and funders check credibility here: story, mission/vision,
 * values, team and legal identity (from the statutes and the Journal officiel).
 */
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { FeatureGrid, MissionVision, TeamCard } from "@/components/sections/blocks";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHeader } from "@/components/sections/page-header";
import { SectionHeader } from "@/components/sections/section-header";
import { SectionIndex } from "@/components/sections/section-index";
import { TeamCarousel } from "@/components/sections/team-carousel";
import type { Locale } from "@/i18n/routing";
import { getTeam } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { formatDate } from "@/lib/utils";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return pageMetadata({ locale, path: "/association", title: t("metaTitle"), description: t("metaDescription") });
}

export default async function AssociationPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about" });
  const home = await getTranslations({ locale, namespace: "home" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  const common = await getTranslations({ locale, namespace: "common" });
  const m = await getTranslations({ locale, namespace: "mission" });
  const root = await getTranslations({ locale });
  const team = getTeam(locale);

  const sections = [
    { id: "story", label: t("storyTitle") },
    { id: "mission", label: t("tocMission") },
    { id: "values", label: t("tocValues") },
    { id: "team", label: t("tocTeam") },
    { id: "legal", label: t("tocLegal") },
  ];

  const legalRows: [string, string][] = [
    [t("legalForm"), site.legal.form],
    [t("legalRna"), site.legal.rna],
    [t("legalDeclared"), formatDate(site.legal.declared, locale)],
    [t("legalPublication"), site.legal.joPublication],
    [t("legalSeat"), `${site.address.street}, ${site.address.postalCode} ${site.address.city}`],
    [t("legalGovernance"), t("legalGovernanceText")],
  ];

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} image="/images/discussion.jpg" homeLabel={nav("home")} />
      <SectionIndex variant="bar" label={nav("onThisPage")} sections={sections} />

      <section id="story" aria-labelledby="story-title" className="scroll-mt-32 py-20 md:py-24">
        <Container className="grid gap-12 md:grid-cols-12 md:items-center">
          <div className="md:col-span-6">
            <SectionHeader id="story-title" index={1} eyebrow={t("storyTitle")} title={home("aboutTitle")} className="md:mb-6" />
            {(t.raw("storyText") as string[]).map((p, i) => (
              <p key={i} data-reveal style={{ "--i": i } as React.CSSProperties} className="mt-4 text-step-0 text-muted">
                {p}
              </p>
            ))}
          </div>
          <div className="md:col-span-5 md:col-start-8" data-reveal="right">
            <figure className="spot rounded-3xl border border-border bg-card p-8">
              <div className="relative mx-auto aspect-[1408/768] w-full">
                <Image src="/brand/lumen-logo-full.jpg" alt="LUMEN – Réseau Européen pour l'Apprentissage et la Modernisation Numérique" fill sizes="420px" className="rounded-xl object-contain dark:bg-white" />
              </div>
              <figcaption className="mt-6 border-t border-border pt-6">
                <p className="text-sm font-bold uppercase tracking-[0.12em] text-accent-text">{t("objectTitle")}</p>
                <p className="mt-2 text-base text-muted">{t("objectText")}</p>
              </figcaption>
            </figure>
          </div>
        </Container>
      </section>

      <section id="mission" aria-labelledby="mission-title" className="scroll-mt-32 bg-surface py-20 md:py-24">
        <Container>
          <SectionHeader id="mission-title" index={2} eyebrow={t("tocMission")} title={home("heroTitleLead") + " " + home("heroTitleRest")} />
          <MissionVision mission={{ title: m("missionTitle"), text: m("missionText") }} vision={{ title: m("visionTitle"), text: m("visionText") }} />
        </Container>
      </section>

      <section id="values" aria-labelledby="values-title" className="scroll-mt-32 py-20 md:py-24">
        <Container>
          <SectionHeader id="values-title" index={3} eyebrow={t("tocValues")} title={home("valuesTitle")} />
          <FeatureGrid items={root.raw("values") as { icon: string; title: string; text: string }[]} />
        </Container>
      </section>

      <section id="team" aria-labelledby="team-title" className="scroll-mt-32 bg-surface py-20 md:py-24">
        <Container>
          <SectionHeader id="team-title" index={4} eyebrow={t("tocTeam")} title={home("teamTitle")} intro={home("teamIntro")} />
          <TeamCarousel previousLabel={common("previous")} nextLabel={common("next")}>
            {team.map((p) => (
              <TeamCard key={p.slug} name={p.name} role={p.role} title={p.title} bio={p.bio} photo={p.photo} linkedin={p.linkedin} />
            ))}
          </TeamCarousel>
        </Container>
      </section>

      <section id="legal" aria-labelledby="legal-title" className="scroll-mt-32 py-20 md:py-24">
        <Container>
          <SectionHeader id="legal-title" index={5} eyebrow={t("tocLegal")} title={t("legalTitle")} intro={t("legalIntro")} />
          <dl className="grid overflow-hidden rounded-3xl border border-border md:grid-cols-2">
            {legalRows.map(([k, v], i) => (
              <div key={k} data-reveal style={{ "--i": i % 2 } as React.CSSProperties} className="border-b border-border p-6 md:odd:border-r">
                <dt className="text-sm font-bold uppercase tracking-[0.12em] text-muted">{k}</dt>
                <dd className="mt-1 font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <CtaBand title={home("ctaTitle")} text={home("ctaText")} primary={{ href: "/partenaires", label: home("ctaPrimary") }} secondary={{ href: "/contact", label: home("ctaSecondary") }} />
    </>
  );
}
