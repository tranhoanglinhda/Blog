"use client";
import React, { useMemo } from "react";
import Link from "next/link";
import { CoverArt, Icon } from "@/components/ui";
import { fmtDate, fmtViews } from "@/lib/format";
import { getTags } from "@/lib/repo";
import type { Post, SiteSettings } from "@/lib/types";

const TAGS = getTags();

export function ReadMeta({ post }: { post: Post }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 12 }}>
      <span className="meta" style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
        <Icon name="clock" size={13} /> {post.readMins} phút đọc
      </span>
      <span className="meta" style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
        <Icon name="eye" size={13} /> {fmtViews(post.views)} lượt xem
      </span>
    </div>
  );
}

export function PostCard({ post, variant = "row" }: { post: Post; variant?: "row" | "feature" }) {
  const href = `/bai-viet/${post.slug}`;
  if (variant === "feature") {
    return (
      <Link href={href} className="fade-up" style={{ cursor: "pointer", display: "block" }}>
        <div style={{ marginBottom: 18 }}>
          <CoverArt hue={post.cover.hue} label={post.cover.label} ratio="16 / 9" big url={post.coverImageUrl} />
        </div>
        <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
          <span className="eyebrow">{TAGS[post.tags[0]]}</span>
          <span className="meta">·</span>
          <span className="meta">{fmtDate(post.date)}</span>
        </div>
        <h2 className="feature-h2" style={{ margin: "0 0 10px", fontSize: 30, lineHeight: 1.15 }}>{post.title}</h2>
        <p style={{ margin: 0, fontFamily: "var(--serif)", fontSize: 18, lineHeight: 1.5, color: "var(--ink-2)" }}>{post.excerpt}</p>
        <ReadMeta post={post} />
      </Link>
    );
  }
  return (
    <Link href={href} className="fade-up post-row"
      style={{ cursor: "pointer", display: "grid", gridTemplateColumns: "1fr 168px", gap: 22, paddingBottom: 28, borderBottom: "1px solid var(--hairline-2)" }}>
      <div>
        <div style={{ display: "flex", gap: 10, marginBottom: 9 }}>
          <span className="eyebrow">{TAGS[post.tags[0]]}</span>
          <span className="meta">·</span>
          <span className="meta">{fmtDate(post.date)}</span>
        </div>
        <h3 style={{ margin: "0 0 8px", fontSize: 22, lineHeight: 1.2 }}>{post.title}</h3>
        <p style={{ margin: 0, fontFamily: "var(--serif)", fontSize: 16, lineHeight: 1.5, color: "var(--ink-2)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{post.excerpt}</p>
        <ReadMeta post={post} />
      </div>
      <div className="post-row-thumb" style={{ alignSelf: "start" }}>
        <CoverArt hue={post.cover.hue} ratio="4 / 3" label={null} url={post.coverImageUrl} />
      </div>
    </Link>
  );
}

export function GridCard({ post }: { post: Post }) {
  return (
    <Link href={`/bai-viet/${post.slug}`} className="fade-up" style={{ cursor: "pointer", display: "block" }}>
      <div style={{ marginBottom: 14 }}><CoverArt hue={post.cover.hue} ratio="16 / 10" label={null} url={post.coverImageUrl} /></div>
      <div style={{ display: "flex", gap: 9, marginBottom: 8 }}>
        <span className="eyebrow">{TAGS[post.tags[0]]}</span><span className="meta">·</span><span className="meta">{fmtDate(post.date)}</span>
      </div>
      <h3 style={{ margin: "0 0 7px", fontSize: 20, lineHeight: 1.2 }}>{post.title}</h3>
      <p style={{ margin: 0, fontFamily: "var(--serif)", fontSize: 15, lineHeight: 1.5, color: "var(--ink-2)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{post.excerpt}</p>
    </Link>
  );
}

function SideCard({ children }: { children: React.ReactNode }) {
  return <div style={{ background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)", padding: 22, boxShadow: "var(--shadow-sm)" }}>{children}</div>;
}
function SideTitle({ children }: { children: React.ReactNode }) {
  return <h4 style={{ margin: "0 0 16px", fontFamily: "var(--sans)", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-3)" }}>{children}</h4>;
}

export function Sidebar({ posts, site }: { posts: Post[]; site: SiteSettings }) {
  const popular = [...posts].sort((a, b) => b.views - a.views).slice(0, 4);
  const archive = useMemo(() => {
    const m: Record<string, number> = {};
    posts.forEach((p) => {
      const d = new Date(p.date + "T00:00:00");
      const k = `Tháng ${d.getMonth() + 1}, ${d.getFullYear()}`;
      m[k] = (m[k] || 0) + 1;
    });
    return Object.entries(m);
  }, [posts]);
  return (
    <aside style={{ display: "flex", flexDirection: "column", gap: 30 }}>
      <SideCard>
        <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: 99, overflow: "hidden", background: site.avatarUrl ? `center / cover no-repeat url(${site.avatarUrl})` : "linear-gradient(135deg, oklch(0.8 0.08 30), oklch(0.62 0.1 20))", display: "grid", placeItems: "center", color: "#fff", fontFamily: "var(--serif)", fontSize: 22, flexShrink: 0 }}>{!site.avatarUrl && site.author.charAt(0)}</div>
          <div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 17, fontWeight: 600 }}>{site.author}</div>
            <div className="meta" style={{ fontSize: 12.5 }}>Tác giả</div>
          </div>
        </div>
        <p style={{ margin: 0, fontFamily: "var(--serif)", fontSize: 15, lineHeight: 1.55, color: "var(--ink-2)" }}>{site.authorBio}</p>
        <Link href="/gioi-thieu" className="fr" style={{ marginTop: 14, display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: "var(--accent-ink)" }}>Đọc thêm về tôi <Icon name="arrow" size={14} /></Link>
      </SideCard>

      <SideCard>
        <SideTitle>Được đọc nhiều</SideTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {popular.map((p, i) => (
            <Link key={p.id} href={`/bai-viet/${p.slug}`} className="fr" style={{ display: "flex", gap: 13, textAlign: "left", alignItems: "flex-start" }}>
              <span style={{ fontFamily: "var(--serif)", fontSize: 22, color: "var(--accent)", lineHeight: 1, width: 22, flexShrink: 0 }}>{i + 1}</span>
              <span>
                <span style={{ display: "block", fontFamily: "var(--serif)", fontSize: 15.5, lineHeight: 1.25, color: "var(--ink)", marginBottom: 3 }}>{p.title}</span>
                <span className="meta" style={{ fontSize: 12 }}>{fmtViews(p.views)} lượt xem</span>
              </span>
            </Link>
          ))}
        </div>
      </SideCard>

      <SideCard>
        <SideTitle>Chủ đề</SideTitle>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {Object.entries(TAGS).map(([slug, label]) => (
            <Link key={slug} href={`/chu-de/${slug}`} className="fr"
              style={{ padding: "6px 13px", fontFamily: "var(--sans)", fontSize: 13, color: "var(--ink-2)", background: "var(--surface-2)", border: "1px solid var(--hairline)", borderRadius: 99 }}>
              {label}
            </Link>
          ))}
        </div>
      </SideCard>

      <SideCard>
        <SideTitle>Lưu trữ</SideTitle>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {archive.map(([k, n]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--hairline-2)", fontFamily: "var(--sans)", fontSize: 14, color: "var(--ink-2)" }}>
              <span>{k}</span><span className="meta">{n}</span>
            </div>
          ))}
        </div>
      </SideCard>
    </aside>
  );
}
