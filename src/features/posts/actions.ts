"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const IMAGE_BUCKET = "post-images";

const PostInput = z.object({
  id: z.string().uuid().optional(),
  type: z.enum(["journal", "post"]),
  title: z.string().min(1, "제목을 입력해 주세요"),
  slug: z
    .string()
    .min(1, "슬러그를 입력해 주세요")
    .regex(/^[^\s/]+$/, "슬러그에 공백·슬래시는 쓸 수 없어요"),
  excerpt: z.string().default(""),
  content: z.string().default(""),
  coverImage: z.string().default(""),
  entryDate: z.string().min(1, "날짜를 입력해 주세요"),
  featured: z.boolean().default(false),
  status: z.enum(["draft", "published"]),
  tags: z.string().default(""),
});

export type SaveState = { error: string | null };

/** 글 작성/수정 — Zod 검증 후 upsert, 태그 동기화, 공개 페이지 revalidate. 성공 시 /admin으로. */
export async function savePost(_prev: SaveState, formData: FormData): Promise<SaveState> {
  const parsed = PostInput.safeParse({
    id: (formData.get("id") as string) || undefined,
    type: formData.get("type"),
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt") ?? "",
    content: formData.get("content") ?? "",
    coverImage: formData.get("coverImage") ?? "",
    entryDate: formData.get("entryDate"),
    featured: formData.get("featured") === "on",
    status: formData.get("status"),
    tags: formData.get("tags") ?? "",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력을 확인해 주세요" };
  }
  const d = parsed.data;

  const supabase = await createClient();
  const row = {
    type: d.type,
    title: d.title,
    slug: d.slug,
    excerpt: d.excerpt || null,
    content: d.content,
    cover_image: d.coverImage || null,
    entry_date: d.entryDate,
    featured: d.featured,
    status: d.status,
    published_at: d.status === "published" ? new Date().toISOString() : null,
  };

  let postId = d.id;
  if (postId) {
    const { error } = await supabase.from("posts").update(row).eq("id", postId);
    if (error) return { error: `저장 실패: ${error.message}` };
  } else {
    const { data, error } = await supabase.from("posts").insert(row).select("id").single();
    if (error || !data) return { error: `저장 실패: ${error?.message ?? "알 수 없는 오류"}` };
    postId = (data as { id: string }).id;
  }
  if (!postId) return { error: "저장 실패: id를 얻지 못했어요" };

  // 태그: 이름들 → tags upsert → post_tags 재설정
  const names = [...new Set(d.tags.split(",").map((t) => t.trim()).filter(Boolean))];
  await supabase.from("post_tags").delete().eq("post_id", postId);
  if (names.length > 0) {
    const { data: tagRows } = await supabase
      .from("tags")
      .upsert(
        names.map((name) => ({ name, slug: name })),
        { onConflict: "slug" },
      )
      .select("id");
    const links = ((tagRows ?? []) as { id: string }[]).map((t) => ({
      post_id: postId,
      tag_id: t.id,
    }));
    if (links.length > 0) await supabase.from("post_tags").insert(links);
  }

  revalidatePath("/");
  revalidatePath("/posts");
  revalidatePath("/journal");
  revalidatePath(`/${d.type === "post" ? "posts" : "journal"}/${d.slug}`);

  redirect("/admin");
}

/**
 * 불 지피기 — 익명도 호출 가능한 좁은 RPC로 "발행 글의 카운트 +1"만 한다(ADR-0016).
 * 테이블 직접 쓰기는 RLS로 막혀 있고, 이 통로만 열려 있다. 새 카운트를 돌려준다.
 */
export async function stokePost(slug: string): Promise<number | null> {
  if (!slug) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("increment_stokes", { p_slug: slug });
  if (error) return null;
  return typeof data === "number" ? data : null;
}

/** 글 삭제 */
export async function deletePost(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("posts").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/posts");
  revalidatePath("/journal");
  redirect("/admin");
}

export type SweepResult = { deleted: number; kept: number; error?: string };

/**
 * 미사용 이미지 정리(ADR-0020) — 어느 글에서도 참조하지 않는 Storage 파일을 삭제한다.
 * 모든 글의 content+cover에서 버킷 이미지 경로를 모아, 버킷 목록과 대조해 차집합을 지운다.
 * 인증 사용자만. 저장 안 한 드래프트 이미지는 고아로 보여 지워질 수 있어, 작성 중엔 실행하지 않는다.
 */
export async function sweepUnusedImages(): Promise<SweepResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { deleted: 0, kept: 0, error: "권한이 없어요" };

  const { data: posts, error: readErr } = await supabase
    .from("posts")
    .select("content, cover_image");
  if (readErr) return { deleted: 0, kept: 0, error: readErr.message };

  // 본문·커버에서 우리 버킷 이미지 경로(파일명)를 수집
  const referenced = new Set<string>();
  const re = /\/storage\/v1\/object\/public\/post-images\/([^\s"')]+)/g;
  for (const p of (posts ?? []) as { content: string | null; cover_image: string | null }[]) {
    const text = `${p.content ?? ""}\n${p.cover_image ?? ""}`;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) referenced.add(decodeURIComponent(m[1]));
  }

  const { data: files, error: listErr } = await supabase.storage
    .from(IMAGE_BUCKET)
    .list("", { limit: 1000 });
  if (listErr) return { deleted: 0, kept: 0, error: listErr.message };

  // 폴더(id=null) 제외, 참조 안 된 파일만 삭제 대상
  const all = (files ?? []).filter((f) => f.id !== null && f.name);
  const toDelete = all.filter((f) => !referenced.has(f.name)).map((f) => f.name);
  const kept = all.length - toDelete.length;
  if (toDelete.length > 0) {
    const { error: delErr } = await supabase.storage.from(IMAGE_BUCKET).remove(toDelete);
    if (delErr) return { deleted: 0, kept, error: delErr.message };
  }
  return { deleted: toDelete.length, kept };
}
