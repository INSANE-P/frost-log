"use client";

import { useState } from "react";

/**
 * 설화(雪火) — Frost 마스코트 로고. 배경 없는 캐릭터 마크(푸른 불꽃 + 큰 눈)로,
 * CSS 변수(--flame-*)로 라이트/다크에 자동 대응한다. 모션은 animations.css.
 *
 * - animated=false: 정적 마크(헤더처럼 차분해야 하는 자리)
 * - name: 한 페이지에 2개 이상 쓸 때 gradient id 충돌 방지
 */
type FlameLogoProps = {
  size?: number;
  name?: string;
  className?: string;
  animated?: boolean;
};

const FLAME =
  "M40 58 C28 58 20 52 21 43 C21 36 24 31 28 33 C30 26 34 19 40 16 C46 19 50 26 52 33 C56 31 59 37 58 44 C58 53 52 58 40 58 Z";
const FLAME_INNER =
  "M40 53 C31 53 26 49 26 43 C26 38 28 34 31 36 C33 30 36 25 40 23 C44 25 47 30 49 36 C52 34 54 38 54 43 C54 49 49 53 40 53 Z";

export function FlameLogo({ size = 96, name = "frost", className, animated = true }: FlameLogoProps) {
  const grad = `${name}-flame`;
  // idle → out(꺼짐) → lit(재점화). 초기엔 애니메이션 없이 켜진 상태.
  const [state, setState] = useState<"idle" | "out" | "lit">("idle");

  const stateClass = animated
    ? state === "out"
      ? "is-out"
      : state === "lit"
        ? "is-lit"
        : ""
    : "is-static";

  return (
    <span
      className={`flame-logo ${stateClass} ${className ?? ""}`}
      onMouseEnter={animated ? () => setState("out") : undefined}
      onMouseLeave={animated ? () => setState("lit") : undefined}
    >
      {/* viewBox 위쪽 여백은 호버 시 피어오르는 연기 공간 */}
      <svg width={size} height={size} viewBox="16 12 48 48" role="img" aria-label="설화 로고">
        <defs>
          <linearGradient id={grad} gradientUnits="userSpaceOnUse" x1="40" y1="16" x2="40" y2="58">
            <stop offset="0" stopColor="var(--flame-top)" />
            <stop offset="0.4" stopColor="var(--flame-mid)" />
            <stop offset="0.78" stopColor="var(--flame-low)" />
            <stop offset="1" stopColor="var(--flame-base)" />
          </linearGradient>
        </defs>

        <g className="flame-smoke">
          <circle cx="40" cy="52" r="2.2" fill="#9aa6ad" />
          <circle cx="38.4" cy="48" r="1.7" fill="#aab4ba" />
          <circle cx="41" cy="44.5" r="1.3" fill="#bcc5ca" />
        </g>

        <g className="flame-wrap">
          <path className="flame-core" d={FLAME} fill={`url(#${grad})`} />
          <path className="flame-in" d={FLAME_INNER} fill="var(--flame-inner)" />
          <g className="flame-eyes">
            <ellipse cx="34.8" cy="42" rx="3.6" ry="4.3" fill="var(--flame-eye)" />
            <ellipse cx="45.2" cy="42" rx="3.6" ry="4.3" fill="var(--flame-eye)" />
            <g className="flame-glints">
              <circle cx="33.6" cy="40.4" r="1.2" fill="#ffffff" />
              <circle cx="44.1" cy="40.4" r="1.2" fill="#ffffff" />
            </g>
          </g>
        </g>
      </svg>
    </span>
  );
}
