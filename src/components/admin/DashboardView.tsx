"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon, CoverArt, btnGhost } from "@/components/ui";
import { getPosts, getTags } from "@/lib/repo";
import { fmtDate, fmtViews } from "@/lib/format";
import type { Post } from "@/lib/types";
import { PageHead, StatusBadge } from "./AdminShell";

export default function DashboardView() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => { getPosts().then(setPosts); }, []);

  const pub = posts.filter((p) => p.status === "published");
  const drafts = posts.filter((p) => p.status === "draft");
  const totalViews = pub.reduce((s, p) => s + p.views, 0);
  const stats = [
    { label: "Bài đã đăng", value: String(pub.length), icon: "check" },
    { label: "Bản nháp", value: String(drafts.length), icon: "edit" },
    { label: "Tổng lượt xem", value: fmtViews(totalViews), icon: "eye" },
    { label: "Chủ đề", value: String(Object.keys(getTags()).length), icon: "tag" },
  ];
  const recent = [...posts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);

  return (
    <div className="admin-pad" style={{ padding: "32px 40px 60px", maxWidth: 1080 }}>
      <PageHead title="Tổng quan" sub="Chào buổi sáng, Mây. Hôm nay viết gì nhỉ?" />
      <div className="stat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18, marginBottom: 36 }}>
        {stats.map((s) => (
          <div key={s.label} style={{ padding: 20, background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)" }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "var(--accent-soft)", color: "var(--accent-ink)", display: "grid", placeItems: "center", marginBottom: 14 }}><Icon name={s.icon} size={19} /></div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 32, fontWeight: 600, lineHeight: 1 }}>{s.value}</div>
            <div className="meta" style={{ marginTop: 6 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <h3 style={{ margin: 0, fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, color: "var(--ink)" }}>Bài viết gần đây</h3>
        <button onClick={() => router.push("/admin4869/posts")} className="fr" style={{ ...btnGhost, cursor: "pointer" }}>Xem tất cả <Icon name="arrow" size={14} /></button>
      </div>
      <div style={{ background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
        {recent.map((p, i, arr) => (
          <button key={p.id} onClick={() => router.push(`/admin4869/posts/${p.id}/edit`)} className="fr" style={{ display: "flex", alignItems: "center", gap: 16, width: "100%", textAlign: "left", padding: "14px 18px", background: "none", border: "none", borderBottom: i < arr.length - 1 ? "1px solid var(--hairline-2)" : "none", cursor: "pointer" }}>
            <div style={{ width: 60, flexShrink: 0 }}><CoverArt hue={p.cover.hue} ratio="4 / 3" label={null} url={p.coverImageUrl} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "var(--serif)", fontSize: 16, color: "var(--ink)", marginBottom: 3 }}>{p.title}</div>
              <div className="meta" style={{ fontSize: 13 }}>{fmtDate(p.date)} · {fmtViews(p.views)} lượt xem</div>
            </div>
            <StatusBadge status={p.status} />
            <Icon name="chevron" size={16} style={{ color: "var(--ink-3)" }} />
          </button>
        ))}
        {recent.length === 0 && <div style={{ padding: 50, textAlign: "center", color: "var(--ink-3)", fontFamily: "var(--sans)", fontSize: 14 }}>Chưa có bài nào.</div>}
      </div>
    </div>
  );
}
