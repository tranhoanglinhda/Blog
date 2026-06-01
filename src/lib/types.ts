export type PostStatus = "draft" | "published";
export type CommentStatus = "visible" | "pending" | "spam";

export interface SiteSettings {
  title: string;
  tagline: string;
  author: string;
  authorBio: string;
  email: string;
  /** Dòng chữ nhỏ ở chân trang, ví dụ "Viết bằng tất cả sự dịu dàng" */
  footer: string;
  /** Ảnh đại diện (avatar) cho trang "Về tôi" và sidebar */
  avatarUrl?: string;
  /** Giới thiệu dài cho trang "Về tôi" (mỗi đoạn cách nhau một dòng trống) */
  about?: string;
}

export type TagMap = Record<string, string>; // slug -> display name

export interface Book {
  id: string;
  /** Tên sách */
  title: string;
  /** Link sản phẩm (Shopee affiliate…) */
  productUrl: string;
  /** Link ảnh bìa sách */
  coverImageUrl: string;
  /** Đôi lời giới thiệu của tác giả về cuốn sách */
  note: string;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** Rich HTML body */
  body: string;
  cover: { hue: number; label: string };
  coverImageUrl?: string;
  date: string; // ISO yyyy-mm-dd
  readMins: number;
  views: number;
  tags: string[];
  featured: boolean;
  status: PostStatus;
}

export interface Comment {
  id: string;
  postSlug: string;
  parentId: string | null; // null = root
  name: string;
  email?: string;
  text: string;
  author?: boolean;
  likes: number;
  liked?: boolean; // client-side flag
  status: CommentStatus;
  date: string; // ISO yyyy-mm-dd
}
