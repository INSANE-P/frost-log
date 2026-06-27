import type { Metadata } from "next";
import { gmarket, pretendard } from "./fonts";
import "./globals.css";

const description =
  "개발자의 겨울나기 — 일상부터 공부, 프로젝트까지 다양한 이야기를 담는 개인 블로그.";
// 커스텀 도메인이 생기면 Vercel env NEXT_PUBLIC_SITE_URL만 바꾸면 된다.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://frost-log.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "설화",
    template: "%s · 설화",
  },
  description,
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    siteName: "설화",
    locale: "ko_KR",
    url: siteUrl,
    title: "설화",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "설화",
    description,
  },
};

// 하이드레이션 전 동기 실행: 저장된 테마(없으면 OS 설정)를 적용해 새로고침 깜빡임(FOUC)을 막는다.
const themeInitScript = `(function(){try{var m=matchMedia('(prefers-color-scheme:dark)');var a=function(d){document.documentElement.classList.toggle('dark',d);};var ls=localStorage.getItem('theme');a(ls?ls==='dark':m.matches);var on=function(e){if(!localStorage.getItem('theme'))a(e.matches);};m.addEventListener?m.addEventListener('change',on):m.addListener(on);}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ko"
      className={`${pretendard.variable} ${gmarket.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
