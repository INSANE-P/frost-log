"use client";

import { useState } from "react";

/** 설화의 불꽃(겉불 + 속불). 색은 --flame-* 토큰이라 라이트/다크에서 다르게 보인다. */
const FLAME =
  "M40 58 C28 58 20 52 21 43 C21 36 24 31 28 33 C30 26 34 19 40 16 C46 19 50 26 52 33 C56 31 59 37 58 44 C58 53 52 58 40 58 Z";
const FLAME_INNER =
  "M40 53 C31 53 26 49 26 43 C26 38 28 34 31 36 C33 30 36 25 40 23 C44 25 47 30 49 36 C52 34 54 38 54 43 C54 49 49 53 40 53 Z";

/**
 * "불 지피기" 반응 버튼 — 평소 일렁이고, 호버하면 피어오르고, 누르면 한 번 크게 타오른다(다시 누르면 취소).
 * 지금은 낙관적 UI(로컬 토글)만. 저장·집계는 Supabase 쓰기 연결 시 붙인다.
 */
export function StokeButton({ initial = 0 }: { initial?: number }) {
  const [mine, setMine] = useState(false);
  const [lit, setLit] = useState(false);

  function stoke() {
    setMine((m) => !m);
    setLit(true);
    window.setTimeout(() => setLit(false), 600);
  }

  const count = initial + (mine ? 1 : 0);

  return (
    <button
      type="button"
      onClick={stoke}
      aria-pressed={mine}
      className={`stoke inline-flex items-center gap-2.5 rounded-full border px-6 py-3 transition hover:-translate-y-0.5 ${
        lit ? "is-lit" : ""
      } ${mine ? "is-mine" : ""}`}
      style={{
        borderColor: mine ? "var(--accent)" : "var(--border)",
        background: mine
          ? "color-mix(in srgb, var(--accent) 12%, var(--surface))"
          : "var(--surface)",
      }}
    >
      <svg width="24" height="24" viewBox="16 12 48 48" aria-hidden className="overflow-visible">
        <defs>
          <linearGradient
            id="stoke-grad"
            gradientUnits="userSpaceOnUse"
            x1="40"
            y1="16"
            x2="40"
            y2="58"
          >
            <stop offset="0" stopColor="var(--flame-top)" />
            <stop offset="0.4" stopColor="var(--flame-mid)" />
            <stop offset="0.78" stopColor="var(--flame-low)" />
            <stop offset="1" stopColor="var(--flame-base)" />
          </linearGradient>
        </defs>
        <g className="stoke-flame">
          <g className="stoke-flicker">
            <path d={FLAME} fill="url(#stoke-grad)" />
            <path d={FLAME_INNER} fill="var(--flame-inner)" />
          </g>
        </g>
      </svg>
      <span className={`text-[15px] font-medium ${mine ? "text-accent" : "text-foreground"}`}>
        {mine ? "불 지폈어요" : "불 지피기"}
      </span>
      <span className="text-[15px] font-bold text-accent tabular-nums">{count}</span>
    </button>
  );
}
