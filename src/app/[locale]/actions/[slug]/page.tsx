import { Check } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { MdxContent } from "@/components/mdx/mdx-content";
import { DomainCard, ProjectCard } from "@/components/sections/blocks";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHeader } from "@/components/sections/page-header";
import { SectionHeader } from "@/components/sections/section-header";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getAction, getActions, getProjects } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => getActions(locale).map((a) => ({ locale, slug: a.slug })));
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const a = getAction(locale, slug);
  if (!a) return {};
  return pageMetadata({ locale, path: `/actions/${slug}`, title: a.title, description: a.summary });
}

export default async function ActionPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const area = getAction(locale, slug);
  if (!area) notFound();

  const t = await getTranslations({ locale, namespace: "actions" });
  const common = await getTranslations({ locale, namespace: "common" });
  const home = await getTranslations({ locale, namespace: "home" });
  const nav = await getTranslations({ locale, namespace: "nav" });

  const projects = getProjects(locale).filter((p) => p.domains.includes(area.slug));
  const others = getActions(locale).filter((a) => a.slug !== area.slug);
  const label = "text-sm font-bold uppercase tracking-[0.12em] text-muted";

  return (
    <>
      <PageHeader
        eyebrow={area.title}
        title={area.title}
        intro={area.summary}
        image={area.image}
        homeLabel={nav("home")}
        crumbs={[{ href: "/actions", label: nav("actions") }]}
      />

      <Container className="grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <article className="md:col-span-7" data-reveal>
          <h2 className="text-step-3 font-bold">{t("approachTitle")}</h2>
          <MdxContent source={area.body} className="mt-6" />
        </article>
        <aside className="md:col-span-4 md:col-start-9">
          <div className="spot sticky top-24 rounded-3xl border border-border bg-card p-7" data-reveal="right">
            <h2 className={label}>{common("forWhom")}</h2>
            <ul className="mt-3 space-y-2">
              {area.audiences.map((a) => (
                <li key={a} className="flex gap-2 font-medium">
                  <Check aria-hidden className="mt-1 size-4 shrink-0 text-accent-text" />
                  {common(`audiences.${a}`)}
                </li>
              ))}
            </ul>
            <h2 className={`${label} mt-7`}>{common("methods")}</h2>
            <ul className="mt-3 space-y-2">
              {area.methods.map((m) => (
                <li key={m} className="flex gap-2">
                  <span aria-hidden className="mt-2.5 size-2 shrink-0 rounded-full bg-gold" />
                  {m}
                </li>
              ))}
            </ul>
            <Link href="/partenaires" className="btn-shine mt-7 flex h-12 items-center justify-center rounded-full bg-primary px-5 font-semibold text-primary-foreground">
              {t("requestProject")}
            </Link>
          </div>
        </aside>
      </Container>

      {projects.length > 0 && (
        <section aria-labelledby="related" className="bg-surface py-16 md:py-20">
          <Container>
            <SectionHeader id="related" title={t("relatedProjects")} />
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
      )}

      <section aria-labelledby="others" className="py-16 md:py-20">
        <Container>
          <SectionHeader id="others" title={t("otherAreas")} />
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((a, i) => (
              <li key={a.slug} data-reveal style={{ "--i": i } as React.CSSProperties}>
                <DomainCard index={a.order} href={`/actions/${a.slug}`} title={a.title} summary={a.summary} image={a.image} icon={a.icon} cta={common("readMore")} />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBand title={home("ctaTitle")} text={home("ctaText")} primary={{ href: "/partenaires", label: home("ctaPrimary") }} />
    </>
  );
}
