import type { Metadata } from "next";
import { PostForm } from "@/features/posts/components/PostForm";
import { listAllTags } from "@/features/posts/admin";

export const metadata: Metadata = { title: "새 글" };

export default async function NewPostPage() {
  const tags = await listAllTags();
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate(),
  ).padStart(2, "0")}`;
  return <PostForm today={today} tagSuggestions={tags} />;
}
