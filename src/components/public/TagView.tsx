"use client";
import React, { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { getPosts, getSettings, getTags } from "@/lib/repo";
import { PostCard, Sidebar } from "./cards";
import { Loading } from "./HomeView";
import type { Post, SiteSettings } from "@/lib/types";

const TAGS = getTags();

export default function TagView({ slug }: { slug: string }) {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [site, setSite] = useState<SiteSettings | null>(null);

  useEffect(() => {
    getPosts().then(setPosts);
    getSettings().then(setSite);
  }, []);

  if (!TAGS[slug]) return notFound();
  if (!posts || !site) return <Loading />;

  const published = posts.filter((p) => p.status === "published");
  const list = published.filter((p) => p.tags.includes(slug)).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div style={{ maxWidth: "var(--shell-max)", margin: "0 auto", padding: "52px 28px 80px", display: "grid", gridTemplateColumns: "1fr 312px", gap: 56 }}>
      <main style={{ minWidth: 0 }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>Chủ đề</div>
        <h1 style={{ margin: "0 0 8px", fontSize: 40 }}>{TAGS[slug]}</h1>
        <p className="meta" style={{ marginBottom: 40, fontSize: 15 }}>{list.length} bài viết</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {list.map((p) => <PostCard key={p.id} post={p} variant="row" />)}
          {list.length === 0 && <div style={{ color: "var(--ink-3)", fontFamily: "var(--serif)", fontStyle: "italic" }}>Chưa có bài viết nào ở chủ đề này.</div>}
        </div>
      </main>
      <Sidebar posts={published} site={site} />
    </div>
  );
}
