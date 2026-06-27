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
  const entry = await getBySlug("journal", slug);
  if (!entry) return { title: "기록" };
  const description = entry.excerpt || undefined;
  return {
    title: entry.title,
    description,
    openGraph: { type: "article", title: entry.title, description },
  };
}

export default async function JournalDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [entry, adjacent] = await Promise.all([
    getBySlug("journal", slug),
    getAdjacent("journal", slug),
  ]);
  if (!entry) notFound();
  return <PostArticle entry={entry} prev={adjacent.prev} next={adjacent.next} />;
}
