import { Sparkle } from "lucide-react";

/** Infinite ticker of programmes / priorities. Pure CSS; the duplicate copy is hidden from AT. */
export function Marquee({ label, items }: { label: string; items: string[] }) {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-6 px-6 font-display text-lg font-semibold whitespace-nowrap md:text-xl">
          <Sparkle aria-hidden className="size-4 text-gold" />
          {item}
        </li>
      ))}
    </ul>
  );
  return (
    <section aria-label={label} className="marquee overflow-hidden border-y border-border bg-surface py-5">
      <div className="marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}
