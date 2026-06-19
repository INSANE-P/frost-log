import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostForm } from "@/features/posts/components/PostForm";
import { getForEdit, listAllTags } from "@/features/posts/admin";

export const metadata: Metadata = { title: "글 수정" };

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [data, tags] = await Promise.all([getForEdit(id), listAllTags()]);
  if (!data) notFound();
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate(),
  ).padStart(2, "0")}`;
  return <PostForm data={data} today={today} tagSuggestions={tags} />;
}
