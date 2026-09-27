"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * "On this page" index. Rail (≥1536px, fixed left): lamps on a wire light up in order as
 * sections scroll into view, the current one glows and pulses. Bar (other widths): a
 * horizontal pill bar under the header. Both highlight the section currently in view.
 */
export function SectionIndex({ label, sections, variant }: { label: string; sections: { id: string; label: string }[]; variant: "rail" | "bar" }) {
  const [active, setActive] = useState(sections[0]?.id);
  // Index of the previously active lamp: lamps between old and new light up one after another.
  const prevRef = useRef(0);
  useEffect(() => {
    const t = setTimeout(() => {
      prevRef.current = Math.max(0, sections.findIndex((s) => s.id === active));
    }, 50);
    return () => clearTimeout(t);
  }, [active, sections]);

  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections]);

  if (variant === "bar") {
    return (
      <nav aria-label={label} className="sticky top-18 z-30 border-b border-border bg-background/90 backdrop-blur 2xl:hidden">
        <ul className="mx-auto flex max-w-content gap-2 overflow-x-auto px-4 py-2.5 [scrollbar-width:none] sm:px-6 lg:px-8">
          {sections.map((s, i) => (
            <li key={s.id} className="shrink-0">
              <a
                href={`#${s.id}`}
                aria-current={active === s.id ? "true" : undefined}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                  active === s.id ? "border-gold bg-gold text-navy" : "border-border text-muted hover:border-gold hover:text-foreground",
                )}
              >
                <span className="font-mono text-xs tabular-nums opacity-70">{String(i + 1).padStart(2, "0")}</span>
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  const activeIndex = Math.max(0, sections.findIndex((s) => s.id === active));

  return (
    <nav aria-label={label} className="fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 2xl:block">
      <div className="relative">
        {/* the wire fills up to the current lamp */}
        <span aria-hidden className="rail-wire">
          <span className="rail-wire-fill" style={{ "--rail-progress": sections.length > 1 ? activeIndex / (sections.length - 1) : 0 } as React.CSSProperties} />
        </span>
        <ul className="relative space-y-2.5">
          {sections.map((s, i) => {
            const state = i === activeIndex ? "active" : i < activeIndex ? "lit" : "off";
            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  aria-current={state === "active" ? "true" : undefined}
                  data-state={state}
                  className="rail-item group flex items-center gap-3 py-0.5"
                  style={{ "--lamp-delay": `${Math.max(0, i - prevRef.current) * 0.12}s` } as React.CSSProperties}
                >
                  <span aria-hidden className="rail-lamp" />
                  <span className="rail-num font-mono text-xs tabular-nums text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <span className="rail-label whitespace-nowrap text-sm font-semibold text-foreground">{s.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
