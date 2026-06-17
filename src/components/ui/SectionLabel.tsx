import { Snowflake } from "lucide-react";

/**
 * 섹션 머리말 — 작은 눈송이(Frost 모티프) + 텍스트.
 * 이모지 대신 일관된 모티프 하나로 통일(브랜드 톤).
 */
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 text-sm font-medium text-muted">
      <Snowflake className="size-4 text-accent" aria-hidden />
      {children}
    </div>
  );
}
