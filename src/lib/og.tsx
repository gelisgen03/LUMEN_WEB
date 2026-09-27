import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

/**
 * Shared OpenGraph template: navy background, title, small geometric mark.
 * Rendered at build time for static routes (no runtime cost).
 */
export function renderOg({ eyebrow, title }: { eyebrow: string; title: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0f1e3d",
          color: "#ffffff",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 56, height: 56, background: "#ffffff", borderRadius: 10, display: "flex", position: "relative" }}>
            <div style={{ position: "absolute", left: 14, top: 14, width: 28, height: 28, background: "#f4b744", borderBottomLeftRadius: 28 }} />
          </div>
          <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: 2 }}>LUMEN</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 26, color: "#d3d7df", textTransform: "uppercase", letterSpacing: 3 }}>{eyebrow}</div>
          <div style={{ fontSize: title.length > 60 ? 54 : 68, fontWeight: 700, lineHeight: 1.1, maxWidth: 1000 }}>{title}</div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {["#f4b744", "#d3d7df", "#ffffff", "#d3d7df"].map((c, i) => (
            <div key={i} style={{ width: 48, height: 12, background: c }} />
          ))}
        </div>
      </div>
    ),
    ogSize,
  );
}
