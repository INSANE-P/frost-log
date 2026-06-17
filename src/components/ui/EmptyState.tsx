import { Snowflake } from "lucide-react";

/**
 * 빈 상태 — 방문자가 보는 화면이다. '관리자에게 지시하는 문구'가 아니라(예: "글을 등록하세요" ✗),
 * 방문자 시점의 차분한 안내(frost 톤)를 보여준다. 점선 박스 대신 옅은 성에 원 + 눈송이.
 */
export function EmptyState({ message, hint }: { message: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
      <span
        className="flex size-14 items-center justify-center rounded-full"
        style={{ background: "color-mix(in srgb, var(--accent) 8%, transparent)" }}
      >
        <Snowflake className="size-6 text-accent" strokeWidth={1.75} aria-hidden />
      </span>
      <p className="break-keep text-[15px] font-medium text-foreground/85">{message}</p>
      {hint && <p className="-mt-1 break-keep text-[13px] text-muted">{hint}</p>}
    </div>
  );
}
