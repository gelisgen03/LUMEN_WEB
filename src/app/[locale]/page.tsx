/**
 * Home: a numbered, top-to-bottom story. Each section is anchored and listed in the
 * side index (wide screens) so visitors always know where they are.
 * 01 About → 02 Themes → 03 What we do → 04 Green thread → 05 Method → 06 Projects → 07 Values → 08 Team → CTA
 */
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/layout/container";
import {
  DomainCard,
  FeatureGrid,
  GreenBand,
  MissionVision,
  Process,
  ProjectCard,
  StatsGrid,
  TeamCard,
} from "@/components/sections/blocks";
import { CtaBand } from "@/components/sections/cta-band";
import { LightHero } from "@/components/sections/light-hero";
import { Marquee } from "@/components/sections/marquee";
import { SectionHeader } from "@/components/sections/section-header";
import { SectionIndex } from "@/components/sections/section-index";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getActions, getProjects, getTeam } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  const meta = await getTranslations({ locale, namespace: "meta" });
  return { ...pageMetadata({ locale, path: "", description: meta("siteDescription") }), title: { absolute: t("metaTitle") } };
}

type Item = { icon: string; title: string; text: string };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "home" });
  const common = await getTranslations({ locale, namespace: "common" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  const m = await getTranslations({ locale, namespace: "mission" });
  const root = await getTranslations({ locale });

  const domains = getActions(locale);
  const projects = getProjects(locale).slice(0, 3);
  const team = getTeam(locale);

  const sections = [
    { id: "about", label: t("aboutEyebrow") },
    { id: "themes", label: t("themesEyebrow") },
    { id: "domains", label: t("domainsEyebrow") },
    { id: "green", label: t("greenEyebrow") },
    { id: "method", label: t("processEyebrow") },
    { id: "projects", label: t("projectsEyebrow") },
    { id: "values", label: t("valuesEyebrow") },
    { id: "team", label: t("teamEyebrow") },
  ];

  return (
    <>
      <LightHero
        titleLead={t("heroTitleLead")}
        titleRest={t("heroTitleRest")}
        text={t("heroText")}
        primary={{ href: "/partenaires", label: t("heroPrimary") }}
        secondary={{ href: "/actions", label: t("heroSecondary") }}
        scrollLabel={t("heroScroll")}
      />
      <SectionIndex variant="rail" label={nav("onThisPage")} sections={sections} />

      <div id="content" />

      {/* 01 — About + mission / vision */}
      <section id="about" aria-labelledby="about-title" className="scroll-mt-24 py-20 md:py-28">
        <Container className="grid items-center gap-12 md:grid-cols-12">
          {/* Left: photo with the counters overlapping its lower edge */}
          <div className="relative md:col-span-6">
            <div className="relative aspect-[16/11] overflow-hidden rounded-[2rem]" data-reveal="left">
              <Image src="/images/youth-laptops.jpg" alt="" fill sizes="(min-width: 768px) 560px, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/50 via-transparent to-transparent" />
            </div>
            <div aria-hidden className="hero-glow absolute -left-10 -top-10 -z-10 size-48" />
            <div className="relative -mt-16 px-3 sm:-mt-20 sm:px-6">
              <StatsGrid label={t("statsLabel")} items={t.raw("stats") as { value: string; label: string }[]} />
            </div>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <SectionHeader id="about-title" index={1} eyebrow={t("aboutEyebrow")} title={t("aboutTitle")} className="md:mb-6" />
            <p data-reveal className="text-step-0 text-muted">
              {t("aboutText")}
            </p>
            <Link
              href="/association"
              data-reveal
              className="group mt-6 inline-flex items-center gap-2 font-semibold text-accent-text"
            >
              <span className="link-grow">{t("aboutCta")}</span>
              <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Container>
        <Container className="mt-16 md:mt-20">
          <MissionVision
            mission={{ title: m("missionTitle"), text: m("missionText") }}
            vision={{ title: m("visionTitle"), text: m("visionText") }}
          />
        </Container>
      </section>

      {/* 02 — What we work on */}
      <section id="themes" aria-labelledby="themes-title" className="scroll-mt-24 bg-surface py-20 md:py-28">
        <Container>
          <SectionHeader id="themes-title" index={2} eyebrow={t("themesEyebrow")} title={t("themesTitle")} intro={t("themesIntro")} />
          <FeatureGrid items={root.raw("themes") as Item[]} numbered />
        </Container>
      </section>

      <Marquee label={t("marqueeLabel")} items={t.raw("marquee") as string[]} />

      {/* 03 — What we do */}
      <section id="domains" aria-labelledby="domains-title" className="scroll-mt-24 py-20 md:py-28">
        <Container>
          <SectionHeader
            id="domains-title"
            index={3}
            eyebrow={t("domainsEyebrow")}
            title={t("domainsTitle")}
            intro={t("domainsIntro")}
            action={{ href: "/actions", label: common("seeAll") }}
          />
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {domains.map((d, i) => (
              <li key={d.slug} data-reveal style={{ "--i": i % 3 } as React.CSSProperties} className={i === 0 ? "lg:row-span-1" : ""}>
                <DomainCard index={i + 1} href={`/actions/${d.slug}`} title={d.title} summary={d.summary} image={d.image} icon={d.icon} cta={common("readMore")} />
              </li>
            ))}
            <li data-reveal style={{ "--i": 2 } as React.CSSProperties}>
              <Link
                href="/partenaires"
                className="spot group flex h-full min-h-64 flex-col justify-between rounded-3xl border border-dashed border-gold bg-[color-mix(in_oklab,var(--gold)_10%,var(--card))] p-7"
              >
                <span className="spot-icon grid size-13 place-items-center rounded-2xl bg-gold text-navy">
                  <ArrowRight aria-hidden className="size-6" />
                </span>
                <span>
                  <span className="block text-step-1 font-bold">{t("ctaTitle")}</span>
                  <span className="mt-2 block font-semibold text-accent-text">{t("ctaPrimary")}</span>
                </span>
              </Link>
            </li>
          </ul>
        </Container>
      </section>

      {/* 04 — Green thread */}
      <div id="green" className="scroll-mt-24">
        <GreenBand id="green-title" index={4} eyebrow={t("greenEyebrow")} title={t("greenTitle")} text={t("greenText")} points={t.raw("greenPoints") as string[]} />
      </div>

      {/* 05 — Method */}
      <section id="method" aria-labelledby="method-title" className="scroll-mt-24 py-20 md:py-24">
        <Container>
          <SectionHeader id="method-title" index={5} eyebrow={t("processEyebrow")} title={t("processTitle")} />
          <Process steps={root.raw("process") as { title: string; text: string }[]} />
        </Container>
      </section>

      {/* 06 — Projects */}
      <section id="projects" aria-labelledby="projects-title" className="scroll-mt-24 bg-surface py-20 md:py-28">
        <Container>
          <SectionHeader
            id="projects-title"
            index={6}
            eyebrow={t("projectsEyebrow")}
            title={t("projectsTitle")}
            intro={t("projectsIntro")}
            action={{ href: "/projets", label: common("seeAll") }}
          />
          <ul className="grid gap-5 md:grid-cols-3">
            {projects.map((p, i) => (
              <li key={p.slug} data-reveal style={{ "--i": i } as React.CSSProperties}>
                <ProjectCard
                  href={`/projets/${p.slug}`}
                  title={p.title}
                  summary={p.summary}
                  cover={p.cover}
                  programme={p.programme}
                  statusLabel={common(`status.${p.status}`)}
                  sdgLabels={p.sdgs.map((n) => common("sdg", { n }))}
                  cta={common("readMore")}
                />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* 07 — Values */}
      <section id="values" aria-labelledby="values-title" className="scroll-mt-24 py-20 md:py-28">
        <Container>
          <SectionHeader id="values-title" index={7} eyebrow={t("valuesEyebrow")} title={t("valuesTitle")} align="center" />
          <FeatureGrid items={root.raw("values") as Item[]} />
        </Container>
      </section>

      {/* 08 — Team */}
      <section id="team" aria-labelledby="team-title" className="scroll-mt-24 py-12 md:py-16">
        <Container>
          <SectionHeader id="team-title" index={8} eyebrow={t("teamEyebrow")} title={t("teamTitle")} intro={t("teamIntro")} />
          <ul className="grid gap-5 lg:grid-cols-2">
            {team.map((p, i) => (
              <li key={p.slug} data-reveal style={{ "--i": i } as React.CSSProperties}>
                <TeamCard name={p.name} role={p.role} title={p.title} bio={p.bio} photo={p.photo} linkedin={p.linkedin} />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBand
        title={t("ctaTitle")}
        text={t("ctaText")}
        primary={{ href: "/partenaires", label: t("ctaPrimary") }}
        secondary={{ href: "/contact", label: t("ctaSecondary") }}
      />
    </>
  );
}
