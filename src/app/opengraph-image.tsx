import { renderOg } from "@/features/posts/og";

// 사이트 기본 소셜 공유 이미지(글별 OG가 없는 페이지에 적용).
export const alt = "설화 — 겨울을 나는 개발자 박찬빈의 기록";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderOg({
    eyebrow: "박찬빈",
    title: "설화",
    footnote: "겨울을 나는 개발자의 기록",
    titleSize: 124,
  });
}
