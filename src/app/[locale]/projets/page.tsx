import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { GreenBand, ProjectCard } from "@/components/sections/blocks";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHeader } from "@/components/sections/page-header";
import type { Locale } from "@/i18n/routing";
import { getProjects } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects" });
  return pageMetadata({ locale, path: "/projets", title: t("metaTitle"), description: t("metaDescription") });
}

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "projects" });
  const common = await getTranslations({ locale, namespace: "common" });
  const home = await getTranslations({ locale, namespace: "home" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  const projects = getProjects(locale);

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} image="/images/solar-field.jpg" homeLabel={nav("home")} />
      <Container className="py-16 md:py-20">
        {projects.length ? (
          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p, i) => (
              <li key={p.slug} data-reveal style={{ "--i": i % 3 } as React.CSSProperties}>
                <ProjectCard
                  href={`/projets/${p.slug}`}
                  title={p.title}
                  summary={p.summary}
                  cover={p.cover}
                  programme={p.programme}
                  statusLabel={common(`status.${p.status}`)}
                  sdgLabels={p.sdgs.map((n) => common("sdg", { n }))}
                  cta={common("readMore")}
                  headingLevel="h2"
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">{t("empty")}</p>
        )}
      </Container>
      <GreenBand id="green-title" eyebrow={home("greenEyebrow")} title={home("greenTitle")} text={home("greenText")} points={home.raw("greenPoints") as string[]} />
      <CtaBand title={home("ctaTitle")} text={home("ctaText")} primary={{ href: "/partenaires", label: home("ctaPrimary") }} />
    </>
  );
}
