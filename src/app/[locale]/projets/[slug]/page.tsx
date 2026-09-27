import { Check, Users } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { MdxContent } from "@/components/mdx/mdx-content";
import { PageHeader } from "@/components/sections/page-header";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getAction, getProject, getProjects } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => getProjects(locale).map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const p = getProject(locale, slug);
  if (!p) return {};
  return pageMetadata({ locale, path: `/projets/${slug}`, title: p.title, description: p.summary });
}

const regionName = (code: string, locale: string) => new Intl.DisplayNames([locale], { type: "region" }).of(code.toUpperCase()) ?? code;

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const project = getProject(locale, slug);
  if (!project) notFound();

  const t = await getTranslations({ locale, namespace: "projects" });
  const common = await getTranslations({ locale, namespace: "common" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  const label = "text-sm font-bold uppercase tracking-[0.12em] text-muted";

  return (
    <>
      <PageHeader
        eyebrow={project.title}
        title={project.title}
        intro={project.summary}
        image={project.cover}
        homeLabel={nav("home")}
        crumbs={[{ href: "/projets", label: nav("projets") }]}
      >
        <div className="mt-6 flex flex-wrap gap-2">
          <span className="rounded-full bg-gold px-3 py-1 text-sm font-bold text-navy">{common(`status.${project.status}`)}</span>
          <span className="rounded-full border border-white/30 px-3 py-1 text-sm font-semibold">{project.programme}</span>
        </div>
      </PageHeader>

      <Container className="grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-7" data-reveal>
          <MdxContent source={project.body} />
          <section aria-labelledby="outcomes" className="mt-12">
            <h2 id="outcomes" className="text-step-2 font-bold">
              {t("outcomes")}
            </h2>
            <ul className="mt-5 grid gap-3">
              {project.outcomes.map((o, i) => (
                <li key={o} data-reveal style={{ "--i": i } as React.CSSProperties} className="spot flex gap-3 rounded-2xl border border-border bg-card p-4">
                  <span className="spot-icon grid size-8 shrink-0 place-items-center rounded-full bg-surface text-accent-text">
                    <Check aria-hidden className="size-4" />
                  </span>
                  {o}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="md:col-span-4 md:col-start-9">
          <div className="sticky top-24 space-y-5" data-reveal="right">
            <dl className="space-y-6 rounded-3xl border border-border bg-card p-7">
              <div>
                <dt className={label}>{common("programme")}</dt>
                <dd className="mt-1 font-semibold">{project.programme}</dd>
              </div>
              <div>
                <dt className={label}>{nav("actions")}</dt>
                <dd className="mt-2 flex flex-col gap-1">
                  {project.domains.map((d) => (
                    <Link key={d} href={`/actions/${d}`} className="link-grow self-start font-medium text-accent-text">
                      {getAction(locale, d)?.title ?? d}
                    </Link>
                  ))}
                </dd>
              </div>
              <div>
                <dt className={label}>{common("sdgs")}</dt>
                <dd className="mt-2 flex flex-wrap gap-1.5">
                  {project.sdgs.map((n) => (
                    <span key={n} className="rounded-full bg-[#10b981]/12 px-2.5 py-0.5 text-sm font-bold text-green-text">
                      {common("sdg", { n })}
                    </span>
                  ))}
                </dd>
              </div>
              <div>
                <dt className={label}>{common("partners")}</dt>
                <dd className="mt-2 text-base">
                  {project.partners.length ? (
                    <ul className="space-y-1">
                      {project.partners.map((p) => (
                        <li key={p.name}>
                          <span className="font-medium">{p.name}</span> <span className="text-muted">· {regionName(p.country, locale)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-muted">{common("partnersPending")}</span>
                  )}
                </dd>
              </div>
            </dl>
            <div className="relative overflow-hidden rounded-3xl bg-navy p-7 text-white">
              <div aria-hidden className="hero-glow absolute -right-16 -top-16 size-48" />
              <Users aria-hidden className="relative size-7 text-gold" />
              <p className="relative mt-3 text-step-1 font-bold">{t("joinTitle")}</p>
              <p className="relative mt-1 text-[#d5dae3]">{t("joinText")}</p>
              <Link
                href="/partenaires"
                className="btn-shine relative mt-5 flex h-12 items-center justify-center rounded-full bg-gold font-semibold text-navy"
              >
                {t("joinCta")}
              </Link>
            </div>
          </div>
        </aside>
      </Container>
    </>
  );
}
