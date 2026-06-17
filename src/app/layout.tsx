import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "설화",
    template: "%s · 설화",
  },
  description: "개발자의 겨울나기 — 일상부터 공부, 프로젝트까지 다양한 이야기를 담는 개인 블로그.",
  icons: { icon: "/favicon.svg" },
};

// 하이드레이션 전 동기 실행: 저장된 테마(없으면 OS 설정)를 적용해 새로고침 깜빡임(FOUC)을 막는다.
const themeInitScript = `(function(){try{var m=matchMedia('(prefers-color-scheme:dark)');var a=function(d){document.documentElement.classList.toggle('dark',d);};var ls=localStorage.getItem('theme');a(ls?ls==='dark':m.matches);var on=function(e){if(!localStorage.getItem('theme'))a(e.matches);};m.addEventListener?m.addEventListener('change',on):m.addListener(on);}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
