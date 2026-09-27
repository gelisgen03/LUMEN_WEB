import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type Props = {
  id?: string;
  /** Section number shown before the eyebrow ("01"), so visitors always know where they are. */
  index?: number;
  eyebrow?: string;
  title: string;
  intro?: string;
  action?: { href: string; label: string };
  align?: "left" | "center";
  className?: string;
};

export function SectionHeader({ id, index, eyebrow, title, intro, action, align = "left", className }: Props) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-5 md:mb-14",
        align === "center" ? "items-center text-center" : "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {(eyebrow || index) && (
          <p data-reveal className={cn("mb-3 flex items-center gap-3 text-sm font-bold uppercase tracking-[0.14em] text-accent-text", align === "center" && "justify-center")}>
            {index !== undefined && <span className="font-mono tabular-nums text-muted">{String(index).padStart(2, "0")}</span>}
            <span aria-hidden className="eyebrow-line h-px w-8 bg-gold" />
            {eyebrow}
          </p>
        )}
        <h2 id={id} data-reveal style={{ "--i": 1 } as React.CSSProperties} className="text-step-4 font-bold">
          {title}
        </h2>
        {intro && (
          <p data-reveal style={{ "--i": 2 } as React.CSSProperties} className="mt-4 text-step-0 text-muted">
            {intro}
          </p>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          data-reveal
          className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-border px-5 py-2.5 font-semibold transition-colors hover:border-gold hover:bg-surface"
        >
          {action.label}
          <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
