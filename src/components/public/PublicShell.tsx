"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, Logo, CoverArt } from "@/components/ui";
import { getPosts, getSettings, getTags } from "@/lib/repo";
import { fmtDate } from "@/lib/format";
import type { Post, SiteSettings } from "@/lib/types";

const NAV = [
  { href: "/", label: "Trang chủ" },
  ...Object.entries(getTags()).map(([slug, label]) => ({ href: `/chu-de/${slug}`, label })),
  { href: "/sach", label: "Sách mình đọc" },
  { href: "/gioi-thieu", label: "Về tôi" },
];

export default function PublicShell({ children }: { children: React.ReactNode }) {
  const [search, setSearch] = useState(false);
  const [site, setSite] = useState<SiteSettings | null>(null);
  const pathname = usePathname();

  useEffect(() => { getSettings().then(setSite); }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSearch(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const title = site?.title ?? "Blog Của Bông";

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header style={{ borderBottom: "1px solid var(--hairline)", background: "var(--paper)", position: "sticky", top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: "var(--shell-max)", margin: "0 auto", padding: "0 28px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
            <Link href="/" className="fr" style={{ display: "flex", alignItems: "center", gap: 11 }}>
              <Logo size={30} />
              <span style={{ fontFamily: "var(--serif)", fontSize: 20, fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.01em" }}>{title}</span>
            </Link>
            <nav style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {NAV.map((l) => {
                const active = l.href === "/" ? pathname === "/" : pathname === l.href;
                return (
                  <Link key={l.href} href={l.href} className="fr"
                    style={{ padding: "8px 13px", fontFamily: "var(--sans)", fontSize: 14.5, fontWeight: active ? 600 : 450, color: active ? "var(--accent-ink)" : "var(--ink-2)", borderRadius: 8 }}>
                    {l.label}
                  </Link>
                );
              })}
              <button onClick={() => setSearch(true)} className="fr" aria-label="Tìm kiếm"
                style={{ marginLeft: 6, width: 38, height: 38, display: "grid", placeItems: "center", background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: 99, color: "var(--ink-2)" }}>
                <Icon name="search" size={17} />
              </button>
            </nav>
          </div>
        </div>
      </header>

      <div style={{ flex: 1 }}>{children}</div>

      <footer style={{ borderTop: "1px solid var(--hairline)", background: "var(--surface)" }}>
        <div style={{ maxWidth: "var(--shell-max)", margin: "0 auto", padding: "44px 28px", display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <Logo size={26} />
            <div>
              <div style={{ fontFamily: "var(--serif)", fontSize: 16, fontWeight: 600 }}>{title}</div>
              <div className="meta" style={{ fontSize: 12.5 }}>© 2026 · {site?.footer ?? "Bay lên sao trời trên đôi cánh lợn"}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Link href="/gioi-thieu" className="fr" style={footLink}>Về tôi</Link>
            <Link href="/" className="fr" style={footLink}>Bài viết</Link>
          </div>
        </div>
      </footer>

      {search && <SearchOverlay onClose={() => setSearch(false)} />}
    </div>
  );
}

const footLink: React.CSSProperties = { background: "none", border: "none", padding: "8px 12px", fontFamily: "var(--sans)", fontSize: 14, color: "var(--ink-2)", borderRadius: 7 };

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { getPosts().then((p) => setPosts(p.filter((x) => x.status === "published"))); }, []);
  useEffect(() => { ref.current?.focus(); }, []);
  const results = q.trim()
    ? posts.filter((p) => p.title.toLowerCase().includes(q.toLowerCase()) || p.excerpt.toLowerCase().includes(q.toLowerCase()))
    : [];
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 90, background: "rgba(38,33,27,0.32)", backdropFilter: "blur(3px)", display: "flex", justifyContent: "center", paddingTop: 96 }}>
      <div onClick={(e) => e.stopPropagation()} className="fade-up" style={{ width: "min(620px, 92vw)", height: "fit-content", maxHeight: "70vh", background: "var(--surface)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-lg)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", borderBottom: "1px solid var(--hairline)" }}>
          <Icon name="search" size={20} style={{ color: "var(--ink-3)" }} />
          <input ref={ref} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm bài viết…" style={{ flex: 1, border: "none", outline: "none", background: "none", fontFamily: "var(--sans)", fontSize: 17, color: "var(--ink)" }} />
          <button onClick={onClose} className="fr" style={{ background: "var(--surface-2)", border: "none", borderRadius: 7, padding: "4px 9px", fontFamily: "var(--sans)", fontSize: 12, color: "var(--ink-3)" }}>Esc</button>
        </div>
        <div className="thin-scroll" style={{ overflowY: "auto", padding: results.length ? 10 : 0 }}>
          {results.map((p) => (
            <Link key={p.id} href={`/bai-viet/${p.slug}`} onClick={onClose} className="fr" style={{ display: "flex", gap: 14, width: "100%", textAlign: "left", padding: 12, borderRadius: 8, alignItems: "center" }}>
              <div style={{ width: 64, flexShrink: 0 }}><CoverArt hue={p.cover.hue} ratio="4 / 3" label={null} url={p.coverImageUrl} /></div>
              <div>
                <div style={{ fontFamily: "var(--serif)", fontSize: 16, color: "var(--ink)" }}>{p.title}</div>
                <div className="meta" style={{ fontSize: 13 }}>{fmtDate(p.date)}</div>
              </div>
            </Link>
          ))}
          {q.trim() && results.length === 0 && <div style={{ padding: 40, textAlign: "center", color: "var(--ink-3)", fontFamily: "var(--sans)", fontSize: 14 }}>Không tìm thấy bài viết nào.</div>}
        </div>
      </div>
    </div>
  );
}
