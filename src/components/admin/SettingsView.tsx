"use client";
import React, { useEffect, useRef, useState } from "react";
import { Icon, primaryBtn, secondaryBtn, btnGhost, inputStyle } from "@/components/ui";
import { getSettings, saveSettings, uploadImage } from "@/lib/repo";
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
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { getSettings().then(setSite); }, []);

  const update = (k: keyof SiteSettings, v: string) => setSite((s) => (s ? { ...s, [k]: v } : s));

  const onAvatarPicked = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      update("avatarUrl", url);
    } catch {
      alert("Tải ảnh thất bại. Vui lòng thử lại.");
    } finally {
      setUploading(false);
    }
  };

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
        <Field label="Ảnh đại diện (avatar)">
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 72, height: 72, borderRadius: 99, flexShrink: 0, overflow: "hidden", background: site.avatarUrl ? `center / cover no-repeat url(${site.avatarUrl})` : "linear-gradient(135deg, oklch(0.8 0.08 30), oklch(0.62 0.1 20))", display: "grid", placeItems: "center", color: "#fff", fontFamily: "var(--serif)", fontSize: 30 }}>
              {!site.avatarUrl && site.author.charAt(0)}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button onClick={() => fileRef.current?.click()} disabled={uploading} className="fr" style={{ ...secondaryBtn, cursor: "pointer", opacity: uploading ? 0.6 : 1 }}><Icon name="image" size={15} /> {uploading ? "Đang tải…" : "Tải ảnh lên"}</button>
              {site.avatarUrl && <button onClick={() => update("avatarUrl", "")} className="fr" style={{ ...btnGhost, cursor: "pointer", color: "var(--ink-3)" }}>Gỡ ảnh</button>}
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={onAvatarPicked} />
            </div>
          </div>
        </Field>
        <Field label="Tên blog"><input value={site.title} onChange={(e) => update("title", e.target.value)} style={inputStyle} className="fr" /></Field>
        <Field label="Tagline"><input value={site.tagline} onChange={(e) => update("tagline", e.target.value)} style={inputStyle} className="fr" /></Field>
        <Field label="Tên tác giả"><input value={site.author} onChange={(e) => update("author", e.target.value)} style={inputStyle} className="fr" /></Field>
        <Field label="Giới thiệu ngắn (hiện ở sidebar)"><textarea value={site.authorBio} onChange={(e) => update("authorBio", e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }} className="fr" /></Field>
        <Field label="Giới thiệu trang “Về tôi” (mỗi đoạn cách nhau một dòng trống)"><textarea value={site.about ?? ""} onChange={(e) => update("about", e.target.value)} rows={6} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }} className="fr" /></Field>
        <Field label="Email liên hệ"><input value={site.email} onChange={(e) => update("email", e.target.value)} style={inputStyle} className="fr" /></Field>
        <Field label="Dòng chân trang"><input value={site.footer} onChange={(e) => update("footer", e.target.value)} style={inputStyle} className="fr" /></Field>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 6 }}>
          <button onClick={save} disabled={busy} className="fr" style={{ ...primaryBtn, cursor: "pointer", opacity: busy ? 0.6 : 1 }}><Icon name="save" size={16} /> Lưu thay đổi</button>
          {saved && <span className="meta" style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "oklch(0.5 0.1 150)" }}><Icon name="check" size={15} /> Đã lưu</span>}
        </div>
      </div>
    </div>
  );
}
