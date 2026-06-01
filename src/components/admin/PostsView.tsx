"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon, CoverArt, primaryBtn } from "@/components/ui";
import { getPosts, getTags, deletePost } from "@/lib/repo";
import { fmtDateShort, fmtViews } from "@/lib/format";
import type { Post } from "@/lib/types";
import { PageHead, StatusBadge } from "./AdminShell";

const iconBtn: React.CSSProperties = { width: 34, height: 34, display: "grid", placeItems: "center", background: "none", border: "1px solid var(--hairline)", borderRadius: 8, color: "var(--ink-2)", cursor: "pointer" };

export default function PostsView() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const tags = getTags();

  useEffect(() => { getPosts().then(setPosts); }, []);

  const remove = async (p: Post) => {
    if (!confirm(`Xóa bài "${p.title}"?`)) return;
    await deletePost(p.id);
    setPosts((prev) => prev.filter((x) => x.id !== p.id));
  };

  const filtered = posts.filter((p) => filter === "all" || p.status === filter).sort((a, b) => b.date.localeCompare(a.date));
  const tabs: { k: typeof filter; t: string }[] = [
    { k: "all", t: "Tất cả" },
    { k: "published", t: "Đã đăng" },
    { k: "draft", t: "Nháp" },
  ];

  return (
    <div className="admin-pad" style={{ padding: "32px 40px 60px", maxWidth: 1080 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 26 }}>
        <PageHead title="Bài viết" sub={`${posts.length} bài viết`} />
        <button onClick={() => router.push("/admin4869/posts/new")} className="fr" style={{ ...primaryBtn, cursor: "pointer" }}><Icon name="plus" size={17} /> Viết bài mới</button>
      </div>
      <div style={{ display: "flex", gap: 4, marginBottom: 18, borderBottom: "1px solid var(--hairline)" }}>
        {tabs.map((t) => (
          <button key={t.k} onClick={() => setFilter(t.k)} className="fr"
            style={{ padding: "10px 14px", background: "none", border: "none", borderBottom: filter === t.k ? "2px solid var(--accent)" : "2px solid transparent", marginBottom: -1, fontFamily: "var(--sans)", fontSize: 14, fontWeight: filter === t.k ? 600 : 450, color: filter === t.k ? "var(--ink)" : "var(--ink-3)", cursor: "pointer" }}>
            {t.t} <span style={{ color: "var(--ink-3)", fontWeight: 450 }}>{t.k === "all" ? posts.length : posts.filter((p) => p.status === t.k).length}</span>
          </button>
        ))}
      </div>
      <div style={{ background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
        {filtered.map((p, i, arr) => (
          <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 18px", borderBottom: i < arr.length - 1 ? "1px solid var(--hairline-2)" : "none" }}>
            <div style={{ width: 64, flexShrink: 0 }}><CoverArt hue={p.cover.hue} ratio="4 / 3" label={null} url={p.coverImageUrl} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "var(--serif)", fontSize: 16.5, color: "var(--ink)", marginBottom: 4 }}>{p.title}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span className="meta" style={{ fontSize: 13, display: "inline-flex", alignItems: "center", gap: 5 }}><Icon name="calendar" size={12} /> {fmtDateShort(p.date)}</span>
                <span className="meta" style={{ fontSize: 13, display: "inline-flex", alignItems: "center", gap: 5 }}><Icon name="eye" size={12} /> {fmtViews(p.views)}</span>
                <span style={{ display: "flex", gap: 5 }}>{p.tags.map((t) => <span key={t} className="meta" style={{ fontSize: 12, padding: "2px 8px", background: "var(--surface-2)", borderRadius: 99 }}>{tags[t]}</span>)}</span>
              </div>
            </div>
            <StatusBadge status={p.status} />
            <div style={{ display: "flex", gap: 4 }}>
              <button onClick={() => router.push(`/admin4869/posts/${p.id}/edit`)} className="fr" title="Sửa" style={iconBtn}><Icon name="edit" size={16} /></button>
              <button onClick={() => remove(p)} className="fr" title="Xóa" style={{ ...iconBtn, color: "var(--accent)" }}><Icon name="trash" size={16} /></button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div style={{ padding: 50, textAlign: "center", color: "var(--ink-3)", fontFamily: "var(--sans)", fontSize: 14 }}>Chưa có bài nào ở mục này.</div>}
      </div>
    </div>
  );
}
