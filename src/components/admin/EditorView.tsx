"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon, CoverArt, btnGhost, primaryBtn, secondaryBtn, inputStyle } from "@/components/ui";
import { getPostById, getTags, savePost, uploadImage } from "@/lib/repo";
import { slugify, todayISO, readMinsFromHtml } from "@/lib/format";
import type { Post, PostStatus } from "@/lib/types";
import { StatusBadge } from "./AdminShell";

function RailSec({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 style={{ margin: "0 0 11px", fontFamily: "var(--sans)", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-3)" }}>{title}</h4>
      {children}
    </div>
  );
}

export default function EditorView({ id }: { id?: string }) {
  const router = useRouter();
  const tags = getTags();
  const isNew = !id;

  const [loaded, setLoaded] = useState(isNew);
  const [existing, setExisting] = useState<Post | null>(null);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [selTags, setSelTags] = useState<string[]>([]);
  const [hue, setHue] = useState(24);
  const [coverLabel, setCoverLabel] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState<string | undefined>(undefined);
  const [featured, setFeatured] = useState(false);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const uploadTarget = useRef<"cover" | "body">("cover");

  // load existing post
  useEffect(() => {
    if (isNew) return;
    getPostById(id!).then((p) => {
      if (p) {
        setExisting(p);
        setTitle(p.title);
        setExcerpt(p.excerpt);
        setSlug(p.slug);
        setSlugTouched(true);
        setSelTags(p.tags);
        setHue(p.cover.hue);
        setCoverLabel(p.cover.label);
        setCoverImageUrl(p.coverImageUrl);
        setFeatured(p.featured);
      }
      setLoaded(true);
    });
  }, [id, isNew]);

  // seed editor html once loaded
  useEffect(() => {
    if (!loaded || !bodyRef.current) return;
    bodyRef.current.innerHTML = existing?.body || "<p>Bắt đầu viết câu chuyện của bạn…</p>";
  }, [loaded, existing]);

  // auto-slug from title (until user edits slug)
  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title));
  }, [title, slugTouched]);

  const pickImage = (target: "cover" | "body") => { uploadTarget.current = target; fileRef.current?.click(); };

  const onFilePicked = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // cho phép chọn lại cùng một file
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      if (uploadTarget.current === "cover") {
        setCoverImageUrl(url);
        if (!coverLabel.trim()) setCoverLabel("Ảnh bìa");
      } else {
        bodyRef.current?.focus();
        document.execCommand("insertImage", false, url);
      }
    } catch {
      alert("Tải ảnh thất bại. Vui lòng thử lại.");
    } finally {
      setUploading(false);
    }
  };

  const exec = (cmd: string, val?: string) => { document.execCommand(cmd, false, val); bodyRef.current?.focus(); };
  const fmtBlock = (tag: string) => { document.execCommand("formatBlock", false, tag); bodyRef.current?.focus(); };

  const toolbar: ({ sep: true } | { icon: string; t: string; fn: () => void })[] = [
    { icon: "bold", t: "Đậm", fn: () => exec("bold") },
    { icon: "italic", t: "Nghiêng", fn: () => exec("italic") },
    { sep: true },
    { icon: "h2", t: "Tiêu đề", fn: () => fmtBlock("h2") },
    { icon: "quote", t: "Trích dẫn", fn: () => fmtBlock("blockquote") },
    { icon: "ul", t: "Danh sách", fn: () => exec("insertUnorderedList") },
    { icon: "link", t: "Liên kết", fn: () => { const u = prompt("Dán đường dẫn:"); if (u) exec("createLink", u); } },
    { sep: true },
    { icon: "image", t: "Chèn ảnh", fn: () => pickImage("body") },
  ];

  const doSave = async (status: PostStatus) => {
    const body = bodyRef.current?.innerHTML || "";
    const finalSlug = (slug || slugify(title)).trim();
    if (!title.trim()) { alert("Vui lòng nhập tiêu đề."); return; }
    if (!finalSlug) { alert("Vui lòng nhập đường dẫn (slug)."); return; }
    setBusy(true);
    const post: Post = {
      id: existing?.id || "",
      slug: finalSlug,
      title: title.trim(),
      excerpt: excerpt.trim(),
      body,
      cover: { hue, label: coverLabel.trim() },
      coverImageUrl,
      date: existing?.date || todayISO(),
      readMins: readMinsFromHtml(body),
      views: existing?.views ?? 0,
      tags: selTags,
      featured,
      status,
    };
    try {
      await savePost(post);
      setSaved(true);
      setTimeout(() => router.push("/admin4869/posts"), 700);
    } catch {
      alert("Lưu thất bại. Vui lòng thử lại.");
      setBusy(false);
    }
  };

  if (!loaded) {
    return <div style={{ padding: 60, color: "var(--ink-3)", fontFamily: "var(--sans)" }}>Đang tải…</div>;
  }

  return (
    <div>
      <div style={{ position: "sticky", top: 0, zIndex: 20, background: "var(--paper)", borderBottom: "1px solid var(--hairline)", padding: "14px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => router.push("/admin4869/posts")} className="fr" style={{ ...btnGhost, color: "var(--ink-2)", cursor: "pointer" }}><Icon name="arrowL" size={15} /> {isNew ? "Hủy" : "Quay lại"}</button>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {saved && <span className="meta" style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "oklch(0.5 0.1 150)" }}><Icon name="check" size={15} /> Đã lưu</span>}
          <button onClick={() => doSave("draft")} disabled={busy} className="fr" style={{ ...secondaryBtn, cursor: "pointer", opacity: busy ? 0.6 : 1 }}><Icon name="save" size={16} /> Lưu nháp</button>
          <button onClick={() => doSave("published")} disabled={busy} className="fr" style={{ ...primaryBtn, cursor: "pointer", opacity: busy ? 0.6 : 1 }}><Icon name="send" size={15} /> Xuất bản</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 304px", gap: 0, alignItems: "start" }}>
        <div style={{ padding: "36px 0 80px", maxWidth: 720, margin: "0 auto", width: "100%" }}>
          <div style={{ padding: "0 40px" }}>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tiêu đề bài viết"
              style={{ width: "100%", border: "none", outline: "none", background: "none", fontFamily: "var(--serif)", fontSize: 38, fontWeight: 600, color: "var(--ink)", lineHeight: 1.15, marginBottom: 18, letterSpacing: "-0.02em" }} className="fr" />
            <div style={{ marginBottom: 22 }}>
              <CoverArt hue={hue} label={coverLabel || "Ảnh bìa"} ratio="16 / 7" big url={coverImageUrl} />
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
                <button onClick={() => pickImage("cover")} disabled={uploading} className="fr" style={{ ...secondaryBtn, padding: "8px 14px", fontSize: 13, cursor: "pointer", opacity: uploading ? 0.6 : 1 }}><Icon name="image" size={15} /> {uploading ? "Đang tải…" : "Tải ảnh bìa"}</button>
                {coverImageUrl && <button onClick={() => setCoverImageUrl(undefined)} className="fr" style={{ ...btnGhost, padding: "8px 12px", fontSize: 13, cursor: "pointer", color: "var(--ink-3)" }}>Gỡ ảnh</button>}
                <input value={coverLabel} onChange={(e) => setCoverLabel(e.target.value)} placeholder="Chú thích ảnh…" style={{ ...inputStyle, padding: "8px 12px", fontSize: 13, flex: 1 }} className="fr" />
              </div>
            </div>
          </div>

          <div style={{ position: "sticky", top: 65, zIndex: 10, padding: "8px 40px", margin: "0 0 14px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 2, padding: 5, background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: 11, boxShadow: "var(--shadow-md)" }}>
              {toolbar.map((b, i) => "sep" in b
                ? <span key={i} style={{ width: 1, height: 22, background: "var(--hairline)", margin: "0 4px" }} />
                : <button key={i} onClick={b.fn} title={b.t} className="fr" style={{ width: 36, height: 36, display: "grid", placeItems: "center", background: "none", border: "none", borderRadius: 8, color: "var(--ink-2)", cursor: "pointer" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-2)")} onMouseLeave={(e) => (e.currentTarget.style.background = "none")}><Icon name={b.icon} size={18} /></button>
              )}
            </div>
          </div>

          <div ref={bodyRef} contentEditable suppressContentEditableWarning className="editor-body thin-scroll"
            style={{ padding: "0 40px", minHeight: 320, outline: "none", fontFamily: "var(--serif)", fontSize: 19, lineHeight: 1.72, color: "var(--ink)" }} />
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={onFilePicked} />
        </div>

        <div style={{ borderLeft: "1px solid var(--hairline)", minHeight: "calc(100vh - 65px)", background: "var(--surface)", padding: "28px 24px", position: "sticky", top: 65, display: "flex", flexDirection: "column", gap: 26 }}>
          <RailSec title="Trạng thái">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <StatusBadge status={existing?.status || "draft"} />
              <span className="meta" style={{ fontSize: 13 }}>{isNew ? "Bài mới" : "Đang chỉnh sửa"}</span>
            </div>
          </RailSec>
          <RailSec title="Đường dẫn (slug)">
            <input value={slug} onChange={(e) => { setSlugTouched(true); setSlug(e.target.value); }} placeholder="duong-dan-bai-viet" style={{ ...inputStyle, padding: "9px 12px", fontSize: 13 }} className="fr" />
            <p className="meta" style={{ fontSize: 12, margin: "7px 0 0" }}>sotaycuamay.com/bai-viet/{slug || "…"}</p>
          </RailSec>
          <RailSec title="Mô tả ngắn">
            <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} placeholder="Tóm tắt hiển thị ở trang chủ…" style={{ ...inputStyle, padding: "9px 12px", fontSize: 13, resize: "vertical", lineHeight: 1.5 }} className="fr" />
          </RailSec>
          <RailSec title="Chủ đề">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {Object.entries(tags).map(([s, label]) => {
                const on = selTags.includes(s);
                return (
                  <button key={s} onClick={() => setSelTags(on ? selTags.filter((t) => t !== s) : [...selTags, s])} className="fr"
                    style={{ padding: "6px 12px", fontFamily: "var(--sans)", fontSize: 12.5, borderRadius: 99, cursor: "pointer", background: on ? "var(--accent)" : "var(--surface-2)", color: on ? "#fff" : "var(--ink-2)", border: "1px solid " + (on ? "var(--accent)" : "var(--hairline)") }}>
                    {on && "✓ "}{label}
                  </button>
                );
              })}
            </div>
          </RailSec>
          <RailSec title="Hiển thị">
            <label style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer", fontFamily: "var(--sans)", fontSize: 14, color: "var(--ink-2)" }}>
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} style={{ accentColor: "var(--accent)", width: 16, height: 16 }} />
              Bài nổi bật (hiện trang chủ)
            </label>
          </RailSec>
          <RailSec title="Tông màu ảnh bìa">
            <input type="range" min={0} max={340} value={hue} onChange={(e) => setHue(+e.target.value)} style={{ width: "100%", accentColor: "var(--accent)" }} />
            <div style={{ height: 8, borderRadius: 99, marginTop: 8, background: "linear-gradient(90deg, oklch(0.7 0.12 0), oklch(0.7 0.12 60), oklch(0.7 0.12 150), oklch(0.7 0.12 240), oklch(0.7 0.12 320))" }} />
          </RailSec>
        </div>
      </div>
    </div>
  );
}
