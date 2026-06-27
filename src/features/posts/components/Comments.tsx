"use client";

import { useEffect, useState } from "react";
import Giscus from "@giscus/react";

/**
 * Giscus 댓글(GitHub Discussions 기반, ADR-0021). 저장은 GitHub, 우리 백엔드 0.
 * 우리 .dark 클래스를 감시해 라이트/다크를 동기화한다.
 * - https(배포): 커스텀 frost 테마 CSS(우리 색). giscus는 테마 CSS를 https로만 불러올 수 있다.
 * - http(로컬): mixed-content로 커스텀 CSS가 차단되므로 내장 noborder 테마로 폴백.
 * 설정값(repo-id·category-id)은 공개라 하드코딩해도 안전.
 */
export function Comments() {
  // 초기엔 내장 테마(SSR/하이드레이션 안전), 마운트 후 실제 환경에 맞춰 갱신
  const [theme, setTheme] = useState("noborder_light");

  useEffect(() => {
    const compute = () => {
      const dark = document.documentElement.classList.contains("dark");
      if (window.location.protocol === "https:") {
        setTheme(`${window.location.origin}/giscus-frost-${dark ? "dark" : "light"}.css`);
      } else {
        setTheme(dark ? "noborder_dark" : "noborder_light");
      }
    };
    compute();
    const observer = new MutationObserver(compute);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <Giscus
      repo="INSANE-P/frost-log"
      repoId="R_kgDOS4XX0g"
      category="댓글"
      categoryId="DIC_kwDOS4XX0s4C_-zB"
      mapping="pathname"
      strict="1"
      reactionsEnabled="0"
      emitMetadata="0"
      inputPosition="bottom"
      theme={theme}
      lang="ko"
      loading="lazy"
    />
  );
}
