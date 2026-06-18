import type { Metadata } from "next";

export const metadata: Metadata = { title: "관리자" };

export default function AdminPage() {
  return (
    <section>
      <h1 className="text-[24px] font-bold tracking-tight text-foreground">관리자</h1>
      <p className="mt-3 text-[15px] text-muted">
        로그인됐어요. 글쓰기 화면은 다음 단계에서 추가됩니다.
      </p>
    </section>
  );
}
