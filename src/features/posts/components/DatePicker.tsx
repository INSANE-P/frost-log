"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const pad = (n: number) => String(n).padStart(2, "0");
const toYmd = (y: number, m: number, d: number) => `${y}-${pad(m)}-${pad(d)}`;

function parse(v: string): { y: number; m: number; d: number } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
  return m ? { y: +m[1], m: +m[2], d: +m[3] } : null;
}

function formatKo(v: string): string {
  const p = parse(v);
  if (!p) return "날짜 선택";
  const wd = WEEKDAYS[new Date(p.y, p.m - 1, p.d).getDay()];
  return `${p.y}년 ${p.m}월 ${p.d}일 (${wd})`;
}

/**
 * 커스텀 날짜 선택 — 우리 톤(frost) 달력. 모바일·데스크탑 공통, 외부클릭·Esc로 닫힘.
 * 선택값은 hidden input(name)으로 폼에 전달(YYYY-MM-DD). (ADR-0015 어드민 UX)
 */
export function DatePicker({
  name,
  defaultValue,
  today,
}: {
  name: string;
  defaultValue: string;
  today: string;
}) {
  const [value, setValue] = useState(defaultValue || today);
  const [open, setOpen] = useState(false);
  const init = parse(value) ?? parse(today)!;
  const [ym, setYm] = useState({ y: init.y, m: init.m });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function toggle() {
    if (!open) {
      const p = parse(value);
      if (p) setYm({ y: p.y, m: p.m });
    }
    setOpen((o) => !o);
  }
  function shift(delta: number) {
    setYm(({ y, m }) => {
      const n = m + delta;
      if (n < 1) return { y: y - 1, m: 12 };
      if (n > 12) return { y: y + 1, m: 1 };
      return { y, m: n };
    });
  }
  function pick(d: number) {
    setValue(toYmd(ym.y, ym.m, d));
    setOpen(false);
  }

  const dim = new Date(ym.y, ym.m, 0).getDate();
  const lead = new Date(ym.y, ym.m - 1, 1).getDay();
  const cells: (number | null)[] = [
    ...Array.from({ length: lead }, () => null),
    ...Array.from({ length: dim }, (_, i) => i + 1),
  ];

  return (
    <div className="relative mt-1" ref={ref}>
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        onClick={toggle}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="flex w-full items-center justify-between rounded-lg border border-border bg-surface px-3.5 py-2 text-[15px] text-foreground transition hover:border-accent focus:border-accent focus:outline-none"
      >
        <span>{formatKo(value)}</span>
        <Calendar className="size-4 text-muted" aria-hidden />
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-20 w-72 rounded-xl border border-border bg-surface p-3 shadow-lg">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => shift(-1)}
              aria-label="이전 달"
              className="inline-flex size-8 items-center justify-center rounded-lg text-muted transition hover:text-accent"
            >
              <ChevronLeft className="size-4" aria-hidden />
            </button>
            <span className="font-title text-[15px] font-semibold text-foreground">
              {ym.y}년 {ym.m}월
            </span>
            <button
              type="button"
              onClick={() => shift(1)}
              aria-label="다음 달"
              className="inline-flex size-8 items-center justify-center rounded-lg text-muted transition hover:text-accent"
            >
              <ChevronRight className="size-4" aria-hidden />
            </button>
          </div>

          <div className="mt-2 grid grid-cols-7 text-center">
            {WEEKDAYS.map((w) => (
              <div key={w} className="py-1 font-title text-[11px] text-muted">
                {w}
              </div>
            ))}
            {cells.map((d, i) => {
              if (d === null) return <div key={i} />;
              const ds = toYmd(ym.y, ym.m, d);
              const isSel = ds === value;
              const isToday = ds === today;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => pick(d)}
                  className={`mx-auto my-0.5 flex size-8 items-center justify-center rounded-lg text-[13px] transition ${
                    isSel
                      ? "bg-accent font-semibold text-white"
                      : isToday
                        ? "font-medium text-accent ring-1 ring-accent"
                        : "text-foreground hover:bg-background"
                  }`}
                >
                  {d}
                </button>
              );
            })}
          </div>

          <div className="mt-1 flex justify-between border-t border-hairline pt-2">
            <button
              type="button"
              onClick={() => {
                setValue(today);
                setOpen(false);
              }}
              className="font-title text-[12px] text-accent transition hover:opacity-80"
            >
              오늘
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="font-title text-[12px] text-muted transition hover:text-foreground"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
