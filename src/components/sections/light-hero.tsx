import { ArrowRight, ChevronDown } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Link } from "@/i18n/navigation";

type Props = {
  titleLead: string;
  titleRest: string;
  text: string;
  primary: { href: string; label: string };
  secondary: { href: string; label: string };
  scrollLabel: string;
};

/** European cities in a 400×400 box; Paris (index 0) is LUMEN's light source. */
const nodes = [
  { x: 170, y: 205, name: "Paris" },
  { x: 150, y: 150 },
  { x: 195, y: 170 },
  { x: 250, y: 150 },
  { x: 305, y: 140 },
  { x: 265, y: 70 },
  { x: 275, y: 215 },
  { x: 245, y: 285 },
  { x: 115, y: 285 },
  { x: 60, y: 300 },
  { x: 325, y: 325 },
  { x: 370, y: 290 },
];
const links: [number, number][] = [
  [0, 1], [0, 2], [0, 8], [0, 6], [0, 7], [2, 3], [3, 4], [3, 5], [3, 6], [6, 10], [7, 10], [10, 11], [8, 9], [1, 5], [4, 6],
];
/** Light pulses: which links carry a travelling light, with duration and start offset. */
const pulses = [
  { link: 0, d: "3.2s", delay: "0s" },
  { link: 1, d: "3.6s", delay: "0.9s" },
  { link: 2, d: "3.4s", delay: "1.7s" },
  { link: 3, d: "3s", delay: "0.4s" },
  { link: 4, d: "3.8s", delay: "2.3s" },
  { link: 5, d: "4.2s", delay: "1.2s" },
  { link: 7, d: "4s", delay: "3s" },
  { link: 9, d: "4.4s", delay: "2s" },
];
/** Place an overlay element on a viewBox point (400×400 → percentages). */
const pos = (n: { x: number; y: number }) => ({ left: `${n.x / 4}%`, top: `${n.y / 4}%` });

const streaks = [
  { top: "22%", d: "12s", delay: "3s" },
  { top: "64%", d: "15s", delay: "8s" },
];
const particles = [
  { l: "12%", t: "70%", d: "8s", delay: "0s" },
  { l: "28%", t: "18%", d: "11s", delay: "1s" },
  { l: "46%", t: "82%", d: "9s", delay: "2s" },
  { l: "63%", t: "30%", d: "12s", delay: "0.5s" },
  { l: "78%", t: "62%", d: "10s", delay: "3s" },
  { l: "88%", t: "14%", d: "9s", delay: "1.5s" },
];

/**
 * LUMEN = light. A lantern glow sits on Paris; rays turn slowly, the European network
 * draws itself outwards from the light, then keeps living: light pulses travel along the
 * lines, halos twinkle, an orbit turns, the network floats and gently follows the mouse,
 * streaks of light cross the sky. Styles in src/styles/hero.css; the only JS is the
 * pointer follow in motion.tsx. No canvas, no WebGL.
 * The h1 text never animates its opacity, so it stays the LCP element from first paint.
 */
export function LightHero({ titleLead, titleRest, text, primary, secondary, scrollLabel }: Props) {
  return (
    <section data-pause-offscreen className="relative isolate overflow-hidden bg-navy text-white">
      {/* light layers */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="hero-rays absolute left-[62%] top-[48%] size-[56rem] -translate-x-1/2 -translate-y-1/2 opacity-70" />
        <div className="hero-beam absolute -right-[10%] -top-[20%] h-[90%] w-[70%] bg-[radial-gradient(ellipse_at_top_right,rgba(244,183,68,0.22),rgba(244,183,68,0.06)_40%,transparent_70%)]" />
        {particles.map((p, i) => (
          <span
            key={i}
            className="particle absolute size-1.5 rounded-full bg-gold"
            style={{ left: p.l, top: p.t, "--d": p.d, "--delay": p.delay } as React.CSSProperties}
          />
        ))}
        {streaks.map((s, i) => (
          <span key={i} className="shooting-light absolute left-0" style={{ top: s.top, "--d": s.d, "--delay": s.delay } as React.CSSProperties} />
        ))}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-navy to-transparent" />
      </div>

      <Container className="grid items-center gap-10 pb-16 pt-12 md:min-h-[min(88vh,52rem)] md:grid-cols-12 md:pb-24 md:pt-16">
        <div className="md:col-span-7">
          <h1 className="text-step-5 font-bold">
            <span className="text-lumen">{titleLead}</span> {titleRest}
          </h1>
          <p className="fade-up mt-6 max-w-[58ch] text-step-0 text-[#d5dae3]" style={{ "--delay": "0.25s" } as React.CSSProperties}>
            {text}
          </p>
          <div className="fade-up mt-9 flex flex-col gap-3 sm:flex-row" style={{ "--delay": "0.4s" } as React.CSSProperties}>
            <Link
              href={primary.href}
              className="btn-shine group inline-flex h-13 items-center justify-center gap-2 rounded-full bg-gold px-7 font-semibold text-navy shadow-[0_0_40px_-8px_rgba(244,183,68,0.8)] transition-shadow hover:shadow-[0_0_60px_-4px_rgba(244,183,68,0.95)]"
            >
              {primary.label}
              <ArrowRight aria-hidden className="size-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href={secondary.href}
              className="group inline-flex h-13 items-center justify-center gap-2 rounded-full border border-white/30 px-7 font-semibold text-white transition-colors hover:border-gold hover:bg-white/5"
            >
              {secondary.label}
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[26rem] md:col-span-5 md:max-w-none">
          <div aria-hidden className="hero-glow absolute left-[42%] top-[51%] size-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full" />
          <div data-parallax="18" className="net-parallax relative">
          <div className="net-float relative">
          <svg viewBox="0 0 400 400" className="net-intro relative w-full" role="img" aria-label="Europe network">
            <title>Europe network</title>
            {links.map(([a, b], i) => (
              <line
                key={i}
                x1={nodes[a]!.x}
                y1={nodes[a]!.y}
                x2={nodes[b]!.x}
                y2={nodes[b]!.y}
                stroke={a === 0 ? "#F4B744" : "#22C3E6"}
                strokeOpacity={a === 0 ? 0.85 : 0.55}
                strokeWidth={a === 0 ? 2 : 1.4}
                strokeLinecap="round"
              />
            ))}
            {nodes.map((n, i) => (
              <circle
                key={i}
                cx={n.x}
                cy={n.y}
                r={i === 0 ? 10 : 5}
                fill={i === 0 ? "#F4B744" : "#0F1E3D"}
                stroke={i === 0 ? "#FFF4D6" : "#22C3E6"}
                strokeWidth={i === 0 ? 3 : 2}
              />
            ))}
            <text x={nodes[0]!.x - 12} y={nodes[0]!.y + 30} fill="#FDE9B8" fontSize="13" fontWeight="600">
              Paris
            </text>
          </svg>
          {/* Looping light effects: HTML over the SVG so they run on the compositor (see hero.css). */}
          <div aria-hidden className="net-fx">
            <span className="fx-orbit" style={pos(nodes[0]!)} />
            {[0, 1, 2].map((r) => (
              <span key={`r${r}`} className="fx-ripple" style={{ ...pos(nodes[0]!), "--i": r } as React.CSSProperties} />
            ))}
            {nodes.filter((_, i) => i % 2 === 1).map((n, i) => (
              <span key={`h${i}`} className="fx-halo" style={{ ...pos(n), "--i": i } as React.CSSProperties} />
            ))}
            {pulses.map((p) => {
              const [a, b] = links[p.link]!;
              const from = nodes[a]!;
              const to = nodes[b]!;
              const length = Math.hypot(to.x - from.x, to.y - from.y);
              const angle = (Math.atan2(to.y - from.y, to.x - from.x) * 180) / Math.PI;
              return (
                <span
                  key={`p${p.link}`}
                  className="fx-pulse"
                  style={{ ...pos(from), width: `${length / 4}%`, rotate: `${angle}deg` }}
                >
                  <span style={{ "--d": p.d, "--delay": p.delay, "--pulse-color": a === 0 ? "#FDE9B8" : "#9DEBFA" } as React.CSSProperties} />
                </span>
              );
            })}
          </div>
          </div>
          </div>
        </div>
      </Container>

      <a
        href="#content"
        className="scroll-cue absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-xs font-medium uppercase tracking-[0.2em] text-white/70 hover:text-gold md:flex"
      >
        {scrollLabel}
        <ChevronDown aria-hidden className="size-4" />
      </a>
    </section>
  );
}
