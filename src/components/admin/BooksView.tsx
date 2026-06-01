"use client";
import React, { useEffect, useRef, useState } from "react";
import { Icon, primaryBtn, secondaryBtn, btnGhost, inputStyle } from "@/components/ui";
import { getBooks, saveBook, deleteBook, uploadImage } from "@/lib/repo";
import type { Book } from "@/lib/types";
import { PageHead } from "./AdminShell";

const iconBtn: React.CSSProperties = { width: 34, height: 34, display: "grid", placeItems: "center", background: "none", border: "1px solid var(--hairline)", borderRadius: 8, color: "var(--ink-2)", cursor: "pointer" };

const EMPTY: Book = { id: "", title: "", productUrl: "", coverImageUrl: "", note: "" };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "block", marginBottom: 16 }}>
      <span style={{ display: "block", fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, color: "var(--ink-2)", marginBottom: 7 }}>{label}</span>
      {children}
    </label>
  );
}

export default function BooksView() {
  const [books, setBooks] = useState<Book[]>([]);
  const [editing, setEditing] = useState<Book | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { getBooks().then(setBooks); }, []);

  const remove = async (b: Book) => {
    if (!confirm(`Xóa sách "${b.title}"?`)) return;
    await deleteBook(b.id);
    setBooks((prev) => prev.filter((x) => x.id !== b.id));
  };

  const onFilePicked = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !editing) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setEditing({ ...editing, coverImageUrl: url });
    } catch {
      alert("Tải ảnh thất bại. Vui lòng thử lại.");
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    if (!editing) return;
    if (!editing.title.trim()) { alert("Vui lòng nhập tên sách."); return; }
    if (!editing.productUrl.trim()) { alert("Vui lòng nhập link sản phẩm."); return; }
    setBusy(true);
    try {
      const saved = await saveBook({ ...editing, title: editing.title.trim(), productUrl: editing.productUrl.trim() });
      setBooks((prev) => (prev.some((b) => b.id === saved.id) ? prev.map((b) => (b.id === saved.id ? saved : b)) : [...prev, saved]));
      setEditing(null);
    } catch {
      alert("Lưu thất bại. Vui lòng thử lại.");
    } finally {
      setBusy(false);
    }
  };

  const up = (k: keyof Book, v: string) => setEditing((e) => (e ? { ...e, [k]: v } : e));

  return (
    <div className="admin-pad" style={{ padding: "32px 40px 60px", maxWidth: 1080 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 26 }}>
        <PageHead title="Sách mình đọc" sub={`${books.length} cuốn · hiển thị ở trang “Sách mình đọc”`} />
        <button onClick={() => setEditing({ ...EMPTY })} className="fr" style={{ ...primaryBtn, cursor: "pointer" }}><Icon name="plus" size={17} /> Thêm sách</button>
      </div>

      <div style={{ background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
        {books.map((b, i, arr) => (
          <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 18px", borderBottom: i < arr.length - 1 ? "1px solid var(--hairline-2)" : "none" }}>
            <div style={{ width: 46, height: 64, flexShrink: 0, borderRadius: 6, overflow: "hidden", background: b.coverImageUrl ? `center / cover no-repeat url(${b.coverImageUrl})` : "var(--surface-2)", display: "grid", placeItems: "center", color: "var(--ink-3)" }}>
              {!b.coverImageUrl && <Icon name="book" size={18} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "var(--serif)", fontSize: 16.5, color: "var(--ink)", marginBottom: 3 }}>{b.title}</div>
              <div className="meta" style={{ fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 560 }}>{b.note || "—"}</div>
            </div>
            <a href={b.productUrl} target="_blank" rel="nofollow sponsored noopener noreferrer" className="fr" title="Mở link sản phẩm" style={{ ...iconBtn }}><Icon name="external" size={16} /></a>
            <button onClick={() => setEditing({ ...b })} className="fr" title="Sửa" style={iconBtn}><Icon name="edit" size={16} /></button>
            <button onClick={() => remove(b)} className="fr" title="Xóa" style={{ ...iconBtn, color: "var(--accent)" }}><Icon name="trash" size={16} /></button>
          </div>
        ))}
        {books.length === 0 && <div style={{ padding: 50, textAlign: "center", color: "var(--ink-3)", fontFamily: "var(--sans)", fontSize: 14 }}>Chưa có cuốn sách nào. Bấm “Thêm sách” để bắt đầu.</div>}
      </div>

      {editing && (
        <div onClick={() => !busy && setEditing(null)} style={{ position: "fixed", inset: 0, zIndex: 90, background: "rgba(38,33,27,0.32)", backdropFilter: "blur(3px)", display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "60px 20px", overflowY: "auto" }}>
          <div onClick={(e) => e.stopPropagation()} className="fade-up thin-scroll" style={{ width: "min(560px, 96vw)", background: "var(--surface)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-lg)", padding: 28 }}>
            <h2 style={{ margin: "0 0 20px", fontSize: 22 }}>{editing.id ? "Sửa sách" : "Thêm sách"}</h2>

            <div style={{ display: "flex", gap: 18, marginBottom: 4 }}>
              <div style={{ width: 110, flexShrink: 0 }}>
                <div style={{ aspectRatio: "3 / 4", borderRadius: 8, overflow: "hidden", background: editing.coverImageUrl ? `center / cover no-repeat url(${editing.coverImageUrl})` : "var(--surface-2)", display: "grid", placeItems: "center", color: "var(--ink-3)", marginBottom: 8 }}>
                  {!editing.coverImageUrl && <Icon name="book" size={26} />}
                </div>
                <button onClick={() => fileRef.current?.click()} disabled={uploading} className="fr" style={{ ...secondaryBtn, width: "100%", justifyContent: "center", padding: "8px 10px", fontSize: 12.5, cursor: "pointer", opacity: uploading ? 0.6 : 1 }}><Icon name="image" size={14} /> {uploading ? "Đang tải…" : "Tải ảnh bìa"}</button>
                {editing.coverImageUrl && <button onClick={() => up("coverImageUrl", "")} className="fr" style={{ ...btnGhost, fontSize: 12.5, marginTop: 6, color: "var(--ink-3)", cursor: "pointer" }}>Gỡ ảnh</button>}
                <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={onFilePicked} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Field label="Tên sách"><input value={editing.title} onChange={(e) => up("title", e.target.value)} style={inputStyle} className="fr" /></Field>
                <Field label="Link ảnh bìa (hoặc dùng nút tải lên)"><input value={editing.coverImageUrl} onChange={(e) => up("coverImageUrl", e.target.value)} placeholder="https://…" style={inputStyle} className="fr" /></Field>
              </div>
            </div>

            <Field label="Link sản phẩm (Shopee affiliate…)"><input value={editing.productUrl} onChange={(e) => up("productUrl", e.target.value)} placeholder="https://shopee.vn/…" style={inputStyle} className="fr" /></Field>
            <Field label="Đôi lời giới thiệu"><textarea value={editing.note} onChange={(e) => up("note", e.target.value)} rows={4} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }} className="fr" /></Field>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
              <button onClick={() => setEditing(null)} disabled={busy} className="fr" style={{ ...secondaryBtn, cursor: "pointer" }}>Hủy</button>
              <button onClick={save} disabled={busy} className="fr" style={{ ...primaryBtn, cursor: "pointer", opacity: busy ? 0.6 : 1 }}><Icon name="save" size={16} /> Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
