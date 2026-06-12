/**
 * className 조건부 결합 유틸. falsy 값은 건너뛴다.
 * 외부 의존성 없이 가볍게 — 필요해지면 clsx/tailwind-merge로 교체.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
