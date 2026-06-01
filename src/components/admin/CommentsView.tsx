"use client";
import React, { useEffect, useState } from "react";
import { Icon } from "@/components/ui";
import { getAllComments, getPosts, moderateComment, deleteComment } from "@/lib/repo";
import { fmtDateShort } from "@/lib/format";
import type { Comment, CommentStatus, Post } from "@/lib/types";
import { PageHead } from "./AdminShell";

const ADMIN_HUES = [18, 150, 210, 280, 45, 330, 100];
function avatarHue(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h + name.charCodeAt(i)) % ADMIN_HUES.length;
  return ADMIN_HUES[h];
}

function CommentStatusBadge({ status }: { status: CommentStatus }) {
  const map: Record<CommentStatus, { bg: string; fg: string; t: string }> = {
    visible: { bg: "oklch(0.93 0.05 150)", fg: "oklch(0.42 0.1 150)", t: "Hiển thị" },
    pending: { bg: "oklch(0.94 0.06 75)", fg: "oklch(0.48 0.11 70)", t: "Chờ duyệt" },
    spam: { bg: "oklch(0.93 0.04 25)", fg: "oklch(0.5 0.13 25)", t: "Spam" },
  };
  const s = map[status] || map.pending;
  return <span style={{ padding: "3px 10px", borderRadius: 99, fontFamily: "var(--sans)", fontSize: 11.5, fontWeight: 600, background: s.bg, color: s.fg, flexShrink: 0 }}>{s.t}</span>;
}

function ModBtn({ onClick, icon, children, danger }: { onClick: () => void; icon?: string; children: React.ReactNode; danger?: boolean }) {
  return (
    <button onClick={onClick} className="fr" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 12px", background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: 8, fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, color: danger ? "var(--accent)" : "var(--ink-2)", cursor: "pointer" }}>
      {icon && <Icon name={icon} size={14} />} {children}
    </button>
  );
}

export default function CommentsView() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<"all" | CommentStatus>("all");

  useEffect(() => {
    getAllComments().then(setComments);
    getPosts().then(setPosts);
  }, []);

  const titleOf = (slug: string) => posts.find((p) => p.slug === slug)?.title || slug;
  const nameOf = (id: string | null) => comments.find((c) => c.id === id)?.name || "";

  const setStatus = async (id: string, status: CommentStatus) => {
    await moderateComment(id, status);
    setComments((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  };
  const remove = async (id: string) => {
    if (!confirm("Xóa bình luận này?")) return;
    await deleteComment(id);
    setComments((prev) => prev.filter((c) => c.id !== id && c.parentId !== id));
  };

  const counts = {
    all: comments.length,
    pending: comments.filter((c) => c.status === "pending").length,
    visible: comments.filter((c) => c.status === "visible").length,
    spam: comments.filter((c) => c.status === "spam").length,
  };
  const filtered = comments.filter((c) => filter === "all" || c.status === filter).sort((a, b) => b.date.localeCompare(a.date));
  const tabs: { k: "all" | CommentStatus; t: string }[] = [
    { k: "all", t: "Tất cả" },
    { k: "pending", t: "Chờ duyệt" },
    { k: "visible", t: "Hiển thị" },
    { k: "spam", t: "Spam" },
  ];

  return (
    <div className="admin-pad" style={{ padding: "32px 40px 60px", maxWidth: 1080 }}>
      <PageHead title="Bình luận" sub={`${counts.all} bình luận · ${counts.pending} chờ duyệt`} />
      <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: "1px solid var(--hairline)" }}>
        {tabs.map((t) => (
          <button key={t.k} onClick={() => setFilter(t.k)} className="fr"
            style={{ padding: "10px 14px", background: "none", border: "none", borderBottom: filter === t.k ? "2px solid var(--accent)" : "2px solid transparent", marginBottom: -1, fontFamily: "var(--sans)", fontSize: 14, fontWeight: filter === t.k ? 600 : 450, color: filter === t.k ? "var(--ink)" : "var(--ink-3)", cursor: "pointer" }}>
            {t.t} <span style={{ color: t.k === "pending" && counts.pending > 0 ? "var(--accent)" : "var(--ink-3)", fontWeight: 600 }}>{counts[t.k]}</span>
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {filtered.map((c) => {
          const hue = avatarHue(c.name);
          return (
            <div key={c.id} style={{ display: "flex", gap: 14, padding: 18, marginLeft: c.parentId ? 36 : 0, background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ width: 42, height: 42, flexShrink: 0, borderRadius: 99, display: "grid", placeItems: "center", color: "#fff", fontFamily: "var(--serif)", fontSize: 18, background: c.author ? "var(--accent)" : `linear-gradient(135deg, oklch(0.78 0.09 ${hue}), oklch(0.6 0.11 ${hue}))` }}>{c.name.trim().charAt(0).toUpperCase()}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 5, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "var(--sans)", fontSize: 14.5, fontWeight: 600 }}>{c.name}</span>
                  {c.author && <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--accent-ink)", background: "var(--accent-soft)", padding: "2px 7px", borderRadius: 99 }}>Tác giả</span>}
                  <CommentStatusBadge status={c.status} />
                  <span className="meta" style={{ fontSize: 12.5 }}>{fmtDateShort(c.date)}</span>
                  <span className="meta" style={{ fontSize: 12.5, display: "inline-flex", alignItems: "center", gap: 4 }}><Icon name="heart" size={12} /> {c.likes}</span>
                </div>
                <p style={{ margin: "0 0 10px", fontFamily: "var(--serif)", fontSize: 15.5, lineHeight: 1.55, color: "var(--ink)" }}>
                  {c.parentId && <span className="meta" style={{ fontSize: 12.5, marginRight: 6 }}>↳ trả lời {nameOf(c.parentId)}:</span>}
                  {c.text}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span className="meta" style={{ fontSize: 12.5, marginRight: 4 }}>{titleOf(c.postSlug)}</span>
                  {c.status !== "visible" && <ModBtn icon="check" onClick={() => setStatus(c.id, "visible")}>Duyệt</ModBtn>}
                  {c.status === "visible" && <ModBtn icon="eye" onClick={() => setStatus(c.id, "pending")}>Ẩn</ModBtn>}
                  {c.status !== "spam" && <ModBtn onClick={() => setStatus(c.id, "spam")}>Spam</ModBtn>}
                  <ModBtn icon="trash" danger onClick={() => remove(c.id)}>Xóa</ModBtn>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <div style={{ padding: 50, textAlign: "center", color: "var(--ink-3)", fontFamily: "var(--sans)", fontSize: 14, background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)" }}>Không có bình luận nào ở mục này.</div>}
      </div>
    </div>
  );
}
