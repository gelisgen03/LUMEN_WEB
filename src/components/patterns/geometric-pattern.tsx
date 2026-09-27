import { cn, hashString } from "@/lib/utils";

type Props = {
  /** Any string (slug, name). Same seed → same pattern, on every build. */
  seed: string;
  cols?: number;
  rows?: number;
  className?: string;
  /** Visual density: share of cells left empty (0–1). */
  sparse?: number;
};

/** Mulberry32 PRNG: tiny and deterministic. */
function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FILLS = ["var(--pattern-a)", "var(--pattern-b)", "var(--pattern-c)"] as const;

/**
 * Abstract geometric artwork used wherever there is no photo (project covers,
 * post covers, hero, team portraits). Pure server-rendered SVG: no JS, no request,
 * colours follow the theme through CSS variables.
 */
export function GeometricPattern({ seed, cols = 6, rows = 4, className, sparse = 0.2 }: Props) {
  const rand = rng(hashString(seed));
  const S = 40;
  const shapes: React.ReactNode[] = [];

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const r = rand();
      if (r < sparse) continue;
      // Accent colour stays rare so it reads as an accent.
      const pick = rand();
      const fill = pick < 0.14 ? FILLS[1] : pick < 0.55 ? FILLS[0] : FILLS[2];
      const px = x * S;
      const py = y * S;
      const rot = Math.floor(rand() * 4) * 90;
      const kind = Math.floor(rand() * 5);
      const t = `rotate(${rot} ${px + S / 2} ${py + S / 2})`;
      const key = `${x}-${y}`;

      switch (kind) {
        case 0: // quarter circle
          shapes.push(<path key={key} d={`M${px} ${py}h${S}a${S} ${S} 0 0 1-${S} ${S}z`} fill={fill} transform={t} />);
          break;
        case 1: // half circle
          shapes.push(<path key={key} d={`M${px} ${py + S}a${S / 2} ${S / 2} 0 0 1 ${S} 0z`} fill={fill} transform={t} />);
          break;
        case 2: // circle
          shapes.push(<circle key={key} cx={px + S / 2} cy={py + S / 2} r={S / 2 - 4} fill={fill} />);
          break;
        case 3: // triangle
          shapes.push(<path key={key} d={`M${px} ${py}h${S}L${px} ${py + S}z`} fill={fill} transform={t} />);
          break;
        default: // square with inset
          shapes.push(<rect key={key} x={px + 6} y={py + 6} width={S - 12} height={S - 12} fill={fill} />);
      }
    }
  }

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={`0 0 ${cols * S} ${rows * S}`}
      preserveAspectRatio="xMidYMid slice"
      className={cn("block h-full w-full", className)}
      style={{ background: "var(--pattern-bg)" }}
    >
      {shapes}
    </svg>
  );
}
