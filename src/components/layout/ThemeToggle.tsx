"use client";

import { useEffect, useId, useState } from "react";

/**
 * 테마 토글 — 해↔달을 하나의 SVG로 모핑한다(광선 접힘 + 초승달 마스크 이동).
 * 불꽃은 브랜드 전용이라, 토글은 보편적인 해/달로 역할을 나눈다.
 *
 * - 저장: localStorage('theme'). 루트 init 스크립트가 초기 클래스를 칠해 깜빡임 없음.
 * - ready 플래그로 첫 로드 시 전환 애니메이션을 막는다(이후 클릭에만 애니메이션).
 * - 누르면 토글 지점에서 테마가 얼음처럼 번지듯/거둬지듯 전환(View Transitions, animations.css).
 */
export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [ready, setReady] = useState(false);
  const maskId = useId();

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    const r = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(r);
  }, []);

  function toggle(e: React.MouseEvent<HTMLButtonElement>) {
    const next = !dark;
    const apply = () => {
      setDark(next);
      document.documentElement.classList.toggle("dark", next);
      try {
        localStorage.setItem("theme", next ? "dark" : "light");
      } catch {
        // localStorage 접근 불가(시크릿 등) 시 무시 — 토글 자체는 동작
      }
    };

    const root = document.documentElement;
    const startVT = (
      document as Document & { startViewTransition?: (cb: () => void) => unknown }
    ).startViewTransition?.bind(document);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 미지원/모션 최소화 → 즉시 전환
    if (!startVT || reduce) {
      apply();
      return;
    }

    // 토글 버튼 중심에서 화면 가장 먼 모서리까지 얼음이 퍼지는 반경
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    root.style.setProperty("--vt-x", `${x}px`);
    root.style.setProperty("--vt-y", `${y}px`);
    root.style.setProperty("--vt-r", `${r}px`);

    // 다크 켜기 → 번져 나감(reveal), 끄기 → 칠해졌던 테마가 지점으로 거둬짐(conceal)
    const dir = next ? "vt-reveal" : "vt-conceal";
    root.classList.add(dir);
    const vt = startVT(apply) as { finished?: Promise<void> };
    Promise.resolve(vt?.finished).finally(() => root.classList.remove(dir));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "라이트 모드로 전환" : "다크 모드로 전환"}
      className="inline-flex size-8 items-center justify-center rounded-md text-muted transition-colors hover:text-accent"
    >
      <svg
        className={`theme-icon ${dark ? "is-dark" : ""} ${ready ? "ready" : ""}`}
        width="20"
        height="20"
        viewBox="0 0 24 24"
        aria-hidden
      >
        <mask id={maskId}>
          <rect x="0" y="0" width="24" height="24" fill="white" />
          {/* 마스크 원 — 라이트(원 밖) → 다크(커지고 가까이 와 해를 크게 베어물어 초승달) */}
          <circle className="tm-mask" cx={dark ? 19 : 26} cy={dark ? 7 : 10} r={dark ? 9 : 6} fill="black" />
        </mask>
        <circle
          className="tm-orb"
          cx="12"
          cy="12"
          r={dark ? 9 : 6}
          fill="currentColor"
          mask={`url(#${maskId})`}
        />
        <g
          className="tm-beams"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ opacity: dark ? 0 : 1 }}
        >
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.2" y1="4.2" x2="5.6" y2="5.6" />
          <line x1="18.4" y1="18.4" x2="19.8" y2="19.8" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.2" y1="19.8" x2="5.6" y2="18.4" />
          <line x1="18.4" y1="5.6" x2="19.8" y2="4.2" />
        </g>
      </svg>
    </button>
  );
}
