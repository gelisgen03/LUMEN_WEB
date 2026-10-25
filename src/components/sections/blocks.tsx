/**
 * Reusable content blocks. All server components: animations come from
 * data-reveal / .spot classes handled by <Motion /> and globals.css.
 */
import { ArrowRight, Check, Eye, Plus, Target } from "lucide-react";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { Icon } from "@/components/ui/icons";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const delay = (i: number) => ({ "--i": i }) as React.CSSProperties;

/* ------------------------------------------------------------------ stats */
/** Rolling-counter digits: each digit spins through a full turn (0–9) and lands on its value. */
function Odometer({ value }: { value: string }) {
  const digits = value.split("");
  return (
    <span className="odo">
      <span className="sr-only">{value}</span>
      {digits.map((d, p) =>
        /\d/.test(d) ? (
          <span key={p} aria-hidden className="odo-digit">
            <span className="odo-col" style={{ "--n": 10 + Number(d), "--p": p } as React.CSSProperties}>
              {Array.from({ length: 20 }, (_, k) => (
                <span key={k}>{k % 10}</span>
              ))}
            </span>
          </span>
        ) : (
          <span key={p} aria-hidden>
            {d}
          </span>
        ),
      )}
    </span>
  );
}

export function Stats({ label, items }: { label: string; items: { value: string; label: string }[] }) {
  return (
    <section aria-label={label} className="relative z-10 -mt-10 md:-mt-14">
      <Container>
        <dl className="grid grid-cols-2 overflow-hidden rounded-3xl border border-border bg-card shadow-[0_30px_60px_-40px_rgba(15,30,61,0.45)] lg:grid-cols-4">
          {items.map((s, i) => (
            <div
              key={s.label}
              data-reveal
              style={delay(i)}
              className="spot flex flex-col-reverse gap-2 border-border p-6 md:p-8 [&:not(:last-child)]:border-r max-lg:[&:nth-child(2)]:border-r-0 max-lg:[&:nth-child(-n+2)]:border-b"
            >
              <dt className="text-sm text-muted md:text-base">{s.label}</dt>
              <dd className="odo-glow font-display text-step-4 font-bold tabular-nums text-foreground">
                <Odometer value={s.value} />
                <span aria-hidden className="text-gold">
                  .
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

/** Stats as a 2×2 grid of counter cards (home page, left of "About"). */
export function StatsGrid({ label, items }: { label: string; items: { value: string; label: string }[] }) {
  return (
    <dl aria-label={label} className="grid grid-cols-2 gap-3 sm:gap-4">
      {items.map((s, i) => (
        <div
          key={s.label}
          data-reveal
          style={delay(i)}
          className="spot flex flex-col-reverse gap-2 rounded-2xl border border-border bg-card p-5 shadow-[0_24px_48px_-36px_rgba(15,30,61,0.5)] md:p-6"
        >
          <dt className="text-sm text-muted">{s.label}</dt>
          <dd className="odo-glow font-display text-step-4 font-bold tabular-nums text-foreground">
            <Odometer value={s.value} />
            <span aria-hidden className="text-gold">
              .
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* -------------------------------------------------------- mission & vision */
export function MissionVision({ mission, vision }: { mission: { title: string; text: string }; vision: { title: string; text: string } }) {
  const card = (title: string, text: string, icon: React.ReactNode, i: number, dark: boolean) => (
    <article
      data-reveal={i === 0 ? "left" : "right"}
      className={cn(
        "spot relative rounded-3xl border p-8 md:p-10",
        dark ? "border-navy bg-navy text-white" : "border-border bg-card",
      )}
    >
      <span className={cn("spot-icon grid size-14 place-items-center rounded-2xl", dark ? "bg-white/10 text-gold" : "bg-surface text-accent-text")}>{icon}</span>
      <h3 className="mt-6 text-step-2 font-bold">{title}</h3>
      <p className={cn("mt-3 text-step-0", dark ? "text-[#d5dae3]" : "text-muted")}>{text}</p>
    </article>
  );
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {card(mission.title, mission.text, <Target aria-hidden className="size-7" />, 0, true)}
      {card(vision.title, vision.text, <Eye aria-hidden className="size-7" />, 1, false)}
    </div>
  );
}

/* ------------------------------------------------------------ feature grid */
type Feature = { icon: string; title: string; text: string };

/** Icon cards with the cursor spotlight. Used for themes, values, formats, reasons to partner. */
export function FeatureGrid({ items, columns = 3, numbered = false }: { items: Feature[]; columns?: 2 | 3 | 4; numbered?: boolean }) {
  return (
    <ul className={cn("grid gap-5 sm:grid-cols-2", columns === 3 && "lg:grid-cols-3", columns === 4 && "lg:grid-cols-4")}>
      {items.map((f, i) => (
        <li key={f.title} data-reveal style={delay(i % 3)}>
          <article className="spot h-full rounded-3xl border border-border bg-card p-7">
            <div className="flex items-start justify-between">
              <span className="spot-icon grid size-13 place-items-center rounded-2xl bg-surface text-accent-text">
                <Icon name={f.icon} className="size-6" />
              </span>
              {numbered && <span className="font-mono text-sm text-muted tabular-nums">{String(i + 1).padStart(2, "0")}</span>}
            </div>
            <h3 className="mt-5 text-step-1 font-bold">{f.title}</h3>
            <p className="mt-2 text-base text-muted">{f.text}</p>
          </article>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------- domain card */
export function DomainCard({ index, href, title, summary, image, icon, cta }: { index: number; href: string; title: string; summary: string; image: string; icon: string; cta: string }) {
  return (
    <article className="spot group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image src={image} alt="" fill sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" className="spot-img object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/10 to-transparent" />
        <span className="absolute left-5 top-5 font-mono text-sm font-bold text-white/90">{String(index).padStart(2, "0")}</span>
        <span className="spot-icon absolute bottom-5 left-5 grid size-12 place-items-center rounded-2xl bg-white/90 text-navy backdrop-blur">
          <Icon name={icon} className="size-6" />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <h3 className="text-step-1 font-bold">
          <Link href={href} className="after:absolute after:inset-0 after:content-['']">
            {title}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-base text-muted">{summary}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent-text">
          {cta}
          <ArrowRight aria-hidden className="spot-arrow size-4" />
        </span>
      </div>
    </article>
  );
}

/* ----------------------------------------------------------------- process */
/**
 * Numbered steps on a line. A light flows along the line (left → right, top → bottom on mobile)
 * and each circle lights up as it passes. Styles: src/styles/sections.css (.timeline).
 */
export function Process({ steps }: { steps: { title: string; text: string }[] }) {
  return (
    <div className="timeline" style={{ "--tl-steps": steps.length } as React.CSSProperties}>
      <div aria-hidden data-reveal="line" className="tl-track">
        <span className="tl-fill" />
        <span className="tl-flow" />
      </div>
      <ol className="relative grid gap-8 md:grid-cols-4 md:gap-6">
        {steps.map((s, i) => (
          <li key={s.title} data-reveal style={delay(i)} className="group relative flex gap-5 md:flex-col md:gap-0">
            <span
              style={delay(i)}
              className="tl-node relative z-10 grid size-14 shrink-0 place-items-center rounded-full border-2 border-gold bg-background font-display text-xl font-bold transition-transform duration-500 group-hover:scale-110"
            >
              {i + 1}
            </span>
            <div className="md:mt-6">
              <h3 className="text-step-1 font-bold">{s.title}</h3>
              <p className="mt-2 text-base text-muted">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* -------------------------------------------------------------- green band */
export function GreenBand({ eyebrow, title, text, points, id, index }: { eyebrow: string; title: string; text: string; points: string[]; id: string; index?: number }) {
  return (
    <section aria-labelledby={id} className="py-10 md:py-14">
      <Container>
        <div className="grid overflow-hidden rounded-[2rem] border border-border bg-card md:grid-cols-2">
          <div className="relative min-h-72 overflow-hidden" data-reveal="zoom">
            <Image src="/images/forest-path.jpg" alt="" fill sizes="(min-width: 768px) 600px, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#064e3b]/70 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-2">
              {["ODD 4", "ODD 10", "ODD 13", "ODD 17"].map((s) => (
                <span key={s} className="rounded-full bg-white/90 px-3 py-1 text-sm font-bold text-[#047857]">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div className="p-8 md:p-12">
            <p data-reveal className="mb-3 flex items-center gap-3 text-sm font-bold uppercase tracking-[0.14em] text-green-text">
              {index !== undefined && <span className="font-mono tabular-nums text-muted">{String(index).padStart(2, "0")}</span>}
              <Icon name="leaf" className="size-4" />
              {eyebrow}
            </p>
            <h2 id={id} data-reveal style={delay(1)} className="text-step-4 font-bold">
              {title}
            </h2>
            <p data-reveal style={delay(2)} className="mt-4 text-muted">
              {text}
            </p>
            <ul className="mt-8 space-y-3">
              {points.map((p, i) => (
                <li key={p} data-reveal style={delay(i + 2)} className="flex gap-3">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-[#10b981]/15 text-green-text">
                    <Check aria-hidden className="size-4" />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------ project card */
export function ProjectCard(p: {
  href: string;
  title: string;
  summary: string;
  cover: string;
  programme: string;
  statusLabel: string;
  sdgLabels: string[];
  cta: string;
  headingLevel?: "h2" | "h3";
}) {
  const H = p.headingLevel ?? "h3";
  return (
    <article className="spot group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image src={p.cover} alt="" fill sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" className="spot-img object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/70 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-xs font-bold text-navy">{p.statusLabel}</span>
        <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-navy">{p.programme}</span>
      </div>
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <H className="text-step-1 font-bold">
          <Link href={p.href} className="after:absolute after:inset-0 after:content-['']">
            {p.title}
          </Link>
        </H>
        <p className="mt-2 flex-1 text-base text-muted">{p.summary}</p>
        <div className="mt-5 flex items-center justify-between gap-3">
          <ul className="flex flex-wrap gap-1.5">
            {p.sdgLabels.map((s) => (
              <li key={s} className="rounded-full bg-[#10b981]/12 px-2.5 py-0.5 text-xs font-bold text-green-text">
                {s}
              </li>
            ))}
          </ul>
          <ArrowRight aria-label={p.cta} className="spot-arrow size-5 shrink-0 text-accent-text" />
        </div>
      </div>
    </article>
  );
}

/* --------------------------------------------------------------- team card */
export function TeamCard({ name, role, title, bio, photo, linkedin }: { name: string; role: string; title: string; bio: string; photo?: string; linkedin?: string }) {
  return (
    <article className="spot group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card">
      <div className="relative aspect-[4/3] overflow-hidden bg-surface">
        {photo && <Image src={photo} alt={name} fill sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 82vw" className="spot-img object-cover object-[50%_18%]" />}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-gold/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-accent-text">{role}</p>
        <h3 className="mt-1.5 text-step-1 font-bold leading-tight">{name}</h3>
        <p className="text-sm font-medium text-muted">{title}</p>
        <p className="mb-4 mt-3 line-clamp-4 text-sm text-muted">{bio}</p>
        {linkedin && (
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex items-center gap-2 self-start rounded-full border border-border px-3.5 py-1.5 text-sm font-semibold transition-colors hover:border-[#0a66c2] hover:bg-[#0a66c2] hover:text-white"
          >
            <svg viewBox="0 0 24 24" aria-hidden className="size-4 fill-current">
              <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
            </svg>
            LinkedIn
            <span className="sr-only">– {name}</span>
          </a>
        )}
      </div>
    </article>
  );
}

/* --------------------------------------------------------------------- faq */
export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-border rounded-3xl border border-border bg-card">
      {items.map((f, i) => (
        <details key={f.q} data-reveal style={delay(i)} className="group px-6 py-5 md:px-8">
          <summary className="flex items-center justify-between gap-4 text-step-0 font-semibold">
            {f.q}
            <span className="faq-icon grid size-9 shrink-0 place-items-center rounded-full border border-border transition-colors group-hover:border-gold group-open:bg-gold group-open:text-navy">
              <Plus aria-hidden className="size-4" />
            </span>
          </summary>
          <p className="faq-body mt-3 max-w-prose text-muted">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
