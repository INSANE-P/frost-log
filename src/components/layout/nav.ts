/**
 * 사이트 내비게이션 단일 출처 — 헤더·푸터가 함께 참조한다.
 * 컴포넌트가 아닌 순수 데이터라 서버/클라 어디서든 import. 라우트는 영문(URL/SEO), 라벨은 한글.
 */
export const NAV = [
  { href: "/", label: "홈" },
  { href: "/journal", label: "기록" },
  { href: "/posts", label: "이야기" },
  { href: "/about", label: "소개" },
] as const;
