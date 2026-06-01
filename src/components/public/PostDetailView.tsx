"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CoverArt, Icon } from "@/components/ui";
import { fmtDate } from "@/lib/format";
import { getPostBySlug, getPosts, getSettings, incrementViews } from "@/lib/repo";
import { getTags } from "@/lib/repo";
import { GridCard } from "./cards";
import { Loading } from "./HomeView";
import Comments from "./Comments";
import type { Post, SiteSettings } from "@/lib/types";

const TAGS = getTags();

export default function PostDetailView({ slug }: { slug: string }) {
  const [post, setPost] = useState<Post | null | undefined>(undefined);
  const [related, setRelated] = useState<Post[]>([]);
  const [site, setSite] = useState<SiteSettings | null>(null);
  const counted = useRef(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const p = await getPostBySlug(slug);
      if (!alive) return;
      setPost(p ?? null);
      if (p) {
        if (!counted.current) { counted.current = true; incrementViews(p.id); }
        const all = await getPosts();
        if (!alive) return;
        setRelated(all.filter((x) => x.status === "published" && x.id !== p.id && x.tags.some((t) => p.tags.includes(t))).slice(0, 3));
      }
    })();
    getSettings().then(setSite);
    window.scrollTo(0, 0);
    return () => { alive = false; };
  }, [slug]);

  if (post === undefined || !site) return <Loading />;
  if (post === null) return notFound();

  return (
    <article>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "44px 28px 0" }}>
        <Link href="/" className="fr" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 26, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: "var(--ink-2)" }}>
          <Icon name="arrowL" size={15} /> Tất cả bài viết
        </Link>
        <div style={{ display: "flex", gap: 10, marginBottom: 18, justifyContent: "center" }}>
          {post.tags.map((t) => <Link key={t} href={`/chu-de/${t}`} className="eyebrow fr">{TAGS[t]}</Link>)}
        </div>
        <h1 style={{ margin: "0 0 20px", fontSize: 42, lineHeight: 1.12, textAlign: "center", letterSpacing: "-0.02em" }}>{post.title}</h1>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 32, paddingBottom: 32, borderBottom: "1px solid var(--hairline)" }}>
          <div style={{ width: 38, height: 38, borderRadius: 99, background: "linear-gradient(135deg, oklch(0.8 0.08 30), oklch(0.62 0.1 20))", display: "grid", placeItems: "center", color: "#fff", fontFamily: "var(--serif)", fontSize: 16 }}>{site.author.charAt(0)}</div>
          <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: "var(--ink)" }}>{site.author}</span>
          <span className="meta">·</span><span className="meta">{fmtDate(post.date)}</span>
          <span className="meta">·</span><span className="meta">{post.readMins} phút đọc</span>
        </div>
      </div>

      <div style={{ maxWidth: 920, margin: "0 auto 36px", padding: "0 28px" }}>
        <CoverArt hue={post.cover.hue} label={post.cover.label} ratio="16 / 8" big url={post.coverImageUrl} />
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 28px" }}>
        <div className="article-body" dangerouslySetInnerHTML={{ __html: post.body }} />

        <div style={{ display: "flex", flexWrap: "wrap", gap: 9, margin: "40px 0", paddingTop: 32, borderTop: "1px solid var(--hairline)" }}>
          {post.tags.map((t) => <Link key={t} href={`/chu-de/${t}`} className="fr" style={{ padding: "6px 13px", fontFamily: "var(--sans)", fontSize: 13, color: "var(--ink-2)", background: "var(--surface-2)", border: "1px solid var(--hairline)", borderRadius: 99 }}># {TAGS[t]}</Link>)}
        </div>

        <div style={{ display: "flex", gap: 16, padding: 24, background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)", marginBottom: 56 }}>
          <div style={{ width: 56, height: 56, borderRadius: 99, background: "linear-gradient(135deg, oklch(0.8 0.08 30), oklch(0.62 0.1 20))", display: "grid", placeItems: "center", color: "#fff", fontFamily: "var(--serif)", fontSize: 24, flexShrink: 0 }}>{site.author.charAt(0)}</div>
          <div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 18, fontWeight: 600, marginBottom: 4 }}>{site.author}</div>
            <p style={{ margin: 0, fontFamily: "var(--serif)", fontSize: 15, lineHeight: 1.55, color: "var(--ink-2)" }}>{site.authorBio}</p>
          </div>
        </div>

        <Comments slug={post.slug} />
      </div>

      {related.length > 0 && (
        <div style={{ background: "var(--surface)", borderTop: "1px solid var(--hairline)", padding: "56px 28px 72px" }}>
          <div style={{ maxWidth: "var(--shell-max)", margin: "0 auto" }}>
            <h3 style={{ margin: "0 0 28px", fontSize: 15, fontFamily: "var(--sans)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-3)" }}>Có thể bạn thích</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
              {related.map((p) => <GridCard key={p.id} post={p} />)}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
