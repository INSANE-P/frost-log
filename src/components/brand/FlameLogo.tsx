"use client";

import { useState } from "react";

/**
 * 설화(雪火) — Frost 마스코트 로고.
 *
 * 배경(배지) 없이 캐릭터(푸른 불꽃 + 큰 눈)만 있는 마크. 투명 배경.
 * 하나의 SVG가 CSS 변수(--flame-*)로 라이트/다크에 자동 대응한다.
 *
 * 상호작용:
 * - 일렁임/깜빡임/가끔 시선 옮기기(glance)는 globals.css 의 CSS 애니메이션.
 * - 마우스를 올리면 촛불처럼 옆으로 휘며 꺼지고 연기가 남 → 떼면 재점화.
 *   (모션은 globals.css, 여기서는 is-out / is-lit 클래스만 토글)
 *
 * 한 페이지에 여러 번 쓰면 gradient id 충돌을 막기 위해 `name`을 다르게 넘긴다.
 */
type FlameLogoProps = {
  /** 렌더 크기(px). 기본 96 */
  size?: number;
  /** gradient id 네임스페이스. 한 페이지에 2개 이상이면 다르게 지정 */
  name?: string;
  className?: string;
};

const FLAME =
  "M40 58 C28 58 20 52 21 43 C21 36 24 31 28 33 C30 26 34 19 40 16 C46 19 50 26 52 33 C56 31 59 37 58 44 C58 53 52 58 40 58 Z";
const FLAME_INNER =
  "M40 53 C31 53 26 49 26 43 C26 38 28 34 31 36 C33 30 36 25 40 23 C44 25 47 30 49 36 C52 34 54 38 54 43 C54 49 49 53 40 53 Z";

export function FlameLogo({ size = 96, name = "frost", className }: FlameLogoProps) {
  const grad = `${name}-flame`;
  // idle(초기) → out(꺼짐) → lit(재점화). 초기엔 애니메이션 없이 켜진 상태.
  const [state, setState] = useState<"idle" | "out" | "lit">("idle");

  const stateClass = state === "out" ? "is-out" : state === "lit" ? "is-lit" : "";

  return (
    <span
      className={`flame-logo ${stateClass} ${className ?? ""}`}
      onMouseEnter={() => setState("out")}
      onMouseLeave={() => setState("lit")}
    >
      {/* viewBox에 위쪽 여백을 둬서 호버 시 피어오르는 연기 공간 확보 */}
      <svg width={size} height={size} viewBox="16 12 48 48" role="img" aria-label="frost-log 로고">
        <defs>
          <linearGradient id={grad} gradientUnits="userSpaceOnUse" x1="40" y1="16" x2="40" y2="58">
            <stop offset="0" stopColor="var(--flame-top)" />
            <stop offset="0.4" stopColor="var(--flame-mid)" />
            <stop offset="0.78" stopColor="var(--flame-low)" />
            <stop offset="1" stopColor="var(--flame-base)" />
          </linearGradient>
        </defs>

        {/* 연기 — 불꽃이 꺼지는 밑동에서 피어올라 위로 사라진다 */}
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
            {/* 눈동자 하이라이트 — 가끔 스스로 시선을 옮긴다(작은 범위) */}
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
