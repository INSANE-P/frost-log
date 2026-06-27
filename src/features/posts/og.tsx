import { ImageResponse } from "next/og";
import { DINO_DATA_URL } from "./og-dino-data";

// 공용 OG 렌더러 — 사이트 기본/글별 OG가 같은 톤을 쓴다(토스 톤: frost 그라데이션 + 좌측 볼드 + 우측 마스코트).
// 폰트는 절대 CDN URL이라 fetch OK. 마스코트는 base64 임베드(상대경로 fetch가 서버에서 실패해서).
const FONT_700 =
  "https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-kr@latest/korean-700-normal.woff";
const FONT_400 =
  "https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-kr@latest/korean-400-normal.woff";

export const OG_SIZE = { width: 1200, height: 630 };

async function loadFonts() {
  const [bold, reg] = await Promise.all([
    fetch(FONT_700).then((r) => r.arrayBuffer()),
    fetch(FONT_400).then((r) => r.arrayBuffer()),
  ]);
  return [
    { name: "Noto", data: bold, weight: 700 as const, style: "normal" as const },
    { name: "Noto", data: reg, weight: 400 as const, style: "normal" as const },
  ];
}

/** 제목 길이에 맞춰 폰트 크기 자동 조절(긴 제목이 넘치지 않게). */
function titleSizeFor(title: string) {
  if (title.length <= 6) return 116;
  if (title.length <= 14) return 88;
  if (title.length <= 22) return 70;
  return 58;
}

export async function renderOg({
  eyebrow,
  title,
  footnote,
  titleSize,
}: {
  eyebrow?: string;
  title: string;
  footnote?: string;
  titleSize?: number;
}) {
  const fonts = await loadFonts();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          padding: "0 92px",
          backgroundColor: "#eef5fc",
          backgroundImage: "linear-gradient(135deg, #f7fbfe 0%, #e3eefb 100%)",
          fontFamily: "Noto",
        }}
      >
        <div style={{ flex: 1, display: "flex", flexDirection: "column", paddingRight: 36 }}>
          {eyebrow ? (
            <div style={{ fontSize: 30, fontWeight: 700, color: "#2f8fb5", marginBottom: 20 }}>
              {eyebrow}
            </div>
          ) : null}
          <div
            style={{
              fontSize: titleSize ?? titleSizeFor(title),
              fontWeight: 700,
              color: "#1f3947",
              letterSpacing: "-0.03em",
              lineHeight: 1.16,
            }}
          >
            {title}
          </div>
          {footnote ? (
            <div style={{ fontSize: 34, fontWeight: 400, color: "#5b7a89", marginTop: 24 }}>
              {footnote}
            </div>
          ) : null}
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={DINO_DATA_URL} width={350} height={350} alt="" style={{ objectFit: "contain" }} />
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}
