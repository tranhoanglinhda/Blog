/* ============================================================
   App — mode/routing + Tweaks
   ============================================================ */

// normalize all sample text to NFC so Vietnamese diacritics compose correctly
(function () {
  const nfc = (o) =>
    typeof o === "string" ? o.normalize("NFC")
    : Array.isArray(o) ? o.map(nfc)
    : o && typeof o === "object" ? Object.fromEntries(Object.entries(o).map(([k, v]) => [k, nfc(v)]))
    : o;
  window.BLOG = nfc(window.BLOG);
})();

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": ["#BC5B3A", "#9C462A", "#F0DDD2"],
  "paper": "#FBF7F1",
  "serif": "Noto Serif",
  "sans": "Be Vietnam Pro",
  "contentWidth": 720,
  "homeLayout": "list",
  "showSidebar": true
}/*EDITMODE-END*/;

const PALETTES = [
  ["#BC5B3A", "#9C462A", "#F0DDD2"], // clay (default)
  ["#3F6B52", "#2F523E", "#D9E5DC"], // sage
  ["#4A5B8C", "#36456E", "#DCE0EE"], // indigo dusk
  ["#9A6A3C", "#7C5226", "#EFE2CE"], // amber
  ["#7C4A66", "#5F3650", "#EBDAE4"], // plum
];
const PAPERS = ["#FBF7F1", "#FAF9F6", "#FFFFFF", "#F6F2EA"];
const SERIFS = ["Noto Serif", "Lora", "Spectral", "Bitter"];
const SANS = ["Be Vietnam Pro", "Hanken Grotesk", "Public Sans"];

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // mode + routing (persisted)
  const [mode, setMode] = useState(() => localStorage.getItem("blog_mode") || "public");
  const [route, setRoute] = useState(() => localStorage.getItem("blog_route") || "home");
  const [current, setCurrent] = useState(null);
  const [search, setSearch] = useState(false);
  const [posts, setPosts] = useState(window.BLOG.posts);
  const [comments, setComments] = useState(() => window.BLOG.comments || {});

  const addComment = (slug, c) => {
    setComments((prev) => ({ ...prev, [slug]: [...(prev[slug] || []), c] }));
  };
  const addReply = (slug, parentId, r) => {
    setComments((prev) => ({
      ...prev,
      [slug]: (prev[slug] || []).map((c) => c.id === parentId ? { ...c, replies: [...(c.replies || []), r] } : c),
    }));
  };
  const toggleLike = (slug, id, parentId) => {
    const flip = (x) => ({ ...x, liked: !x.liked, likes: x.likes + (x.liked ? -1 : 1) });
    setComments((prev) => ({
      ...prev,
      [slug]: (prev[slug] || []).map((c) => {
        if (parentId) return c.id === parentId ? { ...c, replies: c.replies.map((r) => r.id === id ? flip(r) : r) } : c;
        return c.id === id ? flip(c) : c;
      }),
    }));
  };
  const moderate = (slug, id, status, parentId) => {
    setComments((prev) => ({
      ...prev,
      [slug]: (prev[slug] || []).map((c) => {
        if (parentId) return c.id === parentId ? { ...c, replies: c.replies.map((r) => r.id === id ? { ...r, status } : r) } : c;
        return c.id === id ? { ...c, status } : c;
      }),
    }));
  };
  const removeComment = (slug, id, parentId) => {
    setComments((prev) => ({
      ...prev,
      [slug]: parentId
        ? (prev[slug] || []).map((c) => c.id === parentId ? { ...c, replies: c.replies.filter((r) => r.id !== id) } : c)
        : (prev[slug] || []).filter((c) => c.id !== id),
    }));
  };
  const pendingCount = Object.values(comments).flat().filter((c) => c.status === "pending").length;

  // admin state
  const [authed, setAuthed] = useState(false);
  const [adminView, setAdminView] = useState("dashboard");
  const [editing, setEditing] = useState(null);

  useEffect(() => { localStorage.setItem("blog_mode", mode); }, [mode]);
  useEffect(() => { localStorage.setItem("blog_route", route); }, [route]);

  // apply tweaks -> CSS vars
  useEffect(() => {
    const r = document.documentElement.style;
    const [accent, accentInk, soft] = t.palette;
    r.setProperty("--accent", accent);
    r.setProperty("--accent-ink", accentInk);
    r.setProperty("--accent-soft", soft);
    r.setProperty("--paper", t.paper);
    r.setProperty("--serif", `"${t.serif}"`);
    r.setProperty("--sans", `"${t.sans}", system-ui, sans-serif`);
    r.setProperty("--content-max", t.contentWidth + "px");
  }, [t]);

  const openPost = (p) => { setCurrent(p); setRoute("post"); window.scrollTo(0, 0); };
  const nav = (k) => { setSearch(false); if (k.startsWith("tag:")) { setRoute(k); } else { setRoute(k); window.scrollTo(0, 0); } };

  // ----- ADMIN -----
  if (mode === "admin") {
    if (!authed) return (<><AdminLogin onLogin={() => setAuthed(true)} onBack={() => setMode("public")} /><TweaksUI t={t} setTweak={setTweak} /></>);
    let content;
    if (adminView === "dashboard") content = <Dashboard posts={posts} onView={setAdminView} onEdit={(p) => { setEditing(p); setAdminView("editor"); }} />;
    else if (adminView === "posts") content = <PostsList posts={posts} onView={(v) => { setEditing(null); setAdminView(v); }} onEdit={(p) => { setEditing(p); setAdminView("editor"); }} onDelete={(p) => { if (confirm(`Xóa bài "${p.title}"?`)) setPosts(posts.filter((x) => x.id !== p.id)); }} />;
    else if (adminView === "editor") content = <Editor post={editing} onCancel={() => setAdminView("posts")} onView={setAdminView} onSave={() => setAdminView("posts")} />;
    else if (adminView === "comments") content = <CommentsModeration comments={comments} posts={posts} onModerate={moderate} onDelete={removeComment} />;
    else if (adminView === "settings") content = <Settings />;
    return (
      <>
        <AdminShell view={adminView} pendingCount={pendingCount} onView={(v) => { if (v === "editor") setEditing(null); setAdminView(v); }} onLogout={() => { setAuthed(false); }} onExit={() => setMode("public")}>
          {content}
        </AdminShell>
        <TweaksUI t={t} setTweak={setTweak} />
      </>
    );
  }

  // ----- PUBLIC -----
  let view;
  if (route === "post" && current) view = <PostDetail post={current} posts={posts} onOpen={openPost} onNav={nav} comments={comments[current.slug] || []} onAddComment={(c) => addComment(current.slug, c)} onAddReply={(pid, r) => addReply(current.slug, pid, r)} onToggleLike={(id, pid) => toggleLike(current.slug, id, pid)} />;
  else if (route.startsWith("tag:")) view = <TagPage slug={route.slice(4)} posts={posts} onOpen={openPost} onNav={nav} showSidebar={t.showSidebar} />;
  else if (route === "about") view = <AboutPage />;
  else view = <HomeFeed posts={posts} onOpen={openPost} onNav={nav} showSidebar={t.showSidebar} homeLayout={t.homeLayout} />;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <PublicHeader route={route} onNav={nav} onSearch={() => setSearch(true)} />
      <div style={{ flex: 1 }}>{view}</div>
      <PublicFooter onNav={nav} onEnterAdmin={() => setMode("admin")} />
      {search && <SearchOverlay posts={posts} onClose={() => setSearch(false)} onOpen={openPost} />}
      <TweaksUI t={t} setTweak={setTweak} />
    </div>
  );
}

// ----- Tweaks panel UI -----
function TweaksUI({ t, setTweak }) {
  return (
    <TweaksPanel>
      <TweakSection label="Màu sắc" />
      <TweakColor label="Tông chủ đạo" value={t.palette} options={PALETTES} onChange={(v) => setTweak("palette", v)} />
      <TweakColor label="Nền giấy" value={t.paper} options={PAPERS} onChange={(v) => setTweak("paper", v)} />
      <TweakSection label="Kiểu chữ" />
      <TweakSelect label="Chữ tiêu đề (serif)" value={t.serif} options={SERIFS} onChange={(v) => setTweak("serif", v)} />
      <TweakSelect label="Chữ giao diện (sans)" value={t.sans} options={SANS} onChange={(v) => setTweak("sans", v)} />
      <TweakSection label="Bố cục" />
      <TweakRadio label="Trang chủ" value={t.homeLayout} options={["list", "grid"]} onChange={(v) => setTweak("homeLayout", v)} />
      <TweakToggle label="Hiện sidebar" value={t.showSidebar} onChange={(v) => setTweak("showSidebar", v)} />
      <TweakSlider label="Độ rộng nội dung" value={t.contentWidth} min={620} max={820} step={20} unit="px" onChange={(v) => setTweak("contentWidth", v)} />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
