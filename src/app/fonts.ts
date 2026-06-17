import localFont from "next/font/local";

// 본문 — 가변 폰트 한 파일로 전 굵기 커버. 본문은 critical path라 preload(기본값) 유지.
export const pretendard = localFont({
  src: "../fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "100 900",
  variable: "--font-pretendard",
});

// 제목·UI — critical path가 아니므로 preload 끔(쓰이는 굵기만 필요 시 로드).
export const gmarket = localFont({
  src: [
    { path: "../fonts/GmarketSansLight.woff", weight: "300", style: "normal" },
    { path: "../fonts/GmarketSansMedium.woff", weight: "500", style: "normal" },
    { path: "../fonts/GmarketSansBold.woff", weight: "700", style: "normal" },
  ],
  display: "swap",
  preload: false,
  variable: "--font-gmarket",
});
