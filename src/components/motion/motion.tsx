"use client";

import { useEffect } from "react";
import { usePathname } from "@/i18n/navigation";

/**
 * One tiny client component drives every scroll/pointer effect on the site:
 *  - [data-reveal]    fades/slides in when it enters the viewport (stagger with style="--i:n")
 *  - .spot            sets --mx/--my so a soft light follows the cursor (CSS transitions them)
 *  - [data-parallax]  drifts toward the pointer by up to N px, eased every frame (hero network)
 * Everything else is pure CSS (src/styles/*).
 */
export function Motion() {
  const pathname = usePathname();

  // Scroll reveal. Re-run on client navigation.
  useEffect(() => {
    // With reduced motion the CSS turns reveals into plain fades, so the observer still runs.
    const reveal = document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)");

    if (!("IntersectionObserver" in window)) {
      reveal.forEach((el) => el.classList.add("is-in", "is-done"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          if (el.hasAttribute("data-reveal")) {
            el.classList.add("is-in");
            el.addEventListener("transitionend", () => el.classList.add("is-done"), { once: true });
          }
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.1 },
    );
    reveal.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  // Pause decorative loops (hero light show) while they are off screen: saves CPU and battery.
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-pause-offscreen]");
    if (!els.length || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) e.target.classList.toggle("is-paused", !e.isIntersecting);
    });
    els.forEach((el) => io.observe(el));

    // Start the loops once the page has loaded and the main thread is idle.
    let timer = 0;
    let idle = 0;
    const goLive = () => els.forEach((el) => el.classList.add("is-live"));
    const schedule = () => {
      timer = window.setTimeout(() => {
        if ("requestIdleCallback" in window) idle = window.requestIdleCallback(goLive, { timeout: 1500 });
        else goLive();
      }, 900);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      io.disconnect();
      clearTimeout(timer);
      if (idle) window.cancelIdleCallback(idle);
      window.removeEventListener("load", schedule);
    };
  }, [pathname]);

  // Smooth scrolling for in-page anchors only (#about, #team…). A global
  // scroll-behavior: smooth would also animate the scroll reset on every route change.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>("a[href^=\"#\"]");
      const id = a?.getAttribute("href")?.slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      e.preventDefault();
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Pointer effects (mouse / trackpad only).
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let spotFrame = 0;
    const onSpot = (e: PointerEvent) => {
      const card = (e.target as HTMLElement | null)?.closest<HTMLElement>(".spot");
      if (!card) return;
      cancelAnimationFrame(spotFrame);
      spotFrame = requestAnimationFrame(() => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    };

    // Parallax: targets move toward the pointer; positions are lerped so motion stays silky.
    const items = [...document.querySelectorAll<HTMLElement>("[data-parallax]")].map((el) => ({
      el,
      strength: Number(el.dataset.parallax) || 12,
      x: 0,
      y: 0,
    }));
    let tx = 0;
    let ty = 0;
    let loop = 0;
    const tick = () => {
      let moving = false;
      for (const it of items) {
        it.x += (tx * it.strength - it.x) * 0.06;
        it.y += (ty * it.strength - it.y) * 0.06;
        if (Math.abs(tx * it.strength - it.x) > 0.05 || Math.abs(ty * it.strength - it.y) > 0.05) moving = true;
        it.el.style.setProperty("--px", `${it.x.toFixed(2)}px`);
        it.el.style.setProperty("--py", `${it.y.toFixed(2)}px`);
      }
      loop = moving ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (e: PointerEvent) => {
      onSpot(e);
      if (!items.length) return;
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!loop) loop = requestAnimationFrame(tick);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(loop);
      cancelAnimationFrame(spotFrame);
    };
  }, [pathname]);

  return null;
}

