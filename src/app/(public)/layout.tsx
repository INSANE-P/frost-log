import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

/**
 * 방문자(public) 영역 공통 레이아웃: 헤더 + 본문 + 푸터.
 * (admin) 영역은 별도 레이아웃에서 인증 가드를 갖는다 — 경계 분리(ADR-0002).
 */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
