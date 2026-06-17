import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostArticle } from "@/features/posts/components/PostArticle";
import { getAdjacent, getBySlug } from "@/features/posts/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getBySlug("post", slug);
  return { title: entry?.title ?? "이야기" };
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [entry, adjacent] = await Promise.all([getBySlug("post", slug), getAdjacent("post", slug)]);
  if (!entry) notFound();
  return <PostArticle entry={entry} prev={adjacent.prev} next={adjacent.next} />;
}
