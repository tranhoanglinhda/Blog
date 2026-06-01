/* ============================================================
   Admin components — login, dashboard, post manager, editor
   ============================================================ */

// ---------- Login ----------
function AdminLogin({ onLogin, onBack }) {
  const [email, setEmail] = useState("may@sotaycuamay.com");
  const [pw, setPw] = useState("••••••••");
  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr", background: "var(--paper)" }}>
      <div style={{ display: "grid", placeItems: "center", padding: 40 }}>
        <div style={{ width: "min(360px, 100%)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 36 }}>
            <Logo size={34} />
            <span style={{ fontFamily: "var(--serif)", fontSize: 21, fontWeight: 600 }}>{window.BLOG.site.title}</span>
          </div>
          <h1 style={{ margin: "0 0 8px", fontSize: 30 }}>Chào mừng trở lại</h1>
          <p className="meta" style={{ fontSize: 15, marginBottom: 30 }}>Đăng nhập để viết và quản lý bài.</p>
          <Field label="Email">
            <input value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} className="fr" />
          </Field>
          <Field label="Mật khẩu">
            <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} style={inputStyle} className="fr" />
          </Field>
          <button onClick={onLogin} className="fr" style={{ ...primaryBtn, width: "100%", justifyContent: "center", marginTop: 8 }}>Đăng nhập</button>
          <button onClick={onBack} className="fr" style={{ ...btnGhost, marginTop: 20 }}><Icon name="arrowL" size={14} /> Về trang blog</button>
        </div>
      </div>
      <div style={{ position: "relative", background: "linear-gradient(150deg, oklch(0.72 0.1 28), oklch(0.5 0.11 18))", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(110% 70% at 70% 20%, rgba(255,255,255,0.3), transparent 50%)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 52, color: "#fff" }}>
          <Icon name="quote" size={40} style={{ opacity: 0.5, marginBottom: 18 }} fill="rgba(255,255,255,0.9)" />
          <p style={{ margin: 0, fontFamily: "var(--serif)", fontSize: 28, lineHeight: 1.35, fontStyle: "italic" }}>“Viết là cách mình giữ lại những điều dễ quên.”</p>
          <p style={{ margin: "20px 0 0", fontFamily: "var(--sans)", fontSize: 14, opacity: 0.8 }}>Trang quản trị · Sổ Tay Của Mây</p>
        </div>
      </div>
    </div>
  );
}
function Field({ label, children }) {
  return (
    <label style={{ display: "block", marginBottom: 18 }}>
      <span style={{ display: "block", fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, color: "var(--ink-2)", marginBottom: 7 }}>{label}</span>
      {children}
    </label>
  );
}
const inputStyle = { width: "100%", padding: "11px 14px", fontFamily: "var(--sans)", fontSize: 15, color: "var(--ink)", background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: 9, outline: "none" };
const primaryBtn = { display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 20px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: 9, fontFamily: "var(--sans)", fontSize: 14.5, fontWeight: 600 };
const secondaryBtn = { display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", background: "var(--surface)", color: "var(--ink)", border: "1px solid var(--hairline)", borderRadius: 9, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600 };

// ---------- Admin shell ----------
function AdminShell({ view, onView, onLogout, onExit, pendingCount = 0, children }) {
  const nav = [
    { k: "dashboard", label: "Tổng quan", icon: "layout" },
    { k: "posts", label: "Bài viết", icon: "list" },
    { k: "comments", label: "Bình luận", icon: "quote", badge: pendingCount },
    { k: "settings", label: "Cài đặt", icon: "settings" },
  ];
  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "248px 1fr", background: "var(--paper)" }}>
      <aside style={{ borderRight: "1px solid var(--hairline)", background: "var(--surface)", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh" }}>
        <div style={{ padding: "22px 20px", borderBottom: "1px solid var(--hairline)", display: "flex", alignItems: "center", gap: 10 }}>
          <Logo size={28} />
          <div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 15.5, fontWeight: 600, lineHeight: 1.1 }}>{window.BLOG.site.title}</div>
            <div className="meta" style={{ fontSize: 11.5 }}>Bảng điều khiển</div>
          </div>
        </div>
        <button onClick={() => onView("editor")} className="fr" style={{ ...primaryBtn, margin: "18px 16px 8px", justifyContent: "center" }}>
          <Icon name="plus" size={17} /> Viết bài mới
        </button>
        <nav style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 3 }}>
          {nav.map((n) => {
            const active = view === n.k || (n.k === "posts" && view === "editor");
            return (
              <button key={n.k} onClick={() => onView(n.k)} className="fr"
                style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 12px", background: active ? "var(--accent-soft)" : "none", border: "none", borderRadius: 9, fontFamily: "var(--sans)", fontSize: 14.5, fontWeight: active ? 600 : 450, color: active ? "var(--accent-ink)" : "var(--ink-2)", textAlign: "left" }}>
                <Icon name={n.icon} size={18} /> <span style={{ flex: 1 }}>{n.label}</span>
                {n.badge > 0 && <span style={{ minWidth: 20, height: 20, padding: "0 6px", display: "grid", placeItems: "center", borderRadius: 99, background: "var(--accent)", color: "#fff", fontSize: 11.5, fontWeight: 700 }}>{n.badge}</span>}
              </button>
            );
          })}
        </nav>
        <div style={{ marginTop: "auto", padding: 12, borderTop: "1px solid var(--hairline)" }}>
          <button onClick={onExit} className="fr" style={{ ...sideBtn }}>
            <Icon name="external" size={17} /> Xem trang blog
          </button>
          <button onClick={onLogout} className="fr" style={{ ...sideBtn, color: "var(--ink-3)" }}>
            <Icon name="logout" size={17} /> Đăng xuất
          </button>
        </div>
      </aside>
      <div className="thin-scroll" style={{ overflowY: "auto", maxHeight: "100vh" }}>{children}</div>
    </div>
  );
}
const sideBtn = { display: "flex", alignItems: "center", gap: 11, width: "100%", padding: "10px 12px", background: "none", border: "none", borderRadius: 9, fontFamily: "var(--sans)", fontSize: 14, color: "var(--ink-2)", textAlign: "left" };

// ---------- Dashboard ----------
function Dashboard({ posts, onView, onEdit }) {
  const pub = posts.filter((p) => p.status === "published");
  const drafts = posts.filter((p) => p.status === "draft");
  const totalViews = pub.reduce((s, p) => s + p.views, 0);
  const stats = [
    { label: "Bài đã đăng", value: pub.length, icon: "check" },
    { label: "Bản nháp", value: drafts.length, icon: "edit" },
    { label: "Tổng lượt xem", value: fmtViews(totalViews), icon: "eye" },
    { label: "Chủ đề", value: Object.keys(window.BLOG.tags).length, icon: "tag" },
  ];
  return (
    <div style={{ padding: "32px 40px 60px", maxWidth: 1080 }}>
      <PageHead title="Tổng quan" sub="Chào buổi sáng, Mây. Hôm nay viết gì nhỉ?" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18, marginBottom: 36 }}>
        {stats.map((s) => (
          <div key={s.label} style={{ padding: 20, background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)" }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "var(--accent-soft)", color: "var(--accent-ink)", display: "grid", placeItems: "center", marginBottom: 14 }}><Icon name={s.icon} size={19} /></div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 32, fontWeight: 600, lineHeight: 1 }}>{s.value}</div>
            <div className="meta" style={{ marginTop: 6 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <h3 style={{ margin: 0, fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, color: "var(--ink)" }}>Bài viết gần đây</h3>
        <button onClick={() => onView("posts")} className="fr" style={{ ...btnGhost, marginTop: 0 }}>Xem tất cả <Icon name="arrow" size={14} /></button>
      </div>
      <div style={{ background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
        {[...posts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4).map((p, i, arr) => (
          <button key={p.id} onClick={() => onEdit(p)} className="fr" style={{ display: "flex", alignItems: "center", gap: 16, width: "100%", textAlign: "left", padding: "14px 18px", background: "none", border: "none", borderBottom: i < arr.length - 1 ? "1px solid var(--hairline-2)" : "none" }}>
            <div style={{ width: 60, flexShrink: 0 }}><CoverArt hue={p.cover.hue} ratio="4 / 3" label={null} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "var(--serif)", fontSize: 16, color: "var(--ink)", marginBottom: 3 }}>{p.title}</div>
              <div className="meta" style={{ fontSize: 13 }}>{fmtDate(p.date)} · {fmtViews(p.views)} lượt xem</div>
            </div>
            <StatusBadge status={p.status} />
            <Icon name="chevron" size={16} style={{ color: "var(--ink-3)" }} />
          </button>
        ))}
      </div>
    </div>
  );
}
function PageHead({ title, sub }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h1 style={{ margin: "0 0 6px", fontSize: 30 }}>{title}</h1>
      {sub && <p className="meta" style={{ fontSize: 15, margin: 0 }}>{sub}</p>}
    </div>
  );
}
function StatusBadge({ status }) {
  const map = { published: { bg: "oklch(0.93 0.05 150)", fg: "oklch(0.42 0.1 150)", t: "Đã đăng" }, draft: { bg: "var(--surface-2)", fg: "var(--ink-3)", t: "Nháp" } };
  const s = map[status] || map.draft;
  return <span style={{ padding: "4px 11px", borderRadius: 99, fontFamily: "var(--sans)", fontSize: 12, fontWeight: 600, background: s.bg, color: s.fg, flexShrink: 0 }}>{s.t}</span>;
}

// ---------- Posts list ----------
function PostsList({ posts, onEdit, onView, onDelete }) {
  const [filter, setFilter] = useState("all");
  const tags = window.BLOG.tags;
  const filtered = posts.filter((p) => filter === "all" || p.status === filter).sort((a, b) => b.date.localeCompare(a.date));
  const tabs = [{ k: "all", t: "Tất cả" }, { k: "published", t: "Đã đăng" }, { k: "draft", t: "Nháp" }];
  return (
    <div style={{ padding: "32px 40px 60px", maxWidth: 1080 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 26 }}>
        <PageHead title="Bài viết" sub={`${posts.length} bài viết`} />
        <button onClick={() => onView("editor")} className="fr" style={primaryBtn}><Icon name="plus" size={17} /> Viết bài mới</button>
      </div>
      <div style={{ display: "flex", gap: 4, marginBottom: 18, borderBottom: "1px solid var(--hairline)" }}>
        {tabs.map((t) => (
          <button key={t.k} onClick={() => setFilter(t.k)} className="fr"
            style={{ padding: "10px 14px", background: "none", border: "none", borderBottom: filter === t.k ? "2px solid var(--accent)" : "2px solid transparent", marginBottom: -1, fontFamily: "var(--sans)", fontSize: 14, fontWeight: filter === t.k ? 600 : 450, color: filter === t.k ? "var(--ink)" : "var(--ink-3)" }}>
            {t.t} <span style={{ color: "var(--ink-3)", fontWeight: 450 }}>{t.k === "all" ? posts.length : posts.filter((p) => p.status === t.k).length}</span>
          </button>
        ))}
      </div>
      <div style={{ background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
        {filtered.map((p, i, arr) => (
          <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 18px", borderBottom: i < arr.length - 1 ? "1px solid var(--hairline-2)" : "none" }}>
            <div style={{ width: 64, flexShrink: 0 }}><CoverArt hue={p.cover.hue} ratio="4 / 3" label={null} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "var(--serif)", fontSize: 16.5, color: "var(--ink)", marginBottom: 4 }}>{p.title}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span className="meta" style={{ fontSize: 13, display: "inline-flex", alignItems: "center", gap: 5 }}><Icon name="calendar" size={12} /> {fmtDateShort(p.date)}</span>
                <span className="meta" style={{ fontSize: 13, display: "inline-flex", alignItems: "center", gap: 5 }}><Icon name="eye" size={12} /> {fmtViews(p.views)}</span>
                <span style={{ display: "flex", gap: 5 }}>{p.tags.map((t) => <span key={t} className="meta" style={{ fontSize: 12, padding: "2px 8px", background: "var(--surface-2)", borderRadius: 99 }}>{tags[t]}</span>)}</span>
              </div>
            </div>
            <StatusBadge status={p.status} />
            <div style={{ display: "flex", gap: 4 }}>
              <button onClick={() => onEdit(p)} className="fr" title="Sửa" style={iconBtn}><Icon name="edit" size={16} /></button>
              <button onClick={() => onDelete(p)} className="fr" title="Xóa" style={{ ...iconBtn, color: "var(--accent)" }}><Icon name="trash" size={16} /></button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div style={{ padding: 50, textAlign: "center", color: "var(--ink-3)", fontFamily: "var(--sans)", fontSize: 14 }}>Chưa có bài nào ở mục này.</div>}
      </div>
    </div>
  );
}
const iconBtn = { width: 34, height: 34, display: "grid", placeItems: "center", background: "none", border: "1px solid var(--hairline)", borderRadius: 8, color: "var(--ink-2)" };

// ---------- Editor ----------
function Editor({ post, onSave, onCancel, onView }) {
  const tags = window.BLOG.tags;
  const isNew = !post;
  const [title, setTitle] = useState(post ? post.title : "");
  const [excerpt, setExcerpt] = useState(post ? post.excerpt : "");
  const [selTags, setSelTags] = useState(post ? post.tags : []);
  const [hue, setHue] = useState(post ? post.cover.hue : 24);
  const [coverLabel, setCoverLabel] = useState(post ? post.cover.label : "");
  const [saved, setSaved] = useState(false);
  const bodyRef = useRef(null);
  const fileRef = useRef(null);

  // seed editor html once
  useEffect(() => {
    if (!bodyRef.current) return;
    const html = post
      ? post.body.map((b) => b.t === "h2" ? `<h2>${b.v}</h2>` : b.t === "quote" ? `<blockquote>${b.v}</blockquote>` : `<p>${b.v}</p>`).join("")
      : "<p>Bắt đầu viết câu chuyện của bạn…</p>";
    bodyRef.current.innerHTML = html;
  }, []);

  const exec = (cmd, val) => { document.execCommand(cmd, false, val || null); bodyRef.current.focus(); };
  const fmtBlock = (tag) => { document.execCommand("formatBlock", false, tag); bodyRef.current.focus(); };

  const toolbar = [
    { icon: "bold", t: "Đậm", fn: () => exec("bold") },
    { icon: "italic", t: "Nghiêng", fn: () => exec("italic") },
    { sep: true },
    { icon: "h2", t: "Tiêu đề", fn: () => fmtBlock("h2") },
    { icon: "quote", t: "Trích dẫn", fn: () => fmtBlock("blockquote") },
    { icon: "ul", t: "Danh sách", fn: () => exec("insertUnorderedList") },
    { icon: "link", t: "Liên kết", fn: () => { const u = prompt("Dán đường dẫn:"); if (u) exec("createLink", u); } },
    { sep: true },
    { icon: "image", t: "Chèn ảnh", fn: () => fileRef.current && fileRef.current.click() },
  ];

  const doSave = (status) => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
    onSave && onSave({ status });
  };

  return (
    <div>
      {/* sticky editor bar */}
      <div style={{ position: "sticky", top: 0, zIndex: 20, background: "var(--paper)", borderBottom: "1px solid var(--hairline)", padding: "14px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={onCancel} className="fr" style={{ ...btnGhost, marginTop: 0, color: "var(--ink-2)" }}><Icon name="arrowL" size={15} /> {isNew ? "Hủy" : "Quay lại"}</button>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {saved && <span className="meta" style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "oklch(0.5 0.1 150)" }}><Icon name="check" size={15} /> Đã lưu</span>}
          <button onClick={() => doSave("draft")} className="fr" style={secondaryBtn}><Icon name="save" size={16} /> Lưu nháp</button>
          <button onClick={() => doSave("published")} className="fr" style={primaryBtn}><Icon name="send" size={15} /> Xuất bản</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 304px", gap: 0, alignItems: "start" }}>
        {/* main editor */}
        <div style={{ padding: "36px 0 80px", maxWidth: 720, margin: "0 auto", width: "100%" }}>
          <div style={{ padding: "0 40px" }}>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tiêu đề bài viết"
              style={{ width: "100%", border: "none", outline: "none", background: "none", fontFamily: "var(--serif)", fontSize: 38, fontWeight: 600, color: "var(--ink)", lineHeight: 1.15, marginBottom: 18, letterSpacing: "-0.02em" }} />
            {/* cover */}
            <div style={{ marginBottom: 22 }}>
              <CoverArt hue={hue} label={coverLabel || "Ảnh bìa"} ratio="16 / 7" big />
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
                <button onClick={() => fileRef.current && fileRef.current.click()} className="fr" style={{ ...secondaryBtn, padding: "8px 14px", fontSize: 13 }}><Icon name="image" size={15} /> Tải ảnh bìa</button>
                <input value={coverLabel} onChange={(e) => setCoverLabel(e.target.value)} placeholder="Chú thích ảnh…" style={{ ...inputStyle, padding: "8px 12px", fontSize: 13, flex: 1 }} className="fr" />
              </div>
            </div>
          </div>

          {/* toolbar */}
          <div style={{ position: "sticky", top: 65, zIndex: 10, padding: "8px 40px", margin: "0 0 14px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 2, padding: 5, background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: 11, boxShadow: "var(--shadow-md)" }}>
              {toolbar.map((b, i) => b.sep
                ? <span key={i} style={{ width: 1, height: 22, background: "var(--hairline)", margin: "0 4px" }} />
                : <button key={i} onClick={b.fn} title={b.t} className="fr" style={{ width: 36, height: 36, display: "grid", placeItems: "center", background: "none", border: "none", borderRadius: 8, color: "var(--ink-2)" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "var(--surface-2)"} onMouseLeave={(e) => e.currentTarget.style.background = "none"}><Icon name={b.icon} size={18} /></button>
              )}
            </div>
          </div>

          {/* body */}
          <div ref={bodyRef} contentEditable suppressContentEditableWarning className="editor-body thin-scroll"
            style={{ padding: "0 40px", minHeight: 320, outline: "none", fontFamily: "var(--serif)", fontSize: 19, lineHeight: 1.72, color: "var(--ink)" }} />
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={() => alert("Trong bản dựng thật, ảnh sẽ được tải lên kho lưu trữ. Đây là bản mô phỏng.")} />
        </div>

        {/* settings rail */}
        <div style={{ borderLeft: "1px solid var(--hairline)", minHeight: "calc(100vh - 65px)", background: "var(--surface)", padding: "28px 24px", position: "sticky", top: 65, display: "flex", flexDirection: "column", gap: 26 }}>
          <RailSec title="Trạng thái">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <StatusBadge status={post ? post.status : "draft"} />
              <span className="meta" style={{ fontSize: 13 }}>{isNew ? "Bài mới" : "Đang chỉnh sửa"}</span>
            </div>
          </RailSec>
          <RailSec title="Đường dẫn (slug)">
            <input defaultValue={post ? post.slug : ""} placeholder="duong-dan-bai-viet" style={{ ...inputStyle, padding: "9px 12px", fontSize: 13 }} className="fr" />
            <p className="meta" style={{ fontSize: 12, margin: "7px 0 0" }}>sotaycuamay.com/{post ? post.slug : "…"}</p>
          </RailSec>
          <RailSec title="Mô tả ngắn">
            <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} placeholder="Tóm tắt hiển thị ở trang chủ…" style={{ ...inputStyle, padding: "9px 12px", fontSize: 13, resize: "vertical", lineHeight: 1.5 }} className="fr" />
          </RailSec>
          <RailSec title="Chủ đề">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {Object.entries(tags).map(([slug, label]) => {
                const on = selTags.includes(slug);
                return (
                  <button key={slug} onClick={() => setSelTags(on ? selTags.filter((t) => t !== slug) : [...selTags, slug])} className="fr"
                    style={{ padding: "6px 12px", fontFamily: "var(--sans)", fontSize: 12.5, borderRadius: 99, cursor: "pointer",
                      background: on ? "var(--accent)" : "var(--surface-2)", color: on ? "#fff" : "var(--ink-2)", border: "1px solid " + (on ? "var(--accent)" : "var(--hairline)") }}>
                    {on && "✓ "}{label}
                  </button>
                );
              })}
            </div>
          </RailSec>
          <RailSec title="Tông màu ảnh bìa">
            <input type="range" min="0" max="340" value={hue} onChange={(e) => setHue(+e.target.value)} style={{ width: "100%", accentColor: "var(--accent)" }} />
            <div style={{ height: 8, borderRadius: 99, marginTop: 8, background: "linear-gradient(90deg, oklch(0.7 0.12 0), oklch(0.7 0.12 60), oklch(0.7 0.12 150), oklch(0.7 0.12 240), oklch(0.7 0.12 320))" }} />
          </RailSec>
        </div>
      </div>
    </div>
  );
}
function RailSec({ title, children }) {
  return (
    <div>
      <h4 style={{ margin: "0 0 11px", fontFamily: "var(--sans)", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-3)" }}>{title}</h4>
      {children}
    </div>
  );
}

// ---------- Settings ----------
function Settings() {
  const site = window.BLOG.site;
  return (
    <div style={{ padding: "32px 40px 60px", maxWidth: 680 }}>
      <PageHead title="Cài đặt" sub="Thông tin chung của blog." />
      <div style={{ background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)", padding: 28 }}>
        <Field label="Tên blog"><input defaultValue={site.title} style={inputStyle} className="fr" /></Field>
        <Field label="Tagline"><input defaultValue={site.tagline} style={inputStyle} className="fr" /></Field>
        <Field label="Tên tác giả"><input defaultValue={site.author} style={inputStyle} className="fr" /></Field>
        <Field label="Giới thiệu tác giả"><textarea defaultValue={site.authorBio} rows={4} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }} className="fr" /></Field>
        <Field label="Email liên hệ"><input defaultValue={site.email} style={inputStyle} className="fr" /></Field>
        <button className="fr" style={{ ...primaryBtn, marginTop: 6 }}><Icon name="save" size={16} /> Lưu thay đổi</button>
      </div>
    </div>
  );
}

// ---------- Comments moderation ----------
function CommentStatusBadge({ status }) {
  const map = {
    visible: { bg: "oklch(0.93 0.05 150)", fg: "oklch(0.42 0.1 150)", t: "Hiển thị" },
    pending: { bg: "oklch(0.94 0.06 75)", fg: "oklch(0.48 0.11 70)", t: "Chờ duyệt" },
    spam: { bg: "oklch(0.93 0.04 25)", fg: "oklch(0.5 0.13 25)", t: "Spam" },
  };
  const s = map[status] || map.pending;
  return <span style={{ padding: "3px 10px", borderRadius: 99, fontFamily: "var(--sans)", fontSize: 11.5, fontWeight: 600, background: s.bg, color: s.fg, flexShrink: 0 }}>{s.t}</span>;
}
function ModBtn({ onClick, icon, children, danger }) {
  return (
    <button onClick={onClick} className="fr" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 12px", background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: 8, fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, color: danger ? "var(--accent)" : "var(--ink-2)" }}>
      {icon && <Icon name={icon} size={14} />} {children}
    </button>
  );
}
function CommentsModeration({ comments, posts, onModerate, onDelete }) {
  const [filter, setFilter] = useState("all");
  const titleOf = (slug) => (posts.find((p) => p.slug === slug) || {}).title || slug;

  const rows = [];
  Object.entries(comments).forEach(([slug, list]) => {
    (list || []).forEach((c) => {
      rows.push({ slug, c, parentId: null });
      (c.replies || []).forEach((r) => rows.push({ slug, c: r, parentId: c.id, replyTo: c.name }));
    });
  });
  const counts = {
    all: rows.length,
    pending: rows.filter((r) => r.c.status === "pending").length,
    visible: rows.filter((r) => r.c.status === "visible").length,
    spam: rows.filter((r) => r.c.status === "spam").length,
  };
  const filtered = rows.filter((r) => filter === "all" || r.c.status === filter).sort((a, b) => b.c.date.localeCompare(a.c.date));
  const tabs = [
    { k: "all", t: "Tất cả" },
    { k: "pending", t: "Chờ duyệt" },
    { k: "visible", t: "Hiển thị" },
    { k: "spam", t: "Spam" },
  ];

  return (
    <div style={{ padding: "32px 40px 60px", maxWidth: 1080 }}>
      <PageHead title="Bình luận" sub={`${counts.all} bình luận · ${counts.pending} chờ duyệt`} />
      <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: "1px solid var(--hairline)" }}>
        {tabs.map((t) => (
          <button key={t.k} onClick={() => setFilter(t.k)} className="fr"
            style={{ padding: "10px 14px", background: "none", border: "none", borderBottom: filter === t.k ? "2px solid var(--accent)" : "2px solid transparent", marginBottom: -1, fontFamily: "var(--sans)", fontSize: 14, fontWeight: filter === t.k ? 600 : 450, color: filter === t.k ? "var(--ink)" : "var(--ink-3)" }}>
            {t.t} <span style={{ color: t.k === "pending" && counts.pending > 0 ? "var(--accent)" : "var(--ink-3)", fontWeight: 600 }}>{counts[t.k]}</span>
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {filtered.map(({ slug, c, parentId, replyTo }) => {
          const hue = avatarColorAdmin(c.name);
          return (
            <div key={c.id} style={{ display: "flex", gap: 14, padding: 18, marginLeft: parentId ? 36 : 0, background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ width: 42, height: 42, flexShrink: 0, borderRadius: 99, display: "grid", placeItems: "center", color: "#fff", fontFamily: "var(--serif)", fontSize: 18, background: c.author ? "var(--accent)" : `linear-gradient(135deg, oklch(0.78 0.09 ${hue}), oklch(0.6 0.11 ${hue}))` }}>{c.name.trim().charAt(0).toUpperCase()}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 5, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "var(--sans)", fontSize: 14.5, fontWeight: 600 }}>{c.name}</span>
                  {c.author && <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--accent-ink)", background: "var(--accent-soft)", padding: "2px 7px", borderRadius: 99 }}>Tác giả</span>}
                  <CommentStatusBadge status={c.status} />
                  <span className="meta" style={{ fontSize: 12.5 }}>{fmtDateShort(c.date)}</span>
                  <span className="meta" style={{ fontSize: 12.5, display: "inline-flex", alignItems: "center", gap: 4 }}><Icon name="heart" size={12} /> {c.likes}</span>
                </div>
                <p style={{ margin: "0 0 10px", fontFamily: "var(--serif)", fontSize: 15.5, lineHeight: 1.55, color: "var(--ink)" }}>
                  {parentId && <span className="meta" style={{ fontSize: 12.5, marginRight: 6 }}>↳ trả lời {replyTo}:</span>}
                  {c.text}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span className="meta" style={{ fontSize: 12.5, marginRight: 4 }}>{titleOf(slug)}</span>
                  {c.status !== "visible" && <ModBtn icon="check" onClick={() => onModerate(slug, c.id, "visible", parentId)}>Duyệt</ModBtn>}
                  {c.status === "visible" && <ModBtn icon="eye" onClick={() => onModerate(slug, c.id, "pending", parentId)}>Ẩn</ModBtn>}
                  {c.status !== "spam" && <ModBtn onClick={() => onModerate(slug, c.id, "spam", parentId)}>Spam</ModBtn>}
                  <ModBtn icon="trash" danger onClick={() => { if (confirm("Xóa bình luận này?")) onDelete(slug, c.id, parentId); }}>Xóa</ModBtn>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <div style={{ padding: 50, textAlign: "center", color: "var(--ink-3)", fontFamily: "var(--sans)", fontSize: 14, background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)" }}>Không có bình luận nào ở mục này.</div>}
      </div>
    </div>
  );
}
const ADMIN_HUES = [18, 150, 210, 280, 45, 330, 100];
function avatarColorAdmin(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h + name.charCodeAt(i)) % ADMIN_HUES.length;
  return ADMIN_HUES[h];
}

Object.assign(window, { AdminLogin, AdminShell, Dashboard, PostsList, Editor, Settings, StatusBadge, CommentsModeration });
