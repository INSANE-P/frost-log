import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "frost-log",
    template: "%s · frost-log",
  },
  description: "개발자의 겨울나기 — 일상부터 공부, 프로젝트까지 다양한 이야기를 담는 개인 블로그.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
