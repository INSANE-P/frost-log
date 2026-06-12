import { FlameLogo } from "@/components/brand/FlameLogo";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-[var(--container-prose)] flex-col items-center justify-center gap-6 px-6 text-center">
      <FlameLogo size={120} />
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">frost-log</h1>
        <p className="mt-2 text-muted">개발자의 겨울나기</p>
      </div>
      <p className="max-w-prose text-sm leading-7 text-muted">
        일상부터 공부, 프로젝트까지 다양한 이야기를 담는 개인 블로그입니다.
      </p>
    </main>
  );
}
