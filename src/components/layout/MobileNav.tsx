"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Snowflake, X } from "lucide-react";
import { FlameLogo } from "@/components/brand/FlameLogo";
import { NAV } from "./nav";
import { ThemeToggle } from "./ThemeToggle";

const SOCIAL = [
  { label: "github", href: "https://github.com/INSANE-P" },
  { label: "이력서", href: "/resume" },
  { label: "메일", href: "mailto:chanbin0626@gmail.com" },
];

/**
 * 모바일 내비 — 햄버거를 누르면 화면 가운데서 얼음판이 퍼지듯(clip-path 원형 확장) 풀스크린 메뉴가 열린다.
 * 상단 로고바 / 큰 좌측 정렬 메뉴(아래에서 stagger) / 하단 링크·토글 / 눈송이 장식.
 */
export function MobileNav({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  // 홈은 상단 로고가 대신하므로 제외(데스크탑 헤더와 일관)
  const items = NAV.filter((i) => i.href !== "/");

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="메뉴 열기"
        aria-expanded={open}
        className="inline-flex size-9 items-center justify-center rounded-lg text-foreground transition hover:text-accent"
      >
        <Menu className="size-6" aria-hidden />
      </button>

      <div className={`ice-overlay fixed inset-0 z-50 ${open ? "open" : ""}`} aria-hidden={!open}>
        <Snowflake
          aria-hidden
          strokeWidth={1.25}
          className="ice-overlay-fade pointer-events-none absolute -right-12 bottom-10 size-52"
          style={{ color: "color-mix(in srgb, var(--accent) 9%, transparent)" }}
        />

        <div className="mx-auto flex h-full max-w-md flex-col px-6 py-3.5">
          <div className="ice-overlay-fade flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FlameLogo size={26} name="menu" animated={false} className="-translate-y-[2px]" />
              <span className="font-title text-lg font-bold text-foreground">설화</span>
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="메뉴 닫기"
              className="inline-flex size-10 items-center justify-center rounded-full border border-hairline text-foreground transition hover:border-accent hover:text-accent"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>

          {/* 큰 라벨 + 눈송이 불릿, 세로 중앙, 아래에서 하나씩(stagger) */}
          <nav className="flex flex-1 flex-col justify-center gap-4">
            {items.map((item, i) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className="menu-item group flex items-center gap-3.5"
                  style={{ transitionDelay: open ? `${0.16 + i * 0.07}s` : "0s" }}
                >
                  <Snowflake
                    aria-hidden
                    strokeWidth={active ? 2.75 : 1.75}
                    className={`size-6 shrink-0 transition-colors ${
                      active ? "text-accent" : "text-muted group-hover:text-accent"
                    }`}
                  />
                  <span
                    className={`font-title text-[40px] font-bold leading-none tracking-tight transition-colors ${
                      active ? "text-accent" : "text-foreground group-hover:text-accent"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="ice-overlay-fade flex items-center justify-between pb-1">
            <div className="flex gap-4 font-title text-sm font-medium text-muted">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="transition hover:text-accent"
                >
                  {s.label}
                </a>
              ))}
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}
