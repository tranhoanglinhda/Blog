/* ============================================================
   Public site components
   ============================================================ */
const { useState, useEffect, useMemo, useRef } = React;

// ---------- Header ----------
function PublicHeader({ nav, route, onNav, onSearch, sidebar }) {
  const site = window.BLOG.site;
  const links = [
    { k: "home", label: "Trang chủ" },
    { k: "tag:tan-van", label: "Tản văn" },
    { k: "tag:gia-dinh", label: "Gia đình" },
    { k: "tag:du-lich", label: "Du lịch" },
    { k: "about", label: "Về tôi" },
  ];
  return (
    <header style={{ borderBottom: "1px solid var(--hairline)", background: "var(--paper)", position: "sticky", top: 0, zIndex: 40 }}>
      <div style={{ maxWidth: "var(--shell-max)", margin: "0 auto", padding: "0 28px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <button onClick={() => onNav("home")} className="fr" style={{ display: "flex", alignItems: "center", gap: 11, background: "none", border: "none", padding: 0 }}>
            <Logo size={30} />
            <span style={{ fontFamily: "var(--serif)", fontSize: 20, fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.01em" }}>{site.title}</span>
          </button>
          <nav style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {links.map((l) => {
              const active = route === l.k || (l.k === "home" && route === "home");
              return (
                <button key={l.k} onClick={() => onNav(l.k)} className="fr"
                  style={{ background: "none", border: "none", padding: "8px 13px", fontFamily: "var(--sans)", fontSize: 14.5, fontWeight: active ? 600 : 450,
                    color: active ? "var(--accent-ink)" : "var(--ink-2)", borderRadius: 8 }}>
                  {l.label}
                </button>
              );
            })}
            <button onClick={onSearch} className="fr" aria-label="Tìm kiếm"
              style={{ marginLeft: 6, width: 38, height: 38, display: "grid", placeItems: "center", background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: 99, color: "var(--ink-2)" }}>
              <Icon name="search" size={17} />
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}

// ---------- Post card (list) ----------
function PostCard({ post, onOpen, variant = "row" }) {
  const tags = window.BLOG.tags;
  if (variant === "feature") {
    return (
      <article className="fade-up" onClick={() => onOpen(post)} style={{ cursor: "pointer" }}>
        <div style={{ marginBottom: 18 }}>
          <CoverArt hue={post.cover.hue} label={post.cover.label} ratio="16 / 9" big />
        </div>
        <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
          {post.tags.slice(0, 1).map((t) => <span key={t} className="eyebrow">{tags[t]}</span>)}
          <span className="meta">·</span>
          <span className="meta">{fmtDate(post.date)}</span>
        </div>
        <h2 style={{ margin: "0 0 10px", fontSize: 30, lineHeight: 1.15 }}>{post.title}</h2>
        <p style={{ margin: 0, fontFamily: "var(--serif)", fontSize: 18, lineHeight: 1.5, color: "var(--ink-2)" }}>{post.excerpt}</p>
        <ReadMeta post={post} />
      </article>
    );
  }
  return (
    <article className="fade-up" onClick={() => onOpen(post)}
      style={{ cursor: "pointer", display: "grid", gridTemplateColumns: "1fr 168px", gap: 22, paddingBottom: 28, borderBottom: "1px solid var(--hairline-2)" }}>
      <div>
        <div style={{ display: "flex", gap: 10, marginBottom: 9 }}>
          {post.tags.slice(0, 1).map((t) => <span key={t} className="eyebrow">{tags[t]}</span>)}
          <span className="meta">·</span>
          <span className="meta">{fmtDate(post.date)}</span>
        </div>
        <h3 style={{ margin: "0 0 8px", fontSize: 22, lineHeight: 1.2 }}>{post.title}</h3>
        <p style={{ margin: 0, fontFamily: "var(--serif)", fontSize: 16, lineHeight: 1.5, color: "var(--ink-2)",
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{post.excerpt}</p>
        <ReadMeta post={post} />
      </div>
      <div style={{ alignSelf: "start" }}>
        <CoverArt hue={post.cover.hue} ratio="4 / 3" label={null} />
      </div>
    </article>
  );
}
function ReadMeta({ post }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 12 }}>
      <span className="meta" style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
        <Icon name="clock" size={13} /> {post.readMins} phút đọc
      </span>
      <span className="meta" style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
        <Icon name="eye" size={13} /> {fmtViews(post.views)} lượt xem
      </span>
    </div>
  );
}

// ---------- Sidebar ----------
function Sidebar({ posts, onOpen, onNav }) {
  const site = window.BLOG.site;
  const tags = window.BLOG.tags;
  const popular = [...posts].sort((a, b) => b.views - a.views).slice(0, 4);
  const archive = useMemo(() => {
    const m = {};
    posts.forEach((p) => {
      const d = new Date(p.date + "T00:00:00");
      const k = `Tháng ${d.getMonth() + 1}, ${d.getFullYear()}`;
      m[k] = (m[k] || 0) + 1;
    });
    return Object.entries(m);
  }, [posts]);
  return (
    <aside style={{ display: "flex", flexDirection: "column", gap: 30 }}>
      {/* about */}
      <SideCard>
        <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: 99, background: "linear-gradient(135deg, oklch(0.8 0.08 30), oklch(0.62 0.1 20))", display: "grid", placeItems: "center", color: "#fff", fontFamily: "var(--serif)", fontSize: 22, flexShrink: 0 }}>M</div>
          <div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 17, fontWeight: 600 }}>{site.author}</div>
            <div className="meta" style={{ fontSize: 12.5 }}>Tác giả</div>
          </div>
        </div>
        <p style={{ margin: 0, fontFamily: "var(--serif)", fontSize: 15, lineHeight: 1.55, color: "var(--ink-2)" }}>{site.authorBio}</p>
        <button onClick={() => onNav("about")} className="fr" style={btnGhost}>Đọc thêm về tôi <Icon name="arrow" size={14} /></button>
      </SideCard>

      {/* popular */}
      <SideCard>
        <SideTitle>Được đọc nhiều</SideTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {popular.map((p, i) => (
            <button key={p.id} onClick={() => onOpen(p)} className="fr" style={{ display: "flex", gap: 13, textAlign: "left", background: "none", border: "none", padding: 0, alignItems: "flex-start" }}>
              <span style={{ fontFamily: "var(--serif)", fontSize: 22, color: "var(--accent)", lineHeight: 1, width: 22, flexShrink: 0 }}>{i + 1}</span>
              <span>
                <span style={{ display: "block", fontFamily: "var(--serif)", fontSize: 15.5, lineHeight: 1.25, color: "var(--ink)", marginBottom: 3 }}>{p.title}</span>
                <span className="meta" style={{ fontSize: 12 }}>{fmtViews(p.views)} lượt xem</span>
              </span>
            </button>
          ))}
        </div>
      </SideCard>

      {/* tags */}
      <SideCard>
        <SideTitle>Chủ đề</SideTitle>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {Object.entries(tags).map(([slug, label]) => (
            <button key={slug} onClick={() => onNav("tag:" + slug)} className="fr"
              style={{ padding: "6px 13px", fontFamily: "var(--sans)", fontSize: 13, color: "var(--ink-2)", background: "var(--surface-2)", border: "1px solid var(--hairline)", borderRadius: 99 }}>
              {label}
            </button>
          ))}
        </div>
      </SideCard>

      {/* archive */}
      <SideCard>
        <SideTitle>Lưu trữ</SideTitle>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {archive.map(([k, n]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--hairline-2)", fontFamily: "var(--sans)", fontSize: 14, color: "var(--ink-2)" }}>
              <span>{k}</span><span className="meta">{n}</span>
            </div>
          ))}
        </div>
      </SideCard>
    </aside>
  );
}
function SideCard({ children }) {
  return <div style={{ background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)", padding: 22, boxShadow: "var(--shadow-sm)" }}>{children}</div>;
}
function SideTitle({ children }) {
  return <h4 style={{ margin: "0 0 16px", fontFamily: "var(--sans)", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-3)" }}>{children}</h4>;
}
const btnGhost = { marginTop: 14, display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", padding: 0, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: "var(--accent-ink)" };

// ---------- Home feed ----------
function HomeFeed({ posts, onOpen, onNav, showSidebar, homeLayout }) {
  const site = window.BLOG.site;
  const published = posts.filter((p) => p.status === "published");
  const featured = published.filter((p) => p.featured);
  const rest = published.filter((p) => !p.featured);
  return (
    <div>
      {/* masthead */}
      <div style={{ borderBottom: "1px solid var(--hairline)", background: "var(--surface)" }}>
        <div style={{ maxWidth: "var(--shell-max)", margin: "0 auto", padding: "56px 28px 50px", textAlign: "center" }}>
          <div className="eyebrow" style={{ marginBottom: 16 }}>Nhật ký · Tản văn · Đời thường</div>
          <h1 style={{ margin: "0 auto 16px", fontSize: 46, lineHeight: 1.08, maxWidth: 760, letterSpacing: "-0.02em" }}>{site.title}</h1>
          <p style={{ margin: "0 auto", maxWidth: 560, fontFamily: "var(--serif)", fontSize: 19, lineHeight: 1.5, color: "var(--ink-2)", fontStyle: "italic" }}>{site.tagline}</p>
        </div>
      </div>

      <div style={{ maxWidth: "var(--shell-max)", margin: "0 auto", padding: "46px 28px 80px",
        display: "grid", gridTemplateColumns: showSidebar ? "1fr 312px" : "1fr", gap: 56 }}>
        <main style={{ minWidth: 0 }}>
          {/* featured */}
          {featured.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: featured.length > 1 ? "1fr 1fr" : "1fr", gap: 40, marginBottom: 48, paddingBottom: 48, borderBottom: "1px solid var(--hairline)" }}>
              {featured.map((p) => <PostCard key={p.id} post={p} onOpen={onOpen} variant="feature" />)}
            </div>
          )}
          <h3 style={{ margin: "0 0 26px", fontSize: 15, fontFamily: "var(--sans)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-3)" }}>Bài viết gần đây</h3>
          {homeLayout === "grid" ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
              {rest.map((p) => <GridCard key={p.id} post={p} onOpen={onOpen} />)}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {rest.map((p) => <PostCard key={p.id} post={p} onOpen={onOpen} variant="row" />)}
            </div>
          )}
        </main>
        {showSidebar && <Sidebar posts={published} onOpen={onOpen} onNav={onNav} />}
      </div>
    </div>
  );
}
function GridCard({ post, onOpen }) {
  const tags = window.BLOG.tags;
  return (
    <article className="fade-up" onClick={() => onOpen(post)} style={{ cursor: "pointer" }}>
      <div style={{ marginBottom: 14 }}><CoverArt hue={post.cover.hue} ratio="16 / 10" label={null} /></div>
      <div style={{ display: "flex", gap: 9, marginBottom: 8 }}>
        <span className="eyebrow">{tags[post.tags[0]]}</span><span className="meta">·</span><span className="meta">{fmtDate(post.date)}</span>
      </div>
      <h3 style={{ margin: "0 0 7px", fontSize: 20, lineHeight: 1.2 }}>{post.title}</h3>
      <p style={{ margin: 0, fontFamily: "var(--serif)", fontSize: 15, lineHeight: 1.5, color: "var(--ink-2)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{post.excerpt}</p>
    </article>
  );
}

// ---------- Post detail ----------
function PostDetail({ post, posts, onOpen, onNav, comments = [], onAddComment, onAddReply, onToggleLike }) {
  const tags = window.BLOG.tags;
  useEffect(() => { window.scrollTo(0, 0); }, [post.id]);
  const related = posts.filter((p) => p.status === "published" && p.id !== post.id && p.tags.some((t) => post.tags.includes(t))).slice(0, 3);
  return (
    <article>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "44px 28px 0" }}>
        <button onClick={() => onNav("home")} className="fr" style={{ ...btnGhost, marginTop: 0, marginBottom: 26, color: "var(--ink-2)" }}>
          <Icon name="arrowL" size={15} /> Tất cả bài viết
        </button>
        <div style={{ display: "flex", gap: 10, marginBottom: 18, justifyContent: "center" }}>
          {post.tags.map((t) => <button key={t} onClick={() => onNav("tag:" + t)} className="eyebrow fr" style={{ background: "none", border: "none", cursor: "pointer" }}>{tags[t]}</button>)}
        </div>
        <h1 style={{ margin: "0 0 20px", fontSize: 42, lineHeight: 1.12, textAlign: "center", letterSpacing: "-0.02em" }}>{post.title}</h1>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 32, paddingBottom: 32, borderBottom: "1px solid var(--hairline)" }}>
          <div style={{ width: 38, height: 38, borderRadius: 99, background: "linear-gradient(135deg, oklch(0.8 0.08 30), oklch(0.62 0.1 20))", display: "grid", placeItems: "center", color: "#fff", fontFamily: "var(--serif)", fontSize: 16 }}>M</div>
          <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: "var(--ink)" }}>{window.BLOG.site.author}</span>
          <span className="meta">·</span><span className="meta">{fmtDate(post.date)}</span>
          <span className="meta">·</span><span className="meta">{post.readMins} phút đọc</span>
        </div>
      </div>

      <div style={{ maxWidth: 920, margin: "0 auto 36px", padding: "0 28px" }}>
        <CoverArt hue={post.cover.hue} label={post.cover.label} ratio="16 / 8" big />
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 28px" }}>
        {post.body.map((b, i) => <Block key={i} b={b} />)}

        {/* tags footer */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 9, margin: "40px 0", paddingTop: 32, borderTop: "1px solid var(--hairline)" }}>
          {post.tags.map((t) => <button key={t} onClick={() => onNav("tag:" + t)} className="fr" style={{ padding: "6px 13px", fontFamily: "var(--sans)", fontSize: 13, color: "var(--ink-2)", background: "var(--surface-2)", border: "1px solid var(--hairline)", borderRadius: 99 }}># {tags[t]}</button>)}
        </div>

        {/* author box */}
        <div style={{ display: "flex", gap: 16, padding: 24, background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)", marginBottom: 56 }}>
          <div style={{ width: 56, height: 56, borderRadius: 99, background: "linear-gradient(135deg, oklch(0.8 0.08 30), oklch(0.62 0.1 20))", display: "grid", placeItems: "center", color: "#fff", fontFamily: "var(--serif)", fontSize: 24, flexShrink: 0 }}>M</div>
          <div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 18, fontWeight: 600, marginBottom: 4 }}>{window.BLOG.site.author}</div>
            <p style={{ margin: 0, fontFamily: "var(--serif)", fontSize: 15, lineHeight: 1.55, color: "var(--ink-2)" }}>{window.BLOG.site.authorBio}</p>
          </div>
        </div>

        {/* comments */}
        <Comments comments={comments} onAddComment={onAddComment} onAddReply={onAddReply} onToggleLike={onToggleLike} />
      </div>

      {related.length > 0 && (
        <div style={{ background: "var(--surface)", borderTop: "1px solid var(--hairline)", padding: "56px 28px 72px" }}>
          <div style={{ maxWidth: "var(--shell-max)", margin: "0 auto" }}>
            <h3 style={{ margin: "0 0 28px", fontSize: 15, fontFamily: "var(--sans)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-3)" }}>Có thể bạn thích</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
              {related.map((p) => <GridCard key={p.id} post={p} onOpen={onOpen} />)}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
// ---------- Comments ----------
const AVATAR_HUES = [18, 150, 210, 280, 45, 330, 100];
function avatarColor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h + name.charCodeAt(i)) % AVATAR_HUES.length;
  return AVATAR_HUES[h];
}
function LikeBtn({ liked, count, onClick, small }) {
  return (
    <button onClick={onClick} className="fr" style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "none", border: "none", padding: "4px 6px", borderRadius: 8, fontFamily: "var(--sans)", fontSize: small ? 12.5 : 13, fontWeight: 600, color: liked ? "var(--accent)" : "var(--ink-3)", transition: "color 0.15s" }}>
      <Icon name="heart" size={small ? 14 : 15} fill={liked ? "var(--accent)" : "none"} /> {count > 0 ? count : ""}
    </button>
  );
}
function CommentItem({ comment: c, parentId = null, replyTo, onToggleLike, onAddReply }) {
  const [replying, setReplying] = useState(false);
  const [rname, setRname] = useState("");
  const [rtext, setRtext] = useState("");
  const [touched, setTouched] = useState(false);
  const hue = avatarColor(c.name);
  const isReply = parentId !== null;
  const visibleReplies = (c.replies || []).filter((r) => r.status === "visible");

  const submitReply = () => {
    if (!rname.trim() || !rtext.trim()) { setTouched(true); return; }
    const today = new Date().toISOString().slice(0, 10);
    onAddReply(c.id, { id: "r" + Date.now(), name: rname.trim(), text: rtext.trim(), date: today, likes: 0, liked: false, status: "visible" });
    setRname(""); setRtext(""); setTouched(false); setReplying(false);
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
          <LikeBtn liked={c.liked} count={c.likes} small={isReply} onClick={() => onToggleLike(c.id, parentId)} />
          {!isReply && (
            <button onClick={() => setReplying((v) => !v)} className="fr" style={{ background: "none", border: "none", padding: "4px 8px", borderRadius: 8, fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, color: replying ? "var(--accent)" : "var(--ink-3)" }}>Trả lời</button>
          )}
        </div>

        {/* reply form */}
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

        {/* nested replies */}
        {visibleReplies.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 18, paddingLeft: 4, borderLeft: "2px solid var(--hairline-2)" }}>
            <div style={{ paddingLeft: 14, display: "flex", flexDirection: "column", gap: 18 }}>
              {visibleReplies.map((r) => (
                <CommentItem key={r.id} comment={r} parentId={c.id} onToggleLike={onToggleLike} onAddReply={onAddReply} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
function Comments({ comments, onAddComment, onAddReply, onToggleLike }) {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [touched, setTouched] = useState(false);
  const visible = comments.filter((c) => c.status === "visible");
  const list = [...visible].sort((a, b) => b.date.localeCompare(a.date));
  const total = visible.reduce((n, c) => n + 1 + (c.replies || []).filter((r) => r.status === "visible").length, 0);
  const submit = () => {
    if (!name.trim() || !text.trim()) { setTouched(true); return; }
    const today = new Date().toISOString().slice(0, 10);
    onAddComment && onAddComment({ id: "c" + Date.now(), name: name.trim(), text: text.trim(), date: today, likes: 0, liked: false, status: "visible", replies: [] });
    setName(""); setText(""); setTouched(false);
  };
  return (
    <section style={{ marginBottom: 64 }}>
      <h3 style={{ margin: "0 0 6px", fontSize: 24 }}>Bình luận {total > 0 && <span style={{ color: "var(--ink-3)" }}>({total})</span>}</h3>
      <p className="meta" style={{ fontSize: 14, margin: "0 0 24px" }}>Để lại đôi dòng — bạn không cần đăng nhập.</p>

      {/* form */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)", padding: 20, marginBottom: 36, boxShadow: "var(--shadow-sm)" }}>
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
      </div>

      {/* list */}
      {list.length === 0 ? (
        <div style={{ textAlign: "center", padding: "28px 0", color: "var(--ink-3)", fontFamily: "var(--serif)", fontSize: 17, fontStyle: "italic" }}>Chưa có bình luận nào. Hãy là người đầu tiên.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          {list.map((c) => (
            <CommentItem key={c.id} comment={c} parentId={null} onToggleLike={onToggleLike} onAddReply={onAddReply} />
          ))}
        </div>
      )}
    </section>
  );
}

function Block({ b }) {
  if (b.t === "h2") return <h2 style={{ fontSize: 27, lineHeight: 1.25, margin: "40px 0 16px" }}>{b.v}</h2>;
  if (b.t === "quote") return (
    <blockquote style={{ margin: "32px 0", padding: "4px 0 4px 26px", borderLeft: "3px solid var(--accent)", fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 22, lineHeight: 1.45, color: "var(--ink)" }}>{b.v}</blockquote>
  );
  return <p style={{ margin: "0 0 22px", fontFamily: "var(--serif)", fontSize: 19, lineHeight: 1.72, color: "var(--ink)" }}>{b.v}</p>;
}

// ---------- Tag page ----------
function TagPage({ slug, posts, onOpen, onNav, showSidebar }) {
  const tags = window.BLOG.tags;
  const list = posts.filter((p) => p.status === "published" && p.tags.includes(slug));
  return (
    <div style={{ maxWidth: "var(--shell-max)", margin: "0 auto", padding: "52px 28px 80px", display: "grid", gridTemplateColumns: showSidebar ? "1fr 312px" : "1fr", gap: 56 }}>
      <main style={{ minWidth: 0 }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>Chủ đề</div>
        <h1 style={{ margin: "0 0 8px", fontSize: 40 }}>{tags[slug]}</h1>
        <p className="meta" style={{ marginBottom: 40, fontSize: 15 }}>{list.length} bài viết</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {list.map((p) => <PostCard key={p.id} post={p} onOpen={onOpen} variant="row" />)}
        </div>
      </main>
      {showSidebar && <Sidebar posts={posts.filter((p) => p.status === "published")} onOpen={onOpen} onNav={onNav} />}
    </div>
  );
}

// ---------- About ----------
function AboutPage() {
  const site = window.BLOG.site;
  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "64px 28px 90px" }}>
      <div style={{ width: 88, height: 88, borderRadius: 99, background: "linear-gradient(135deg, oklch(0.8 0.08 30), oklch(0.62 0.1 20))", display: "grid", placeItems: "center", color: "#fff", fontFamily: "var(--serif)", fontSize: 38, marginBottom: 28 }}>M</div>
      <div className="eyebrow" style={{ marginBottom: 12 }}>Về tôi</div>
      <h1 style={{ margin: "0 0 24px", fontSize: 40, lineHeight: 1.1 }}>Chào, mình là {site.author}</h1>
      <p style={{ fontFamily: "var(--serif)", fontSize: 20, lineHeight: 1.7, color: "var(--ink)" }}>{site.authorBio}</p>
      <p style={{ fontFamily: "var(--serif)", fontSize: 20, lineHeight: 1.7, color: "var(--ink)" }}>Mình không phải nhà văn. Mình chỉ là một người thích quan sát và ghi lại. Những bài viết ở đây phần lớn ra đời vào buổi sáng sớm hoặc đêm khuya, khi thành phố yên tĩnh nhất.</p>
      <p style={{ fontFamily: "var(--serif)", fontSize: 20, lineHeight: 1.7, color: "var(--ink)" }}>Nếu một câu chữ nào đó khiến bạn thấy mình trong đó, thì với mình, thế là đủ.</p>
      <a href={"mailto:" + site.email} className="fr" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 16, padding: "12px 20px", background: "var(--accent)", color: "#fff", borderRadius: 99, fontFamily: "var(--sans)", fontSize: 14.5, fontWeight: 600 }}>
        <Icon name="mail" size={16} /> {site.email}
      </a>
    </div>
  );
}

// ---------- Search overlay ----------
function SearchOverlay({ posts, onClose, onOpen }) {
  const [q, setQ] = useState("");
  const ref = useRef(null);
  useEffect(() => { ref.current && ref.current.focus(); }, []);
  const results = q.trim()
    ? posts.filter((p) => p.status === "published" && (p.title.toLowerCase().includes(q.toLowerCase()) || p.excerpt.toLowerCase().includes(q.toLowerCase())))
    : [];
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 90, background: "rgba(38,33,27,0.32)", backdropFilter: "blur(3px)", display: "flex", justifyContent: "center", paddingTop: 96 }}>
      <div onClick={(e) => e.stopPropagation()} className="fade-up" style={{ width: "min(620px, 92vw)", height: "fit-content", maxHeight: "70vh", background: "var(--surface)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-lg)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", borderBottom: "1px solid var(--hairline)" }}>
          <Icon name="search" size={20} style={{ color: "var(--ink-3)" }} />
          <input ref={ref} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm bài viết…" style={{ flex: 1, border: "none", outline: "none", background: "none", fontFamily: "var(--sans)", fontSize: 17, color: "var(--ink)" }} />
          <button onClick={onClose} className="fr" style={{ background: "var(--surface-2)", border: "none", borderRadius: 7, padding: "4px 9px", fontFamily: "var(--sans)", fontSize: 12, color: "var(--ink-3)" }}>Esc</button>
        </div>
        <div className="thin-scroll" style={{ overflowY: "auto", padding: results.length ? 10 : 0 }}>
          {results.map((p) => (
            <button key={p.id} onClick={() => { onOpen(p); onClose(); }} className="fr" style={{ display: "flex", gap: 14, width: "100%", textAlign: "left", padding: 12, background: "none", border: "none", borderRadius: 8, alignItems: "center" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--surface-2)"} onMouseLeave={(e) => e.currentTarget.style.background = "none"}>
              <div style={{ width: 64, flexShrink: 0 }}><CoverArt hue={p.cover.hue} ratio="4 / 3" label={null} /></div>
              <div>
                <div style={{ fontFamily: "var(--serif)", fontSize: 16, color: "var(--ink)" }}>{p.title}</div>
                <div className="meta" style={{ fontSize: 13 }}>{fmtDate(p.date)}</div>
              </div>
            </button>
          ))}
          {q.trim() && results.length === 0 && <div style={{ padding: 40, textAlign: "center", color: "var(--ink-3)", fontFamily: "var(--sans)", fontSize: 14 }}>Không tìm thấy bài viết nào.</div>}
        </div>
      </div>
    </div>
  );
}

// ---------- Footer ----------
function PublicFooter({ onNav, onEnterAdmin }) {
  const site = window.BLOG.site;
  return (
    <footer style={{ borderTop: "1px solid var(--hairline)", background: "var(--surface)" }}>
      <div style={{ maxWidth: "var(--shell-max)", margin: "0 auto", padding: "44px 28px", display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <Logo size={26} />
          <div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 16, fontWeight: 600 }}>{site.title}</div>
            <div className="meta" style={{ fontSize: 12.5 }}>© 2026 · Viết bằng tất cả sự dịu dàng</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={() => onNav("about")} className="fr" style={footLink}>Về tôi</button>
          <button onClick={() => onNav("home")} className="fr" style={footLink}>Bài viết</button>
          <button onClick={onEnterAdmin} className="fr" style={{ ...footLink, display: "inline-flex", alignItems: "center", gap: 6, color: "var(--accent-ink)" }}>
            <Icon name="edit" size={14} /> Trang quản trị
          </button>
        </div>
      </div>
    </footer>
  );
}
const footLink = { background: "none", border: "none", padding: "8px 12px", fontFamily: "var(--sans)", fontSize: 14, color: "var(--ink-2)", borderRadius: 7 };

Object.assign(window, { PublicHeader, PublicFooter, HomeFeed, PostDetail, TagPage, AboutPage, SearchOverlay, PostCard, Sidebar });
