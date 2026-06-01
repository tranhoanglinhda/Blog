"use client";
import React, { useEffect, useState } from "react";
import { getPosts, getSettings } from "@/lib/repo";
import { PostCard, GridCard, Sidebar } from "./cards";
import type { Post, SiteSettings } from "@/lib/types";

export default function HomeView() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [site, setSite] = useState<SiteSettings | null>(null);

  useEffect(() => {
    getPosts().then(setPosts);
    getSettings().then(setSite);
  }, []);

  if (!site) return <Loading />;

  const published = posts.filter((p) => p.status === "published");
  const featured = published.filter((p) => p.featured);
  const rest = published.filter((p) => !p.featured).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div>
      <div style={{ borderBottom: "1px solid var(--hairline)", background: "var(--surface)" }}>
        <div style={{ maxWidth: "var(--shell-max)", margin: "0 auto", padding: "56px 28px 50px", textAlign: "center" }}>
          <div className="eyebrow" style={{ marginBottom: 16 }}>Nhật ký · Tản văn · Đời thường</div>
          <h1 style={{ margin: "0 auto 16px", fontSize: 46, lineHeight: 1.08, maxWidth: 760, letterSpacing: "-0.02em" }}>{site.title}</h1>
          <p style={{ margin: "0 auto", maxWidth: 560, fontFamily: "var(--serif)", fontSize: 19, lineHeight: 1.5, color: "var(--ink-2)", fontStyle: "italic" }}>{site.tagline}</p>
        </div>
      </div>

      <div style={{ maxWidth: "var(--shell-max)", margin: "0 auto", padding: "46px 28px 80px", display: "grid", gridTemplateColumns: "1fr 312px", gap: 56 }}>
        <main style={{ minWidth: 0 }}>
          {featured.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: featured.length > 1 ? "1fr 1fr" : "1fr", gap: 40, marginBottom: 48, paddingBottom: 48, borderBottom: "1px solid var(--hairline)" }}>
              {featured.map((p) => <PostCard key={p.id} post={p} variant="feature" />)}
            </div>
          )}
          <h3 style={{ margin: "0 0 26px", fontSize: 15, fontFamily: "var(--sans)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-3)" }}>Bài viết gần đây</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {rest.map((p) => <PostCard key={p.id} post={p} variant="row" />)}
          </div>
        </main>
        <Sidebar posts={published} site={site} />
      </div>
    </div>
  );
}

export function Loading() {
  return <div style={{ padding: 80, textAlign: "center", color: "var(--ink-3)", fontFamily: "var(--serif)", fontStyle: "italic" }}>Đang tải…</div>;
}
