"use client";
import React, { useEffect, useState } from "react";
import { Icon } from "@/components/ui";
import { getSettings } from "@/lib/repo";
import { Loading } from "./HomeView";
import type { SiteSettings } from "@/lib/types";

export default function AboutView() {
  const [site, setSite] = useState<SiteSettings | null>(null);
  useEffect(() => { getSettings().then(setSite); }, []);
  if (!site) return <Loading />;
  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "64px 28px 90px" }}>
      <div style={{ width: 88, height: 88, borderRadius: 99, overflow: "hidden", background: site.avatarUrl ? `center / cover no-repeat url(${site.avatarUrl})` : "linear-gradient(135deg, oklch(0.8 0.08 30), oklch(0.62 0.1 20))", display: "grid", placeItems: "center", color: "#fff", fontFamily: "var(--serif)", fontSize: 38, marginBottom: 28 }}>{!site.avatarUrl && site.author.charAt(0)}</div>
      <div className="eyebrow" style={{ marginBottom: 12 }}>Về tôi</div>
      <h1 style={{ margin: "0 0 24px", fontSize: 40, lineHeight: 1.1 }}>Chào, mình là {site.author}</h1>
      <p style={{ fontFamily: "var(--serif)", fontSize: 20, lineHeight: 1.7, color: "var(--ink)" }}>{site.authorBio}</p>
      {(site.about ?? "").split(/\n\s*\n/).filter((s) => s.trim()).map((para, i) => (
        <p key={i} style={{ fontFamily: "var(--serif)", fontSize: 20, lineHeight: 1.7, color: "var(--ink)" }}>{para}</p>
      ))}
      <a href={"mailto:" + site.email} className="fr" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 16, padding: "12px 20px", background: "var(--accent)", color: "#fff", borderRadius: 99, fontFamily: "var(--sans)", fontSize: 14.5, fontWeight: 600 }}>
        <Icon name="mail" size={16} /> {site.email}
      </a>
    </div>
  );
}
