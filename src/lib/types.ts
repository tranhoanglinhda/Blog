export type PostStatus = "draft" | "published";
export type CommentStatus = "visible" | "pending" | "spam";

export interface SiteSettings {
  title: string;
  tagline: string;
  author: string;
  authorBio: string;
  email: string;
}

export type TagMap = Record<string, string>; // slug -> display name

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
