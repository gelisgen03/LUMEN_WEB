/** Flag of Europe (12 gold stars on blue), drawn inline. Decorative. */
export function EuFlag({ className }: { className?: string }) {
  const stars = Array.from({ length: 12 }, (_, i) => {
    const a = (i * Math.PI) / 6;
    return { x: 45 + 20 * Math.sin(a), y: 30 - 20 * Math.cos(a) };
  });
  return (
    <svg viewBox="0 0 90 60" aria-hidden="true" className={className}>
      <rect width="90" height="60" rx="3" fill="#003399" />
      {stars.map((s, i) => (
        <path
          key={i}
          fill="#FFCC00"
          transform={`translate(${s.x} ${s.y}) scale(4.2)`}
          d="M0,-1 L0.2245,-0.309 L0.951,-0.309 L0.363,0.118 L0.588,0.809 L0,0.382 L-0.588,0.809 L-0.363,0.118 L-0.951,-0.309 L-0.2245,-0.309 Z"
        />
      ))}
    </svg>
  );
}
