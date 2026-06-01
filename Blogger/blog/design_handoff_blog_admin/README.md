# Bàn giao: Blog cá nhân "Sổ Tay Của Mây" + Trang quản trị

> Tài liệu này đủ để một lập trình viên (hoặc Claude Code) dựng lại sản phẩm hoàn chỉnh mà **không cần** tham gia cuộc trò chuyện gốc.

---

## 1. Tổng quan

Một **blog cá nhân theo phong cách tản văn/nhật ký** (lấy cảm hứng từ blog Blogger của người dùng) gồm 2 phần:

- **Trang công khai** — cho người đọc: trang chủ, chi tiết bài viết, trang theo chủ đề, giới thiệu tác giả, tìm kiếm, và **bình luận của khách** (có trả lời lồng nhau + lượt tim).
- **Trang quản trị** (có mật khẩu) — cho tác giả: tổng quan, quản lý bài, trình soạn thảo rich-text, **kiểm duyệt bình luận**, cài đặt.

Ngôn ngữ giao diện: **Tiếng Việt**.

---

## 2. Về các file thiết kế trong gói này

Các file HTML/JSX/CSS kèm theo là **bản tham chiếu thiết kế** (design reference) — prototype thể hiện **giao diện và hành vi mong muốn**, **không phải** mã production để copy nguyên xi.

Nhiệm vụ: **dựng lại các thiết kế này trong môi trường của codebase đích** theo các pattern/thư viện sẵn có. Nếu chưa có codebase, hãy chọn framework phù hợp nhất (khuyến nghị bên dưới) và hiện thực thiết kế ở đó.

Prototype hiện viết bằng React + Babel chạy thẳng trong trình duyệt (cho mục đích minh hoạ). **Không** dùng kiến trúc này cho production.

---

## 3. Độ chi tiết (Fidelity)

**High-fidelity (hi-fi).** Màu sắc, typography, khoảng cách, bo góc, bóng đổ và tương tác đều là bản cuối. Hãy tái tạo **chính xác từng pixel** bằng thư viện/pattern của codebase đích. Mọi giá trị token nằm ở mục 8.

---

## 4. Công nghệ đề xuất

| Hạng mục | Đề xuất |
|---|---|
| Framework | **Next.js (App Router) + TypeScript** |
| CSS | Tailwind (map theo token ở mục 8) hoặc CSS variables |
| Database | Postgres + Prisma (hoặc Supabase) |
| Xác thực | Auth.js (NextAuth) hoặc Lucia — single-author |
| Rich-text editor | **Tiptap** hoặc **Lexical** (thay cho `contentEditable` thô của prototype) |
| Upload ảnh | Cloudinary / UploadThing / S3 |
| Fonts | Google Fonts: **Noto Serif** (serif) + **Be Vietnam Pro** (sans) |

> ⚠️ **Lưu ý font tiếng Việt:** dùng font có bộ glyph tiếng Việt đầy đủ (precomposed). **Noto Serif** và **Be Vietnam Pro** đều đạt. Tránh để chuỗi fallback rơi vào font hệ thống thiếu glyph (gây dấu thanh bị tách rời). Trong prototype, biến `--serif` chỉ khai báo đúng 1 font, không kèm `Georgia/serif` để buộc tải đúng subset.

---

## 5. Sơ đồ trang & Route

| Route | Trang | Quyền | Ghi chú |
|---|---|---|---|
| `/` | Trang chủ | Công khai | Bài nổi bật + feed + sidebar. Bố cục list/grid. |
| `/bai-viet/[slug]` | Chi tiết bài | Công khai | Nội dung, tác giả, tag, bài liên quan, bình luận. Tăng `views`. |
| `/chu-de/[tag]` | Theo chủ đề | Công khai | Lọc bài theo tag. |
| `/gioi-thieu` | Về tôi | Công khai | Tiểu sử + email liên hệ. |
| `/admin/login` | Đăng nhập | Khách | Chuyển hướng nếu đã đăng nhập. |
| `/admin` | Tổng quan | Bảo vệ | Thống kê + bài gần đây. |
| `/admin/posts` | Quản lý bài | Bảo vệ | Bảng + lọc trạng thái + sửa/xóa. |
| `/admin/posts/new`, `/admin/posts/[id]/edit` | Soạn thảo | Bảo vệ | Editor + rail cài đặt bài. |
| `/admin/comments` | Kiểm duyệt bình luận | Bảo vệ | Tab + Duyệt/Ẩn/Spam/Xóa. |
| `/admin/settings` | Cài đặt | Bảo vệ | Tên blog, tagline, tiểu sử. |

---

## 6. Các màn hình (chi tiết)

### 6.1 Trang chủ (`/`)
- **Masthead** căn giữa trên nền `--surface`, viền dưới `--hairline`: eyebrow ("NHẬT KÝ · TẢN VĂN · ĐỜI THƯỜNG", 11.5px, uppercase, letter-spacing .14em, màu `--accent-ink`), tiêu đề blog (serif, 46px, line-height 1.08), tagline (serif italic, 19px, `--ink-2`).
- **Lưới chính:** `grid-template-columns: 1fr 312px` (khi bật sidebar), gap 56px, max-width 1180px, padding 46px 28px 80px.
- **Bài nổi bật:** các bài `featured`, lưới 2 cột (gap 40), mỗi card: ảnh bìa 16:9, eyebrow tag + ngày, tiêu đề serif 30px, excerpt serif 18px `--ink-2`, meta (phút đọc + lượt xem).
- **Feed gần đây:** mặc định **list** — mỗi item `grid 1fr 168px` (nội dung trái, ảnh 4:3 phải), viền dưới `--hairline-2`. Tuỳ chọn **grid** 2 cột.
- **Sidebar:** 4 thẻ (card nền `--surface`, viền `--hairline`, radius 12, padding 22): (1) Tác giả + bio + link, (2) "Được đọc nhiều" (top 4 theo views, số thứ tự serif màu accent), (3) "Chủ đề" (chip bo tròn), (4) "Lưu trữ" (theo tháng).

### 6.2 Chi tiết bài (`/bai-viet/[slug]`)
- Header căn giữa, max-width 760: nút "← Tất cả bài viết", tag (eyebrow), tiêu đề serif 42px, hàng meta (avatar tròn 38, tên tác giả, ngày, phút đọc) + viền dưới.
- Ảnh bìa lớn (max-width 920, tỉ lệ ~16:8).
- **Thân bài** max-width 680: đoạn văn serif 19px line-height 1.72; `h2` serif 27px; `blockquote` viền trái 3px `--accent`, italic 22px.
- Cuối bài: hàng tag (chip), hộp tác giả (avatar 56 + bio), rồi **khu bình luận** (mục 6.6).
- "Có thể bạn thích": 3 bài cùng tag, lưới 3 cột, nền `--surface`.

### 6.3 Trang chủ đề (`/chu-de/[tag]`)
- Eyebrow "Chủ đề" + tên chủ đề (serif 40px) + số bài. Danh sách bài kiểu row. Có sidebar tuỳ chọn.

### 6.4 Về tôi (`/gioi-thieu`)
- Max-width 680: avatar 88, eyebrow, tiêu đề 40px, 3 đoạn serif 20px, nút email (nền `--accent`, bo tròn).

### 6.5 Tìm kiếm (overlay)
- Mở bằng nút kính lúp ở header. Overlay nền mờ (`rgba(38,33,27,.32)` + blur), hộp giữa 620px: ô input lớn + nút "Esc", kết quả lọc theo title/excerpt (ảnh thumbnail 4:3 + tiêu đề + ngày). Auto-focus input.

### 6.6 Bình luận của khách (cuối mỗi bài)
- Tiêu đề "Bình luận (N)" — **N = tổng comment + reply ở trạng thái `visible`**.
- **Form (không cần đăng nhập):** ô "Tên của bạn" + textarea "Viết bình luận…" + nút "Gửi bình luận" (nền accent, icon máy bay giấy). Validation: bắt buộc tên + nội dung; nếu thiếu → viền ô chuyển `--accent` và hiện "Vui lòng nhập tên và nội dung."
- **Mỗi bình luận:** avatar tròn (gradient theo tên, chữ cái đầu; nếu là tác giả → nền `--accent` + nhãn "TÁC GIẢ"), tên (sans 14.5 600), ngày, nội dung serif 16.5.
  - **Nút tim (like):** icon trái tim + số đếm. Khi đã thích: icon **fill** + chữ màu `--accent`; khi chưa: viền rỗng, màu `--ink-3`. Bấm để toggle (±1).
  - **Nút "Trả lời":** mở form trả lời ngay dưới (nền `--surface-2`, ô tên + textarea + Gửi/Hủy).
- **Trả lời lồng nhau (1 cấp):** hiển thị thụt vào, có vạch dọc trái `--hairline-2`. Avatar nhỏ hơn (36 vs 42). Reply cũng có nút tim. Reply **không** có nút "Trả lời" (chỉ lồng 1 cấp).
- Chỉ hiển thị comment/reply có `status === "visible"`. Comment mới của khách mặc định `visible` (xem mục 9 để bàn về luồng kiểm duyệt thật).

### 6.7 Admin — Đăng nhập (`/admin/login`)
- 2 cột: trái form (logo, "Chào mừng trở lại", ô Email + Mật khẩu, nút "Đăng nhập", link "← Về trang blog"); phải panel gradient accent + câu trích dẫn.

### 6.8 Admin — Shell (khung)
- Sidebar trái 248px (sticky, cao 100vh): logo, nút "+ Viết bài mới" (accent), nav (Tổng quan / Bài viết / **Bình luận** kèm **badge số chờ duyệt** / Cài đặt), dưới cùng "Xem trang blog" + "Đăng xuất". Mục active: nền `--accent-soft`, chữ `--accent-ink`.

### 6.9 Admin — Tổng quan (`/admin`)
- 4 thẻ thống kê (Bài đã đăng / Bản nháp / Tổng lượt xem / Chủ đề) — mỗi thẻ icon trong ô bo tròn `--accent-soft`, số serif 32px. Bên dưới: danh sách 4 bài gần đây (ảnh thumbnail + tiêu đề + meta + badge trạng thái).

### 6.10 Admin — Quản lý bài (`/admin/posts`)
- Header + nút "Viết bài mới". Tab lọc: Tất cả / Đã đăng / Nháp (gạch chân accent khi active). Mỗi dòng: ảnh 64 (4:3), tiêu đề serif, meta (ngày + lượt xem + tag chip), badge trạng thái, nút Sửa + Xóa.

### 6.11 Admin — Soạn thảo (`/admin/posts/new|edit`)
- Thanh trên sticky: "← Hủy/Quay lại", "Lưu nháp", "Xuất bản" (+ hiện "Đã lưu" thoáng qua).
- Cột trái (max 720): input tiêu đề (serif 38), ảnh bìa + nút "Tải ảnh bìa" + ô chú thích, **toolbar nổi sticky** (Đậm, Nghiêng, | , Tiêu đề H2, Trích dẫn, Danh sách, Liên kết, | , Chèn ảnh), vùng soạn thảo rich-text.
- Rail phải 304px (sticky): Trạng thái, Đường dẫn (slug) + preview URL, Mô tả ngắn, Chủ đề (chip chọn nhiều, chọn → nền accent + dấu ✓), thanh trượt "Tông màu ảnh bìa" (0–340, đổi `coverHue`).

### 6.12 Admin — Kiểm duyệt bình luận (`/admin/comments`)
- Tiêu đề + sub ("N bình luận · M chờ duyệt"). **Tab:** Tất cả / Chờ duyệt / Hiển thị / Spam (kèm số đếm; số "Chờ duyệt" tô accent khi > 0).
- Mỗi bình luận = một thẻ (gồm cả reply, reply thụt vào 36px): avatar, tên, nhãn "TÁC GIẢ" nếu là tác giả, **badge trạng thái** (Hiển thị/Chờ duyệt/Spam), ngày, số tim, nội dung (reply có tiền tố "↳ trả lời {tên}:"), tên bài viết, và **các nút thao tác theo trạng thái:**
  - `pending` → **Duyệt** (→visible), **Spam**, **Xóa**
  - `visible` → **Ẩn** (→pending), **Spam**, **Xóa**
  - `spam` → **Duyệt** (khôi phục →visible), **Xóa**
- Badge số ở sidebar = số bình luận `pending`.

---

## 7. Tương tác & Hành vi

- **Điều hướng công khai:** click card → trang chi tiết (scroll lên đầu). Tag/eyebrow → trang chủ đề. Header có nav + nút tìm kiếm.
- **Like:** toggle lạc quan (optimistic), cập nhật số ngay; icon đổi fill + màu accent.
- **Trả lời:** mở/đóng form inline; gửi xong thêm reply vào danh sách, reset & đóng form.
- **Kiểm duyệt:** đổi `status` cập nhật tab/đếm ngay; "Xóa" có `confirm()`.
- **Editor:** toolbar dùng định dạng inline (đậm/nghiêng/heading/quote/list/link); ảnh sẽ upload ở bản thật. "Lưu nháp"/"Xuất bản" đặt `status`.
- **Animation:** entrance "fadeUp" 0.5s ease-out (chỉ dịch chuyển Y, **opacity giữ ở 1** để không ẩn nội dung nếu animation bị throttle); tôn trọng `prefers-reduced-motion`.
- **Tweaks (chỉ trong prototype, không cần port):** panel đổi màu/font/bố cục/sidebar — chỉ phục vụ demo.

---

## 8. Design tokens

```css
/* màu — mặc định "clay" */
--paper:      #FBF7F1;  /* nền trang */
--surface:    #FFFFFF;  /* thẻ, panel */
--surface-2:  #F4EEE4;  /* nền chìm / hover */
--ink:        #26211B;  /* chữ chính */
--ink-2:      #6B6055;  /* chữ phụ */
--ink-3:      #9A8E7F;  /* chữ mờ / meta */
--hairline:   #E7DDCE;  /* viền */
--hairline-2: #F0E9DC;
--accent:     #BC5B3A;  /* clay / terracotta */
--accent-ink: #9C462A;  /* clay đậm (chữ trên nền sáng) */
--accent-soft:#F0DDD2;  /* tint */

/* typography */
--serif: "Noto Serif";                 /* tiêu đề + thân bài */
--sans:  "Be Vietnam Pro", system-ui;  /* giao diện, meta, admin */

/* scale */
--content-max: 720px;   /* đo dòng bài viết (~680px nội dung) */
--shell-max:   1180px;  /* khung trang */
--radius:      6px;     /* nút, ảnh */
--radius-lg:   12px;    /* thẻ, panel */

/* shadow */
--shadow-sm: 0 1px 2px rgba(38,33,27,.04), 0 1px 3px rgba(38,33,27,.06);
--shadow-md: 0 4px 16px rgba(38,33,27,.08), 0 1px 4px rgba(38,33,27,.05);
--shadow-lg: 0 16px 48px rgba(38,33,27,.14);
```

**Bảng màu thay thế** (tuỳ chọn cho người dùng): sage `#3F6B52`, indigo `#4A5B8C`, amber `#9A6A3C`, plum `#7C4A66` (mỗi bảng gồm accent / accent-ink / accent-soft).

**Quy mô chữ:** tiêu đề trang 40–46px · tiêu đề bài 42px · h2 27px · thân bài 19px/1.72 · meta 13px · eyebrow 11.5px uppercase.

---

## 9. Mô hình dữ liệu

```
Post {
  id            string (uuid)
  slug          string  unique          // "tuoi-ham-hai"
  title         string
  excerpt       string                  // mô tả ngắn (hiện ở feed)
  body          richtext (HTML/JSON)    // nội dung
  coverImageUrl string?                 // ảnh bìa đã upload
  coverHue      int                     // màu nền dự phòng khi chưa có ảnh
  status        enum(draft|published)
  tags          Tag[]                   // nhiều-nhiều
  readMins      int                     // tự tính từ độ dài
  views         int     default 0
  featured      bool    default false
  authorId      string  -> User
  publishedAt   datetime?
  createdAt, updatedAt  datetime
}

Tag  { id, slug unique, name }          // "gia-dinh" -> "Gia đình"

Comment {
  id        string
  postId    string  -> Post
  parentId  string?  -> Comment          // null = gốc; có giá trị = trả lời (lồng 1 cấp)
  name      string                       // tên khách (bắt buộc)
  email     string?                       // tuỳ chọn, không hiển thị
  text      string
  likes     int     default 0            // lượt tim
  status    enum(visible|pending|spam)   // kiểm duyệt
  createdAt datetime
}
// Lượt tim của khách ẩn danh: nên có bảng CommentLike(commentId, visitorId)
// để chống tim trùng. Prototype lưu cờ `liked` phía client.

User { id, email unique, passwordHash, name, bio, avatarUrl }

SiteSettings { title, tagline, authorName, authorBio, contactEmail }
```

**Luồng kiểm duyệt khuyến nghị cho bản thật:** bình luận mới của khách → mặc định `pending` (chờ duyệt), ẩn khỏi công khai cho đến khi tác giả duyệt; người vừa gửi thấy trạng thái "đang chờ duyệt". (Prototype để mặc định `visible` cho dễ demo.) Thêm chống spam: honeypot + rate-limit; có thể tích hợp Akismet.

---

## 10. Assets

- **Ảnh bìa:** prototype dùng **placeholder gradient** sinh theo `coverHue` (duotone ấm + grain SVG). Bản thật thay bằng ảnh upload thực; giữ `coverHue` làm nền dự phòng.
- **Avatar:** sinh từ chữ cái đầu của tên trên nền gradient (hue hash theo tên). Tác giả dùng nền `--accent`.
- **Icon:** bộ icon stroke 1.6 tự vẽ (search, heart, edit, trash, send, quote, eye, tag, ...). Có thể thay bằng Lucide cho tương đương.
- **Logo:** mark SVG (sổ tay mở) nền `--accent`. Thay bằng logo thật nếu có.
- Không dùng ảnh nhị phân ngoài nào; toàn bộ là CSS/SVG.

---

## 11. Files trong gói

| File | Vai trò |
|---|---|
| `Sổ Tay Của Mây.html` | Prototype chạy được (mở bằng trình duyệt; bấm "Trang quản trị" ở footer để vào admin) |
| `Bàn giao cho Claude Code.html` | Bản đặc tả dạng HTML có định dạng đẹp (xem nhanh) |
| `styles.css` | Design tokens + base styles (copy `--*` sang dự án thật) |
| `data.js` | Dữ liệu mẫu — phản ánh cấu trúc Post / Tag / Comment |
| `helpers.jsx` | Icon set, ảnh bìa placeholder, hàm format ngày/lượt xem |
| `public.jsx` | UI trang công khai (header, feed, sidebar, chi tiết, bình luận + reply + like, tìm kiếm) |
| `admin.jsx` | UI quản trị (login, shell, dashboard, quản lý bài, editor, kiểm duyệt bình luận, settings) |
| `app.jsx` | Routing + quản lý state + handlers (comment/reply/like/moderate) + Tweaks |

> Mở `Sổ Tay Của Mây.html` để xem mọi màn hình. Tài khoản đăng nhập là mô phỏng — bấm "Đăng nhập" là vào.
