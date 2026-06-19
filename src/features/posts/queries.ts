import { createClient } from "@/lib/supabase/server";
import type { ContentType, Entry } from "./types";

/**
 * 읽기 경계(ADR-0002). Supabase에서 published 글만 읽는다(RLS도 이중 보호).
 * DB row를 Entry로 매핑한다 — 본문은 마크다운 원문이며 렌더는 화면(.prose)에서 한다(ADR-0014).
 */

type TagRel = { name: string } | { name: string }[] | null;
type Row = {
  slug: string;
  type: ContentType;
  title: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  featured: boolean | null;
  entry_date: string | null;
  published_at: string | null;
  stokes: number | null;
  post_tags: { tags: TagRel }[] | null;
};

const SELECT =
  "slug, type, title, excerpt, content, cover_image, featured, entry_date, published_at, stokes, post_tags(tags(name))";
const SELECT_BY_TAG =
  "slug, type, title, excerpt, content, cover_image, featured, entry_date, published_at, stokes, post_tags!inner(tags!inner(name))";

function tagNames(postTags: Row["post_tags"]): string[] | undefined {
  if (!postTags?.length) return undefined;
  const names = postTags
    .map((pt) => (Array.isArray(pt.tags) ? pt.tags[0]?.name : pt.tags?.name))
    .filter((n): n is string => !!n);
  return names.length ? names : undefined;
}

function toEntry(r: Row): Entry {
  return {
    slug: r.slug,
    type: r.type,
    title: r.title,
    excerpt: r.excerpt ?? "",
    date: r.entry_date ?? (r.published_at ? r.published_at.slice(0, 10) : ""),
    tags: tagNames(r.post_tags),
    featured: r.featured ?? false,
    coverImage: r.cover_image ?? undefined,
    // 마이그레이션 전(jsonb)에는 content가 객체일 수 있어 string일 때만 사용
    body: typeof r.content === "string" ? r.content : "",
    stokes: r.stokes ?? 0,
  };
}

/** 홈 큐레이션: 핀(featured)된 항목 */
export async function getFeatured(): Promise<Entry[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select(SELECT)
    .eq("status", "published")
    .eq("featured", true)
    .order("entry_date", { ascending: false });
  return ((data ?? []) as Row[]).map(toEntry);
}

/** 특정 흐름의 최근 항목 n개 (홈 '최근 기록/이야기') */
export async function getRecent(type: ContentType, limit: number): Promise<Entry[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select(SELECT)
    .eq("status", "published")
    .eq("type", type)
    .order("entry_date", { ascending: false })
    .limit(limit);
  return ((data ?? []) as Row[]).map(toEntry);
}

/** 목록(선택적으로 태그 필터) */
export async function getList(type: ContentType, tag?: string): Promise<Entry[]> {
  const supabase = await createClient();
  let query = supabase
    .from("posts")
    .select(tag ? SELECT_BY_TAG : SELECT)
    .eq("status", "published")
    .eq("type", type);
  if (tag) query = query.eq("post_tags.tags.name", tag);
  const { data } = await query.order("entry_date", { ascending: false });
  return ((data ?? []) as Row[]).map(toEntry);
}

/** 상세 1건 */
export async function getBySlug(type: ContentType, slug: string): Promise<Entry | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select(SELECT)
    .eq("status", "published")
    .eq("type", type)
    .eq("slug", slug)
    .maybeSingle();
  return data ? toEntry(data as Row) : null;
}

/** 같은 흐름의 인접 항목 — 상세 하단 내비용. prev=더 오래된, next=더 최근 */
export async function getAdjacent(
  type: ContentType,
  slug: string,
): Promise<{ prev: Entry | null; next: Entry | null }> {
  const list = await getList(type);
  const i = list.findIndex((e) => e.slug === slug);
  if (i === -1) return { prev: null, next: null };
  return {
    prev: i < list.length - 1 ? list[i + 1] : null,
    next: i > 0 ? list[i - 1] : null,
  };
}

/** 해당 흐름에서 쓰인 태그 목록 */
export async function getTags(type: ContentType): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("post_tags(tags(name))")
    .eq("status", "published")
    .eq("type", type);
  const set = new Set<string>();
  ((data ?? []) as Pick<Row, "post_tags">[]).forEach((r) =>
    tagNames(r.post_tags)?.forEach((n) => set.add(n)),
  );
  return [...set];
}
