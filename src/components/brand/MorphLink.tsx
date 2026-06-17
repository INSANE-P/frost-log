import type { ReactNode } from "react";

/**
 * 히어로 유틸 링크 — 평소엔 텍스트, 호버하면 글자가 안쪽으로 모여 사라지며
 * 그 자리에 링크에 맞는 아이콘이 떠오른다(.morph-link, animations.css). CSS만으로 동작.
 * 텍스트는 흐름에 남아 폭을 잡아 레이아웃이 안 흔들리고, 스크린리더도 라벨을 읽는다.
 */
export function MorphLink({
  href,
  label,
  icon,
  external,
}: {
  href: string;
  label: string;
  icon: ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="morph-link text-muted transition-colors hover:text-accent"
    >
      <span className="morph-text">{label}</span>
      <span className="morph-icon" aria-hidden>
        {icon}
      </span>
    </a>
  );
}
