import React from "react";

// ---- icon set (stroke, 1.6) ----
export const ICONS: Record<string, string> = {
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3",
  x: "M18 6 6 18M6 6l12 12",
  arrow: "M5 12h14M13 6l6 6-6 6",
  arrowL: "M19 12H5M11 18l-6-6 6-6",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
  eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z|M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  tag: "M20.6 13.4 13 21l-9-9V4h8l8.6 8.6a2 2 0 0 1 0 2.8zM7.5 7.5h.01",
  edit: "M12 20h9|M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z",
  plus: "M12 5v14M5 12h14",
  layout: "M3 4h18v16H3z|M3 9h18M9 9v11",
  list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z|M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 7 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H1a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 2.6 7a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 7 2.6 1.6 1.6 0 0 0 8 1.1V1a2 2 0 1 1 4 0v.1A1.6 1.6 0 0 0 17 2.6a1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0 1.1 2.7h.1a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.4 1z",
  trash: "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
  image: "M3 3h18v18H3z|M8.5 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4M21 16l-5-5L4 21",
  bold: "M6 4h8a4 4 0 0 1 0 8H6zM6 12h9a4 4 0 0 1 0 8H6z",
  italic: "M19 4h-9M14 20H5M15 4 9 20",
  quote: "M3 21c3 0 6-2 6-7V5H3v8h3c0 2-1 3-3 3zM15 21c3 0 6-2 6-7V5h-6v8h3c0 2-1 3-3 3z",
  h2: "M4 6v12M4 12h8M12 6v12M17 18v-6l4 0M17 12c0-2 4-2 4 0",
  link: "M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.5 1.5|M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1.5-1.5",
  ul: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  check: "M20 6 9 17l-5-5",
  calendar: "M3 5h18v16H3zM3 9h18M8 3v4M16 3v4",
  chevron: "M9 6l6 6-6 6",
  save: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z|M17 21v-8H7v8M7 3v5h8",
  send: "M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z",
  heart: "M19 14c1.5-1.5 3-3.5 3-5.5A4.5 4.5 0 0 0 12 6 4.5 4.5 0 0 0 2 8.5c0 2 1.5 4 3 5.5l7 7z",
  mail: "M3 5h18v14H3z|M3 6l9 7 9-7",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4|M16 17l5-5-5-5M21 12H9",
  external: "M15 3h6v6|M10 14 21 3|M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5",
};

export function Icon({
  name, size = 18, stroke = 1.6, style, fill = "none",
}: { name: string; size?: number; stroke?: number; style?: React.CSSProperties; fill?: string }) {
  const paths = (ICONS[name] || "").split("|");
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor"
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden>
      {paths.map((d, i) => <path key={i} d={d} />)}
    </svg>
  );
}

export function Logo({ size = 30 }: { size?: number }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden>
        <rect x="2" y="2" width="36" height="36" rx="9" fill="var(--accent)" />
        <path d="M11 27V14c0-1 .8-1.6 1.7-1.3L20 15l7.3-2.3c.9-.3 1.7.3 1.7 1.3v13c0 1-.8 1.6-1.7 1.3L20 26l-7.3 2.3c-.9.3-1.7-.3-1.7-1.3z" fill="#fff" fillOpacity="0.95" />
        <path d="M20 15v11" stroke="var(--accent)" strokeWidth="1.5" />
      </svg>
    </span>
  );
}

export function CoverArt({
  hue = 24, label, ratio = "16 / 10", rounded = true, big = false, url,
}: { hue?: number; label?: string | null; ratio?: string; rounded?: boolean; big?: boolean; url?: string }) {
  const h = hue;
  const bg = `linear-gradient(135deg,
      oklch(0.82 0.07 ${h}) 0%,
      oklch(0.71 0.10 ${h}) 48%,
      oklch(0.55 0.11 ${(h + 18) % 360}) 100%)`;
  return (
    <div style={{
      position: "relative", aspectRatio: ratio,
      background: url ? `center / cover no-repeat url(${url})` : bg,
      borderRadius: rounded ? "var(--radius)" : 0, overflow: "hidden",
      boxShadow: "inset 0 0 0 1px rgba(38,33,27,0.06)",
    }}>
      {!url && (
        <>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 80% at 78% 18%, rgba(255,255,255,0.42), transparent 46%)" }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "42%", background: "linear-gradient(to top, rgba(38,33,27,0.16), transparent)" }} />
          <div style={{
            position: "absolute", inset: 0, opacity: 0.5, mixBlendMode: "overlay",
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
          }} />
        </>
      )}
      {label && (
        <div style={{
          position: "absolute", left: big ? 16 : 10, bottom: big ? 14 : 9,
          display: "flex", alignItems: "center", gap: 6,
          fontFamily: "var(--sans)", fontSize: big ? 12 : 10.5, fontWeight: 600,
          letterSpacing: "0.04em", color: "rgba(255,255,255,0.92)",
          textShadow: "0 1px 3px rgba(0,0,0,0.25)",
        }}>
          <svg width={big ? 15 : 13} height={big ? 15 : 13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.5-3.5L9 20" />
          </svg>
          {label}
        </div>
      )}
    </div>
  );
}

// avatar hue from name
const AVATAR_HUES = [18, 150, 210, 280, 45, 330, 100];
export function avatarColor(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h + name.charCodeAt(i)) % AVATAR_HUES.length;
  return AVATAR_HUES[h];
}

// shared button style objects
export const primaryBtn: React.CSSProperties = { display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 20px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: 9, fontFamily: "var(--sans)", fontSize: 14.5, fontWeight: 600 };
export const secondaryBtn: React.CSSProperties = { display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", background: "var(--surface)", color: "var(--ink)", border: "1px solid var(--hairline)", borderRadius: 9, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600 };
export const btnGhost: React.CSSProperties = { display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", padding: 0, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: "var(--accent-ink)" };
export const inputStyle: React.CSSProperties = { width: "100%", padding: "11px 14px", fontFamily: "var(--sans)", fontSize: 15, color: "var(--ink)", background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: 9, outline: "none" };
