import {
  collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc,
  query, where, increment,
} from "firebase/firestore";
import { db, isFirebaseEnabled } from "./firebase";
import { POSTS, COMMENTS, SITE, TAGS, BOOKS } from "./seed";
import type { Post, Comment, SiteSettings, TagMap, Book } from "./types";

/* ============================================================
   Repository — Firestore khi đã cấu hình, ngược lại dùng dữ
   liệu mẫu trong bộ nhớ (đọc/ghi tạm trong phiên trình duyệt).
   ============================================================ */

// ---- in-memory fallback store (clone seed so we can mutate) ----
let memPosts: Post[] = POSTS.map((p) => ({ ...p }));
let memComments: Comment[] = COMMENTS.map((c) => ({ ...c }));
let memSettings: SiteSettings = { ...SITE };
let memBooks: Book[] = BOOKS.map((b) => ({ ...b }));

const sleep = () => new Promise((r) => setTimeout(r, 60));

// ---------- Image upload ----------
const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

/** Đọc file thành chuỗi base64 (bỏ tiền tố data:...;base64,). */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/**
 * Tải ảnh lên ImgBB và trả về URL công khai.
 * Khi chưa cấu hình NEXT_PUBLIC_IMGBB_API_KEY, trả về data URL để xem
 * trước trong bộ nhớ (chế độ dữ liệu mẫu).
 */
export async function uploadImage(file: File): Promise<string> {
  if (IMGBB_KEY) {
    const body = new FormData();
    body.append("image", await fileToBase64(file));
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
      method: "POST",
      body,
    });
    const json = await res.json();
    if (!res.ok || !json?.data?.url) {
      throw new Error(json?.error?.message || "Tải ảnh lên ImgBB thất bại");
    }
    return json.data.url as string;
  }
  // fallback (chưa cấu hình ImgBB): nhúng ảnh dưới dạng data URL
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

// ---------- Tags (static config) ----------
export function getTags(): TagMap {
  return TAGS;
}

// ---------- Settings ----------
export async function getSettings(): Promise<SiteSettings> {
  if (isFirebaseEnabled && db) {
    const snap = await getDoc(doc(db, "settings", "site"));
    if (snap.exists()) return { ...SITE, ...(snap.data() as Partial<SiteSettings>) };
    return SITE;
  }
  await sleep();
  return memSettings;
}

export async function saveSettings(s: SiteSettings): Promise<void> {
  if (isFirebaseEnabled && db) {
    await setDoc(doc(db, "settings", "site"), s);
    return;
  }
  memSettings = { ...s };
}

// ---------- Posts ----------
export async function getPosts(): Promise<Post[]> {
  if (isFirebaseEnabled && db) {
    const snap = await getDocs(collection(db, "posts"));
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Post, "id">) }));
  }
  await sleep();
  return memPosts.map((p) => ({ ...p }));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (isFirebaseEnabled && db) {
    const snap = await getDocs(query(collection(db, "posts"), where("slug", "==", slug)));
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...(d.data() as Omit<Post, "id">) };
  }
  await sleep();
  return memPosts.find((p) => p.slug === slug) ?? null;
}

export async function getPostById(id: string): Promise<Post | null> {
  if (isFirebaseEnabled && db) {
    const snap = await getDoc(doc(db, "posts", id));
    return snap.exists() ? { id: snap.id, ...(snap.data() as Omit<Post, "id">) } : null;
  }
  await sleep();
  return memPosts.find((p) => p.id === id) ?? null;
}

export async function savePost(post: Post): Promise<Post> {
  const { id, ...data } = post;
  if (isFirebaseEnabled && db) {
    if (id) {
      await setDoc(doc(db, "posts", id), data, { merge: true });
      return post;
    }
    const ref = await addDoc(collection(db, "posts"), data);
    return { ...post, id: ref.id };
  }
  await sleep();
  if (id && memPosts.some((p) => p.id === id)) {
    memPosts = memPosts.map((p) => (p.id === id ? post : p));
    return post;
  }
  const created = { ...post, id: id || "p" + Date.now() };
  memPosts = [...memPosts, created];
  return created;
}

export async function deletePost(id: string): Promise<void> {
  if (isFirebaseEnabled && db) {
    await deleteDoc(doc(db, "posts", id));
    return;
  }
  memPosts = memPosts.filter((p) => p.id !== id);
}

export async function incrementViews(id: string): Promise<void> {
  if (isFirebaseEnabled && db) {
    await updateDoc(doc(db, "posts", id), { views: increment(1) });
    return;
  }
  memPosts = memPosts.map((p) => (p.id === id ? { ...p, views: p.views + 1 } : p));
}

// ---------- Books (tiếp thị liên kết) ----------
export async function getBooks(): Promise<Book[]> {
  if (isFirebaseEnabled && db) {
    const snap = await getDocs(collection(db, "books"));
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Book, "id">) }));
  }
  await sleep();
  return memBooks.map((b) => ({ ...b }));
}

export async function saveBook(book: Book): Promise<Book> {
  const { id, ...data } = book;
  if (isFirebaseEnabled && db) {
    if (id) {
      await setDoc(doc(db, "books", id), data, { merge: true });
      return book;
    }
    const ref = await addDoc(collection(db, "books"), data);
    return { ...book, id: ref.id };
  }
  await sleep();
  if (id && memBooks.some((b) => b.id === id)) {
    memBooks = memBooks.map((b) => (b.id === id ? book : b));
    return book;
  }
  const created = { ...book, id: id || "b" + Date.now() };
  memBooks = [...memBooks, created];
  return created;
}

export async function deleteBook(id: string): Promise<void> {
  if (isFirebaseEnabled && db) {
    await deleteDoc(doc(db, "books", id));
    return;
  }
  memBooks = memBooks.filter((b) => b.id !== id);
}

// ---------- Comments ----------
export async function getAllComments(): Promise<Comment[]> {
  if (isFirebaseEnabled && db) {
    const snap = await getDocs(collection(db, "comments"));
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Comment, "id">) }));
  }
  await sleep();
  return memComments.map((c) => ({ ...c }));
}

export async function getCommentsBySlug(slug: string): Promise<Comment[]> {
  if (isFirebaseEnabled && db) {
    const snap = await getDocs(query(collection(db, "comments"), where("postSlug", "==", slug)));
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Comment, "id">) }));
  }
  await sleep();
  return memComments.filter((c) => c.postSlug === slug).map((c) => ({ ...c }));
}

export async function addComment(c: Omit<Comment, "id">): Promise<Comment> {
  if (isFirebaseEnabled && db) {
    const ref = await addDoc(collection(db, "comments"), c);
    return { ...c, id: ref.id };
  }
  await sleep();
  const created = { ...c, id: "c" + Date.now() };
  memComments = [...memComments, created];
  return created;
}

export async function setCommentLikes(id: string, likes: number): Promise<void> {
  if (isFirebaseEnabled && db) {
    await updateDoc(doc(db, "comments", id), { likes });
    return;
  }
  memComments = memComments.map((c) => (c.id === id ? { ...c, likes } : c));
}

export async function moderateComment(id: string, status: Comment["status"]): Promise<void> {
  if (isFirebaseEnabled && db) {
    await updateDoc(doc(db, "comments", id), { status });
    return;
  }
  memComments = memComments.map((c) => (c.id === id ? { ...c, status } : c));
}

export async function deleteComment(id: string): Promise<void> {
  if (isFirebaseEnabled && db) {
    // also remove replies pointing to this comment
    const replies = await getDocs(query(collection(db, "comments"), where("parentId", "==", id)));
    await Promise.all(replies.docs.map((d) => deleteDoc(d.ref)));
    await deleteDoc(doc(db, "comments", id));
    return;
  }
  memComments = memComments.filter((c) => c.id !== id && c.parentId !== id);
}
