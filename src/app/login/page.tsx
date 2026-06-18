import type { Metadata } from "next";
import { FlameLogo } from "@/components/brand/FlameLogo";
import { LoginForm } from "@/features/auth/LoginForm";

export const metadata: Metadata = { title: "로그인" };

export default function LoginPage() {
  return (
    <section className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-5">
      <div className="mb-7 flex items-center gap-2">
        <FlameLogo size={28} animated={false} className="-translate-y-[2px]" />
        <span className="font-title text-lg font-bold text-foreground">설화 관리자</span>
      </div>
      <h1 className="text-[22px] font-bold tracking-tight text-foreground">로그인</h1>
      <p className="mb-6 mt-1 text-sm text-muted">글을 쓰려면 로그인하세요.</p>
      <LoginForm />
    </section>
  );
}
