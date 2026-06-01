"use client";
import React, { useEffect, useState } from "react";
import { Icon, avatarColor } from "@/components/ui";
import { fmtDate, todayISO } from "@/lib/format";
import { getCommentsBySlug, addComment, setCommentLikes } from "@/lib/repo";
import type { Comment } from "@/lib/types";

const LIKED_KEY = "blog_liked_comments";
function loadLiked(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try { return new Set(JSON.parse(localStorage.getItem(LIKED_KEY) || "[]")); } catch { return new Set(); }
}
function saveLiked(s: Set<string>) { localStorage.setItem(LIKED_KEY, JSON.stringify([...s])); }

export default function Comments({ slug }: { slug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [touched, setTouched] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    getCommentsBySlug(slug).then(setComments);
    setLiked(loadLiked());
  }, [slug]);

  const visible = comments.filter((c) => c.status === "visible");
  const roots = visible.filter((c) => !c.parentId).sort((a, b) => b.date.localeCompare(a.date));
  const repliesOf = (id: string) => visible.filter((c) => c.parentId === id);
  const total = visible.length;

  const toggleLike = async (c: Comment) => {
    const isLiked = liked.has(c.id);
    const next = new Set(liked);
    if (isLiked) next.delete(c.id); else next.add(c.id);
    setLiked(next); saveLiked(next);
    const likes = c.likes + (isLiked ? -1 : 1);
    setComments((prev) => prev.map((x) => (x.id === c.id ? { ...x, likes } : x)));
    await setCommentLikes(c.id, likes);
  };

  const submit = async () => {
    if (!name.trim() || !text.trim()) { setTouched(true); return; }
    await addComment({ postSlug: slug, parentId: null, name: name.trim(), text: text.trim(), date: todayISO(), likes: 0, status: "pending" });
    setName(""); setText(""); setTouched(false); setSent(true);
  };

  const addReply = async (parentId: string, rname: string, rtext: string) => {
    await addComment({ postSlug: slug, parentId, name: rname.trim(), text: rtext.trim(), date: todayISO(), likes: 0, status: "pending" });
  };

  return (
    <section style={{ marginBottom: 64 }}>
      <h3 style={{ margin: "0 0 6px", fontSize: 24 }}>Bình luận {total > 0 && <span style={{ color: "var(--ink-3)" }}>({total})</span>}</h3>
      <p className="meta" style={{ fontSize: 14, margin: "0 0 24px" }}>Để lại đôi dòng — bạn không cần đăng nhập.</p>

      <div style={{ background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)", padding: 20, marginBottom: 36, boxShadow: "var(--shadow-sm)" }}>
        {sent ? (
          <div style={{ textAlign: "center", padding: "10px 0", fontFamily: "var(--serif)", fontSize: 16, color: "var(--ink-2)" }}>
            Cảm ơn bạn! Bình luận đang chờ duyệt và sẽ hiển thị sau khi tác giả xem qua.
            <div style={{ marginTop: 12 }}>
              <button onClick={() => setSent(false)} className="fr" style={{ background: "none", border: "none", fontFamily: "var(--sans)", fontSize: 13.5, fontWeight: 600, color: "var(--accent-ink)" }}>Viết bình luận khác</button>
            </div>
          </div>
        ) : (
          <>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên của bạn"
              className="fr" style={{ width: "100%", padding: "11px 14px", fontFamily: "var(--sans)", fontSize: 15, color: "var(--ink)", background: "var(--paper)", border: "1px solid " + (touched && !name.trim() ? "var(--accent)" : "var(--hairline)"), borderRadius: 9, outline: "none", marginBottom: 10 }} />
            <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} placeholder="Viết bình luận…"
              className="fr" style={{ width: "100%", padding: "11px 14px", fontFamily: "var(--sans)", fontSize: 15, lineHeight: 1.55, color: "var(--ink)", background: "var(--paper)", border: "1px solid " + (touched && !text.trim() ? "var(--accent)" : "var(--hairline)"), borderRadius: 9, outline: "none", resize: "vertical" }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
              <span className="meta" style={{ fontSize: 12.5 }}>{touched && (!name.trim() || !text.trim()) ? "Vui lòng nhập tên và nội dung." : "Hãy lịch sự và tử tế nhé."}</span>
              <button onClick={submit} className="fr" style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 18px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: 9, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600 }}>
                <Icon name="send" size={15} /> Gửi bình luận
              </button>
            </div>
          </>
        )}
      </div>

      {roots.length === 0 ? (
        <div style={{ textAlign: "center", padding: "28px 0", color: "var(--ink-3)", fontFamily: "var(--serif)", fontSize: 17, fontStyle: "italic" }}>Chưa có bình luận nào. Hãy là người đầu tiên.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          {roots.map((c) => (
            <CommentItem key={c.id} comment={c} replies={repliesOf(c.id)} liked={liked} onToggleLike={toggleLike} onReply={addReply} />
          ))}
        </div>
      )}
    </section>
  );
}

function LikeBtn({ liked, count, onClick, small }: { liked: boolean; count: number; onClick: () => void; small?: boolean }) {
  return (
    <button onClick={onClick} className="fr" style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "none", border: "none", padding: "4px 6px", borderRadius: 8, fontFamily: "var(--sans)", fontSize: small ? 12.5 : 13, fontWeight: 600, color: liked ? "var(--accent)" : "var(--ink-3)", transition: "color 0.15s" }}>
      <Icon name="heart" size={small ? 14 : 15} fill={liked ? "var(--accent)" : "none"} /> {count > 0 ? count : ""}
    </button>
  );
}

function CommentItem({
  comment: c, replies = [], liked, onToggleLike, onReply, isReply = false,
}: {
  comment: Comment; replies?: Comment[]; liked: Set<string>;
  onToggleLike: (c: Comment) => void; onReply: (parentId: string, name: string, text: string) => Promise<void>; isReply?: boolean;
}) {
  const [replying, setReplying] = useState(false);
  const [rname, setRname] = useState("");
  const [rtext, setRtext] = useState("");
  const [touched, setTouched] = useState(false);
  const [sent, setSent] = useState(false);
  const hue = avatarColor(c.name);

  const submitReply = async () => {
    if (!rname.trim() || !rtext.trim()) { setTouched(true); return; }
    await onReply(c.id, rname, rtext);
    setRname(""); setRtext(""); setTouched(false); setReplying(false); setSent(true);
  };

  return (
    <div className="fade-up" style={{ display: "flex", gap: 13 }}>
      <div style={{ width: isReply ? 36 : 42, height: isReply ? 36 : 42, flexShrink: 0, borderRadius: 99, display: "grid", placeItems: "center", color: "#fff", fontFamily: "var(--serif)", fontSize: isReply ? 16 : 18, background: c.author ? "var(--accent)" : `linear-gradient(135deg, oklch(0.78 0.09 ${hue}), oklch(0.6 0.11 ${hue}))` }}>{c.name.trim().charAt(0).toUpperCase()}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 3, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--sans)", fontSize: 14.5, fontWeight: 600, color: "var(--ink)" }}>{c.name}</span>
          {c.author && <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--accent-ink)", background: "var(--accent-soft)", padding: "2px 7px", borderRadius: 99 }}>Tác giả</span>}
          <span className="meta" style={{ fontSize: 12.5 }}>{fmtDate(c.date)}</span>
        </div>
        <p style={{ margin: "0 0 4px", fontFamily: "var(--serif)", fontSize: isReply ? 15.5 : 16.5, lineHeight: 1.6, color: "var(--ink)" }}>{c.text}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: -6 }}>
          <LikeBtn liked={liked.has(c.id)} count={c.likes} small={isReply} onClick={() => onToggleLike(c)} />
          {!isReply && (
            <button onClick={() => { setReplying((v) => !v); setSent(false); }} className="fr" style={{ background: "none", border: "none", padding: "4px 8px", borderRadius: 8, fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, color: replying ? "var(--accent)" : "var(--ink-3)" }}>Trả lời</button>
          )}
        </div>

        {sent && !isReply && <div className="meta" style={{ fontSize: 12.5, marginTop: 6 }}>Đã gửi — trả lời của bạn đang chờ duyệt.</div>}

        {replying && (
          <div className="fade-up" style={{ marginTop: 12, padding: 14, background: "var(--surface-2)", borderRadius: 10 }}>
            <input value={rname} onChange={(e) => setRname(e.target.value)} placeholder="Tên của bạn"
              className="fr" style={{ width: "100%", padding: "9px 12px", fontFamily: "var(--sans)", fontSize: 14, color: "var(--ink)", background: "var(--surface)", border: "1px solid " + (touched && !rname.trim() ? "var(--accent)" : "var(--hairline)"), borderRadius: 8, outline: "none", marginBottom: 8 }} />
            <textarea value={rtext} onChange={(e) => setRtext(e.target.value)} rows={2} placeholder={`Trả lời ${c.name}…`}
              className="fr" style={{ width: "100%", padding: "9px 12px", fontFamily: "var(--sans)", fontSize: 14, lineHeight: 1.5, color: "var(--ink)", background: "var(--surface)", border: "1px solid " + (touched && !rtext.trim() ? "var(--accent)" : "var(--hairline)"), borderRadius: 8, outline: "none", resize: "vertical" }} />
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button onClick={submitReply} className="fr" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: 8, fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600 }}><Icon name="send" size={14} /> Gửi</button>
              <button onClick={() => { setReplying(false); setTouched(false); }} className="fr" style={{ padding: "8px 14px", background: "none", color: "var(--ink-2)", border: "1px solid var(--hairline)", borderRadius: 8, fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600 }}>Hủy</button>
            </div>
          </div>
        )}

        {replies.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 18, paddingLeft: 4, borderLeft: "2px solid var(--hairline-2)" }}>
            <div style={{ paddingLeft: 14, display: "flex", flexDirection: "column", gap: 18 }}>
              {replies.map((r) => (
                <CommentItem key={r.id} comment={r} liked={liked} onToggleLike={onToggleLike} onReply={onReply} isReply />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
