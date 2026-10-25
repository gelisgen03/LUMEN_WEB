"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Children, useCallback, useEffect, useRef, useState } from "react";

/**
 * Horizontal, snap-scrolling row of team cards: 1.2 cards on phones, 2 on tablets,
 * 3 on desktop. Swipe / trackpad / keyboard scroll natively; the arrows page by one card.
 * Items are not data-reveal'd individually (off-screen ones would never intersect).
 */
export function TeamCarousel({ children, previousLabel, nextLabel }: { children: React.ReactNode; previousLabel: string; nextLabel: string }) {
  const ref = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const page = (dir: 1 | -1) => {
    const el = ref.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: smooth ? "smooth" : "auto" });
  };

  const arrow =
    "grid size-11 place-items-center rounded-full border border-border bg-card transition-colors hover:border-gold hover:bg-gold hover:text-navy disabled:pointer-events-none disabled:opacity-35";

  return (
    <div data-reveal>
      <ul
        ref={ref}
        onScroll={update}
        className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-5 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:-mx-8 lg:scroll-px-8 lg:px-8 [&::-webkit-scrollbar]:hidden"
      >
        {Children.map(children, (child) => (
          <li className="w-[82%] shrink-0 snap-start sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]">{child}</li>
        ))}
      </ul>
      <div className="mt-6 flex justify-end gap-3">
        <button type="button" onClick={() => page(-1)} disabled={edge.start} aria-label={previousLabel} className={arrow}>
          <ChevronLeft aria-hidden className="size-5" />
        </button>
        <button type="button" onClick={() => page(1)} disabled={edge.end} aria-label={nextLabel} className={arrow}>
          <ChevronRight aria-hidden className="size-5" />
        </button>
      </div>
    </div>
  );
}
