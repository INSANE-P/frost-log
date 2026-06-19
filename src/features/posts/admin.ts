import { createClient } from "@/lib/supabase/server";
import type { ContentType } from "./types";

export type AdminListItem = {
  id: string;
  slug: string;
  type: ContentType;
  title: string;
  status: "draft" | "published";
  entry_date: string | null;
};

/** 어드민 대시보드용 — 초안 포함 전체. RLS상 인증 사용자만 draft를 읽는다. */
export async function listAllForAdmin(): Promise<AdminListItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("id, slug, type, title, status, entry_date")
    .order("entry_date", { ascending: false });
  return (data ?? []) as AdminListItem[];
}

export type EditData = {
  id: string;
  slug: string;
  type: ContentType;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  status: "draft" | "published";
  featured: boolean;
  entryDate: string;
  tags: string;
};

type EditRow = {
  id: string;
  slug: string;
  type: ContentType;
  title: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  status: "draft" | "published";
  featured: boolean | null;
  entry_date: string | null;
  post_tags: { tags: { name: string } | { name: string }[] | null }[] | null;
};

/** 수정 폼 초기값 */
export async function getForEdit(id: string): Promise<EditData | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select(
      "id, slug, type, title, excerpt, content, cover_image, status, featured, entry_date, post_tags(tags(name))",
    )
    .eq("id", id)
    .maybeSingle();
  if (!data) return null;
  const r = data as EditRow;
  const tags = (r.post_tags ?? [])
    .map((pt) => (Array.isArray(pt.tags) ? pt.tags[0]?.name : pt.tags?.name))
    .filter((n): n is string => !!n);
  return {
    id: r.id,
    slug: r.slug,
    type: r.type,
    title: r.title,
    excerpt: r.excerpt ?? "",
    content: typeof r.content === "string" ? r.content : "",
    coverImage: r.cover_image ?? "",
    status: r.status,
    featured: !!r.featured,
    entryDate: r.entry_date ?? "",
    tags: tags.join(", "),
  };
}

/** 자동완성용 — 등록된 모든 태그 이름 */
export async function listAllTags(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("tags").select("name").order("name");
  return ((data ?? []) as { name: string }[]).map((t) => t.name);
}
