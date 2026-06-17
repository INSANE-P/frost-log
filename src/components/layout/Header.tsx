"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FlameLogo } from "@/components/brand/FlameLogo";
import { MobileNav } from "./MobileNav";
import { NAV } from "./nav";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3">
        {/* 로고 — 평소 정적, 호버하면 불꽃이 살아나고 이름이 점등(.logo-link, animations.css) */}
        <Link href="/" className="logo-link group flex items-center gap-2">
          {/* 불꽃은 밑동이 무거워 광학적으로 살짝 낮아 보임 → 2px 올려 텍스트와 시각 정렬 */}
          <FlameLogo size={28} animated={false} className="-translate-y-[2px]" />
          <span className="font-title text-lg font-bold text-foreground transition-colors group-hover:text-accent">
            설화
          </span>
        </Link>

        {/* 모바일 — 햄버거(얼음판 확장 오버레이) */}
        <MobileNav className="sm:hidden" />

        {/* 데스크탑 — 인라인 내비. 홈은 로고가 대신하므로 제외 */}
        <nav className="hidden items-center gap-1 font-title sm:flex">
          {NAV.filter((item) => item.href !== "/").map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-lg px-3 py-1.5 text-[15px] font-medium transition-colors ${
                  active ? "text-accent" : "text-muted hover:bg-surface hover:text-foreground"
                }`}
                style={
                  active
                    ? { background: "color-mix(in srgb, var(--accent) 12%, transparent)" }
                    : undefined
                }
              >
                {item.label}
              </Link>
            );
          })}
          <span className="ml-1.5">
            <ThemeToggle />
          </span>
        </nav>
      </div>
    </header>
  );
}
