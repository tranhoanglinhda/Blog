"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon, Logo, primaryBtn } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import { getAllComments } from "@/lib/repo";

type View = "dashboard" | "posts" | "books" | "comments" | "settings";

const sideBtn: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 11, width: "100%", padding: "10px 12px",
  background: "none", border: "none", borderRadius: 9, fontFamily: "var(--sans)",
  fontSize: 14, color: "var(--ink-2)", textAlign: "left", cursor: "pointer",
};

export default function AdminShell({
  active,
  children,
}: {
  active: View | "editor";
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { ready, user, signOut } = useAuth();
  const [pending, setPending] = useState(0);

  useEffect(() => {
    if (ready && !user) router.replace("/admin4869/login");
  }, [ready, user, router]);

  useEffect(() => {
    getAllComments().then((cs) => setPending(cs.filter((c) => c.status === "pending").length));
  }, []);

  if (!ready || !user) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "var(--paper)", color: "var(--ink-3)", fontFamily: "var(--sans)" }}>
        Đang tải…
      </div>
    );
  }

  const nav: { k: View; label: string; icon: string; href: string; badge?: number }[] = [
    { k: "dashboard", label: "Tổng quan", icon: "layout", href: "/admin4869" },
    { k: "posts", label: "Bài viết", icon: "list", href: "/admin4869/posts" },
    { k: "books", label: "Sách mình đọc", icon: "book", href: "/admin4869/books" },
    { k: "comments", label: "Bình luận", icon: "quote", href: "/admin4869/comments", badge: pending },
    { k: "settings", label: "Cài đặt", icon: "settings", href: "/admin4869/settings" },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "248px 1fr", background: "var(--paper)" }}>
      <aside style={{ borderRight: "1px solid var(--hairline)", background: "var(--surface)", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh" }}>
        <div style={{ padding: "22px 20px", borderBottom: "1px solid var(--hairline)", display: "flex", alignItems: "center", gap: 10 }}>
          <Logo size={28} />
          <div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 15.5, fontWeight: 600, lineHeight: 1.1 }}>Blog Của Bông</div>
            <div className="meta" style={{ fontSize: 11.5 }}>Bảng điều khiển</div>
          </div>
        </div>
        <button onClick={() => router.push("/admin4869/posts/new")} className="fr" style={{ ...primaryBtn, margin: "18px 16px 8px", justifyContent: "center", cursor: "pointer" }}>
          <Icon name="plus" size={17} /> Viết bài mới
        </button>
        <nav style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 3 }}>
          {nav.map((n) => {
            const isActive = active === n.k || (n.k === "posts" && active === "editor");
            return (
              <button key={n.k} onClick={() => router.push(n.href)} className="fr"
                style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 12px", background: isActive ? "var(--accent-soft)" : "none", border: "none", borderRadius: 9, fontFamily: "var(--sans)", fontSize: 14.5, fontWeight: isActive ? 600 : 450, color: isActive ? "var(--accent-ink)" : "var(--ink-2)", textAlign: "left", cursor: "pointer" }}>
                <Icon name={n.icon} size={18} /> <span style={{ flex: 1 }}>{n.label}</span>
                {n.badge != null && n.badge > 0 && (
                  <span style={{ minWidth: 20, height: 20, padding: "0 6px", display: "grid", placeItems: "center", borderRadius: 99, background: "var(--accent)", color: "#fff", fontSize: 11.5, fontWeight: 700 }}>{n.badge}</span>
                )}
              </button>
            );
          })}
        </nav>
        <div style={{ marginTop: "auto", padding: 12, borderTop: "1px solid var(--hairline)" }}>
          <button onClick={() => router.push("/")} className="fr" style={sideBtn}>
            <Icon name="external" size={17} /> Xem trang blog
          </button>
          <button onClick={async () => { await signOut(); router.replace("/admin4869/login"); }} className="fr" style={{ ...sideBtn, color: "var(--ink-3)" }}>
            <Icon name="logout" size={17} /> Đăng xuất
          </button>
        </div>
      </aside>
      <div className="thin-scroll" style={{ overflowY: "auto", maxHeight: "100vh" }}>{children}</div>
    </div>
  );
}

// ---------- shared admin bits ----------
export function PageHead({ title, sub }: { title: string; sub?: string }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h1 style={{ margin: "0 0 6px", fontSize: 30 }}>{title}</h1>
      {sub && <p className="meta" style={{ fontSize: 15, margin: 0 }}>{sub}</p>}
    </div>
  );
}

export function StatusBadge({ status }: { status: "published" | "draft" }) {
  const map = {
    published: { bg: "oklch(0.93 0.05 150)", fg: "oklch(0.42 0.1 150)", t: "Đã đăng" },
    draft: { bg: "var(--surface-2)", fg: "var(--ink-3)", t: "Nháp" },
  };
  const s = map[status] || map.draft;
  return <span style={{ padding: "4px 11px", borderRadius: 99, fontFamily: "var(--sans)", fontSize: 12, fontWeight: 600, background: s.bg, color: s.fg, flexShrink: 0 }}>{s.t}</span>;
}
