"use client";
import React, { useEffect, useState } from "react";
import { Icon } from "@/components/ui";
import { getBooks } from "@/lib/repo";
import { Loading } from "./HomeView";
import type { Book } from "@/lib/types";

function BookCard({ book }: { book: Book }) {
  return (
    <div className="fr" style={{ display: "flex", flexDirection: "column", background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
      <div style={{ aspectRatio: "3 / 4", background: book.coverImageUrl ? `center / cover no-repeat url(${book.coverImageUrl})` : "linear-gradient(135deg, oklch(0.82 0.07 40), oklch(0.6 0.1 28))", display: "grid", placeItems: "center", color: "rgba(255,255,255,0.85)" }}>
        {!book.coverImageUrl && <Icon name="book" size={40} />}
      </div>
      <div style={{ padding: "18px 18px 20px", display: "flex", flexDirection: "column", flex: 1 }}>
        <h3 style={{ margin: "0 0 8px", fontFamily: "var(--serif)", fontSize: 19, lineHeight: 1.3, color: "var(--ink)" }}>{book.title}</h3>
        {book.note && <p style={{ margin: "0 0 18px", fontFamily: "var(--serif)", fontSize: 15, lineHeight: 1.6, color: "var(--ink-2)" }}>{book.note}</p>}
        <a
          href={book.productUrl}
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          className="fr"
          style={{ marginTop: "auto", alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 18px", background: "var(--accent)", color: "#fff", borderRadius: 99, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600 }}
        >
          Tìm đọc cuốn này <Icon name="arrow" size={15} />
        </a>
      </div>
    </div>
  );
}

export default function BooksView() {
  const [books, setBooks] = useState<Book[] | null>(null);
  useEffect(() => { getBooks().then(setBooks); }, []);
  if (!books) return <Loading />;

  return (
    <div className="pub-pad" style={{ maxWidth: "var(--shell-max)", margin: "0 auto", padding: "64px 28px 90px" }}>
      <div style={{ maxWidth: 680, marginBottom: 44 }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>Sách mình đọc</div>
        <h1 className="page-h1" style={{ margin: "0 0 16px", fontSize: 40, lineHeight: 1.1 }}>Những cuốn sách mình thương</h1>
        <p style={{ margin: 0, fontFamily: "var(--serif)", fontSize: 19, lineHeight: 1.7, color: "var(--ink-2)" }}>
          Vài cuốn đã đi cùng mình qua những buổi sáng và đêm khuya. Nếu bạn muốn tìm đọc, bấm vào nút bên dưới mỗi cuốn nhé.
        </p>
      </div>

      {books.length === 0 ? (
        <div style={{ padding: 60, textAlign: "center", color: "var(--ink-3)", fontFamily: "var(--sans)", fontSize: 15 }}>Mình đang sắp xếp lại kệ sách, bạn quay lại sau nhé.</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 24 }}>
          {books.map((b) => <BookCard key={b.id} book={b} />)}
        </div>
      )}

      <p className="meta" style={{ fontSize: 12.5, marginTop: 40, textAlign: "center" }}>
        Một số liên kết là liên kết tiếp thị — nếu bạn mua sách qua đó, mình có thể nhận một khoản hoa hồng nhỏ mà không làm bạn tốn thêm đồng nào.
      </p>
    </div>
  );
}
