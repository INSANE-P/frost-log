import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/features/auth/actions";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

/**
 * 어드민 보호 — 세션이 없으면 /login으로 보낸다(UX 가드).
 * 진짜 잠금은 DB RLS(쓰기는 인증 사용자만) — ADR-0013.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-5">
      <header className="flex items-center justify-between border-b border-border py-4">
        <Link href="/admin" className="font-title text-base font-bold text-foreground">
          설화 관리자
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <span className="hidden font-title text-[13px] text-muted sm:inline">{user.email}</span>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-lg border border-hairline px-3 py-1.5 font-title text-[13px] text-muted transition hover:border-accent hover:text-accent"
            >
              로그아웃
            </button>
          </form>
        </div>
      </header>
      <main className="py-10">{children}</main>
    </div>
  );
}
