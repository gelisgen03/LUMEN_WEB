import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { Link } from "@/i18n/navigation";

type Props = {
  eyebrow: string;
  title: string;
  intro?: string;
  image?: string;
  crumbs?: { href: string; label: string }[];
  homeLabel: string;
  children?: React.ReactNode;
};

/** Inner-page header: navy band with the lantern glow, breadcrumb, the page's single h1. */
export function PageHeader({ eyebrow, title, intro, image, crumbs = [], homeLabel, children }: Props) {
  return (
    <div className="relative isolate overflow-hidden bg-navy text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="hero-glow absolute -right-24 -top-32 size-[30rem]" />
        <div className="hero-rays absolute -right-60 -top-60 size-[50rem] opacity-60" />
      </div>
      <Container className="grid items-center gap-10 py-12 md:grid-cols-12 md:py-20">
        <div className={image ? "md:col-span-7" : "md:col-span-9"}>
          <nav aria-label="Breadcrumb" className="fade-up mb-6">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-[#b9c2d6]">
              <li>
                <Link href="/" className="hover:text-gold">
                  {homeLabel}
                </Link>
              </li>
              {crumbs.map((c) => (
                <li key={c.href} className="flex items-center gap-1.5">
                  <ChevronRight aria-hidden className="size-3.5" />
                  <Link href={c.href} className="hover:text-gold">
                    {c.label}
                  </Link>
                </li>
              ))}
              <li className="flex items-center gap-1.5" aria-current="page">
                <ChevronRight aria-hidden className="size-3.5" />
                <span className="text-white">{eyebrow}</span>
              </li>
            </ol>
          </nav>
          <p className="mb-3 flex items-center gap-3 text-sm font-bold uppercase tracking-[0.14em] text-gold">
            <span aria-hidden className="h-px w-8 bg-gold" />
            {eyebrow}
          </p>
          <h1 className="text-step-5 font-bold">{title}</h1>
          {intro && (
            <p className="fade-up mt-5 max-w-prose text-step-0 text-[#d5dae3]" style={{ "--delay": "0.15s" } as React.CSSProperties}>
              {intro}
            </p>
          )}
          {children}
        </div>
        {image && (
          <div className="fade-up relative md:col-span-5" style={{ "--delay": "0.2s" } as React.CSSProperties}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl ring-1 ring-white/15">
              <Image src={image} alt="" fill priority sizes="(min-width: 768px) 460px, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-tr from-navy/50 via-transparent to-gold/20" />
            </div>
            <div aria-hidden className="absolute -bottom-4 -left-4 -z-10 size-24 rounded-2xl border-2 border-gold/60" />
          </div>
        )}
      </Container>
    </div>
  );
}
