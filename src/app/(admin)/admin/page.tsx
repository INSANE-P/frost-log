import type { Metadata } from "next";
import Link from "next/link";
import { listAllForAdmin } from "@/features/posts/admin";
import { DeleteButton } from "@/features/posts/components/DeleteButton";
import { formatDate } from "@/lib/utils/date";

export const metadata: Metadata = { title: "관리자" };

export default async function AdminPage() {
  const posts = await listAllForAdmin();

  return (
    <section>
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-bold tracking-tight text-foreground">글 관리</h1>
        <Link
          href="/admin/new"
          className="rounded-lg bg-accent px-4 py-2 text-[14px] font-semibold text-white transition hover:opacity-90"
        >
          새 글
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="mt-8 text-[15px] text-muted">아직 글이 없어요. ‘새 글’로 시작하세요.</p>
      ) : (
        <ul className="mt-6 border-t border-hairline">
          {posts.map((p) => (
            <li key={p.id} className="flex items-center gap-3 border-b border-hairline py-3">
              <span
                className="shrink-0 rounded px-1.5 py-0.5 font-title text-[11px]"
                style={{
                  color: p.status === "published" ? "var(--accent)" : "var(--muted)",
                  background:
                    p.status === "published"
                      ? "color-mix(in srgb, var(--accent) 12%, transparent)"
                      : "color-mix(in srgb, var(--muted) 12%, transparent)",
                }}
              >
                {p.status === "published" ? "발행" : "초안"}
              </span>
              <span className="shrink-0 font-title text-[12px] text-muted">
                {p.type === "post" ? "이야기" : "기록"}
              </span>
              <Link
                href={`/admin/edit/${p.id}`}
                className="min-w-0 flex-1 truncate text-[15px] font-medium text-foreground transition hover:text-accent"
              >
                {p.title}
              </Link>
              <span className="hidden shrink-0 font-title text-[12px] text-muted sm:inline">
                {p.entry_date ? formatDate(p.entry_date) : ""}
              </span>
              <DeleteButton id={p.id} title={p.title} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
