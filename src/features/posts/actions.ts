"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

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
