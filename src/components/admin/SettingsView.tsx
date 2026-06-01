"use client";
import React, { useEffect, useState } from "react";
import { Icon, primaryBtn, inputStyle } from "@/components/ui";
import { getSettings, saveSettings } from "@/lib/repo";
import type { SiteSettings } from "@/lib/types";
import { PageHead } from "./AdminShell";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "block", marginBottom: 18 }}>
      <span style={{ display: "block", fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, color: "var(--ink-2)", marginBottom: 7 }}>{label}</span>
      {children}
    </label>
  );
}

export default function SettingsView() {
  const [site, setSite] = useState<SiteSettings | null>(null);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => { getSettings().then(setSite); }, []);

  const update = (k: keyof SiteSettings, v: string) => setSite((s) => (s ? { ...s, [k]: v } : s));

  const save = async () => {
    if (!site) return;
    setBusy(true);
    try {
      await saveSettings(site);
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    } catch {
      alert("Lưu thất bại. Vui lòng thử lại.");
    } finally {
      setBusy(false);
    }
  };

  if (!site) return <div style={{ padding: 60, color: "var(--ink-3)", fontFamily: "var(--sans)" }}>Đang tải…</div>;

  return (
    <div style={{ padding: "32px 40px 60px", maxWidth: 680 }}>
      <PageHead title="Cài đặt" sub="Thông tin chung của blog." />
      <div style={{ background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)", padding: 28 }}>
        <Field label="Tên blog"><input value={site.title} onChange={(e) => update("title", e.target.value)} style={inputStyle} className="fr" /></Field>
        <Field label="Tagline"><input value={site.tagline} onChange={(e) => update("tagline", e.target.value)} style={inputStyle} className="fr" /></Field>
        <Field label="Tên tác giả"><input value={site.author} onChange={(e) => update("author", e.target.value)} style={inputStyle} className="fr" /></Field>
        <Field label="Giới thiệu tác giả"><textarea value={site.authorBio} onChange={(e) => update("authorBio", e.target.value)} rows={4} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }} className="fr" /></Field>
        <Field label="Email liên hệ"><input value={site.email} onChange={(e) => update("email", e.target.value)} style={inputStyle} className="fr" /></Field>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 6 }}>
          <button onClick={save} disabled={busy} className="fr" style={{ ...primaryBtn, cursor: "pointer", opacity: busy ? 0.6 : 1 }}><Icon name="save" size={16} /> Lưu thay đổi</button>
          {saved && <span className="meta" style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "oklch(0.5 0.1 150)" }}><Icon name="check" size={15} /> Đã lưu</span>}
        </div>
      </div>
    </div>
  );
}
