"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, ChevronLeft, ChevronRight, Rows3, Snowflake } from "lucide-react";
import { formatDay } from "@/lib/utils/date";
import type { Entry } from "../types";
import { entryHref } from "../types";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const HEATMAP_WEEKS = 26;
const PITCH = 22; // 셀 16px + 간격 6px

const pad = (n: number) => String(n).padStart(2, "0");
const ymd = (y: number, m: number, d: number) => `${y}-${pad(m)}-${pad(d)}`;
function kDate(s: string): string {
  const [y, m, d] = s.split("-");
  return `${y}년 ${Number(m)}월 ${Number(d)}일`;
}
/** 날짜로부터 결정적인 각도 — 눈송이가 다 다르게 보이도록(기계적 반복 방지). */
const tilt = (date: string) => (Number(date.replaceAll("-", "")) % 7) * 12 - 36;

export function JournalCalendar({ entries, today }: { entries: Entry[]; today: string }) {
  const [bottom, setBottom] = useState<"list" | "calendar">("list");
  const [selected, setSelected] = useState<string | null>(null);
  const [ym, setYm] = useState(() => {
    const [y, m] = today.split("-");
    return { y: Number(y), m: Number(m) };
  });

  const entryDates = new Set(entries.map((e) => e.date));
  const titleByDate = new Map(entries.map((e) => [e.date, e.title]));
  const shown = selected ? entries.filter((e) => e.date === selected) : entries;

  // 히트맵에서 날짜를 고르면 달력도 그 달로 이동 → 어느 뷰든 일관된 피드백
  const pick = (date: string) =>
    setSelected((s) => {
      const next = s === date ? null : date;
      if (next) {
        const [y, m] = next.split("-");
        setYm({ y: Number(y), m: Number(m) });
      }
      return next;
    });
  const shiftMonth = (delta: number) =>
    setYm(({ y, m }) => {
      const n = m + delta;
      if (n < 1) return { y: y - 1, m: 12 };
      if (n > 12) return { y: y + 1, m: 1 };
      return { y, m: n };
    });

  const iconBtn = (active: boolean) =>
    `inline-flex size-9 items-center justify-center rounded-lg transition ${
      active ? "text-accent" : "text-muted hover:text-foreground"
    }`;
  const iconBg = (active: boolean) =>
    active ? { background: "color-mix(in srgb, var(--accent) 12%, transparent)" } : undefined;

  return (
    <div className="mt-10">
      <Heatmap
        today={today}
        selected={selected}
        entryDates={entryDates}
        titleByDate={titleByDate}
        onPick={pick}
      />

      {/* 컨트롤 바 */}
      <div className="mt-8 flex min-h-10 items-center justify-between border-t border-hairline pt-6">
        <div>
          {bottom === "calendar" ? (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => shiftMonth(-1)}
                aria-label="이전 달"
                className="inline-flex size-8 items-center justify-center rounded-lg text-muted transition hover:text-accent"
              >
                <ChevronLeft className="size-4" aria-hidden />
              </button>
              <span className="min-w-[5.5rem] text-center font-title text-base font-semibold text-foreground">
                {ym.y}.{pad(ym.m)}
              </span>
              <button
                type="button"
                onClick={() => shiftMonth(1)}
                aria-label="다음 달"
                className="inline-flex size-8 items-center justify-center rounded-lg text-muted transition hover:text-accent"
              >
                <ChevronRight className="size-4" aria-hidden />
              </button>
            </div>
          ) : selected ? (
            <span className="font-title text-sm font-medium text-accent">{kDate(selected)}</span>
          ) : (
            <span />
          )}
        </div>

        <div className="inline-flex gap-1">
          <button
            type="button"
            onClick={() => setBottom("list")}
            aria-label="목록으로 보기"
            aria-pressed={bottom === "list"}
            className={iconBtn(bottom === "list")}
            style={iconBg(bottom === "list")}
          >
            <Rows3 className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => setBottom("calendar")}
            aria-label="달력으로 보기"
            aria-pressed={bottom === "calendar"}
            className={iconBtn(bottom === "calendar")}
            style={iconBg(bottom === "calendar")}
          >
            <Calendar className="size-5" aria-hidden />
          </button>
        </div>
      </div>

      <div className="mt-6">
        {bottom === "list" ? (
          <div className="border-t border-hairline">
            {shown.map((e) => {
              const { day, weekday } = formatDay(e.date);
              return (
                <Link
                  key={e.slug}
                  href={entryHref(e)}
                  className="frost-rise group flex gap-6 border-b border-hairline py-6"
                >
                  <div className="w-12 shrink-0 pt-1 text-center">
                    <div className="font-title text-[26px] font-bold leading-none text-accent">{day}</div>
                    <div className="mt-1.5 font-title text-[11px] text-muted">{weekday}</div>
                  </div>
                  <div>
                    <h3 className="text-[20px] font-bold leading-snug tracking-tight text-foreground transition group-hover:text-accent">
                      {e.title}
                    </h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-muted">{e.excerpt}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <MonthAgenda
            year={ym.y}
            month={ym.m}
            today={today}
            selected={selected}
            entries={entries}
          />
        )}
      </div>
    </div>
  );
}

type HeatProps = {
  today: string;
  selected: string | null;
  entryDates: Set<string>;
  titleByDate: Map<string, string>;
  onPick: (date: string) => void;
};

/** 히트맵 — 박스/그라데이션 없이, 내린 눈만. 기록 있는 날은 눈송이(각도 제각각), 없는 날은 옅은 자국. */
function Heatmap({ today, selected, entryDates, titleByDate, onPick }: HeatProps) {
  const todayD = new Date(`${today}T00:00:00`);
  const end = new Date(todayD);
  end.setDate(end.getDate() + (6 - end.getDay()));
  const start = new Date(end);
  start.setDate(start.getDate() - (HEATMAP_WEEKS * 7 - 1));

  const weeks: { date: string; has: boolean; future: boolean }[][] = [];
  const cur = new Date(start);
  for (let w = 0; w < HEATMAP_WEEKS; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const ds = ymd(cur.getFullYear(), cur.getMonth() + 1, cur.getDate());
      week.push({ date: ds, has: entryDates.has(ds), future: cur > todayD });
      cur.setDate(cur.getDate() + 1);
    }
    weeks.push(week);
  }
  const monthLabels = weeks.map((week, i) => {
    const m = Number(week[0].date.slice(5, 7));
    const prev = i > 0 ? Number(weeks[i - 1][0].date.slice(5, 7)) : -1;
    return m !== prev ? `${m}월` : "";
  });

  return (
    <div className="overflow-x-auto">
      <div className="mx-auto" style={{ width: HEATMAP_WEEKS * PITCH }}>
        <div className="relative mb-2 h-3">
          {monthLabels.map((label, i) =>
            label ? (
              <span
                key={i}
                className="absolute font-title text-[10px] text-muted"
                style={{ left: i * PITCH }}
              >
                {label}
              </span>
            ) : null,
          )}
        </div>
        <div className="flex gap-1.5">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1.5">
              {week.map((cell) => {
                const isSel = selected === cell.date;
                return (
                  <button
                    key={cell.date}
                    type="button"
                    disabled={!cell.has}
                    onClick={() => onPick(cell.date)}
                    title={cell.has ? `${kDate(cell.date)} · ${titleByDate.get(cell.date)}` : undefined}
                    aria-label={cell.has ? `${kDate(cell.date)} 기록 보기` : kDate(cell.date)}
                    className={`flex size-4 items-center justify-center rounded-full transition ${
                      cell.has ? "cursor-pointer hover:scale-125" : "cursor-default"
                    } ${isSel ? "scale-125 ring-2 ring-accent ring-offset-2 ring-offset-background" : ""}`}
                  >
                    {cell.has ? (
                      <Snowflake
                        className={isSel ? "size-4 text-accent-bright" : "size-4 text-accent"}
                        strokeWidth={2.25}
                        style={{ transform: `rotate(${tilt(cell.date)}deg)` }}
                        aria-hidden
                      />
                    ) : cell.future ? null : (
                      <span
                        className="size-1 rounded-full"
                        style={{ background: "color-mix(in srgb, var(--muted) 22%, transparent)" }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** 달력 뷰 — frost 단색. 기록일엔 눈송이 마크 + 제목 칩, 오늘은 채운 원, 선택일은 테두리 강조. */
function MonthAgenda({
  year,
  month,
  today,
  selected,
  entries,
}: {
  year: number;
  month: number;
  today: string;
  selected: string | null;
  entries: Entry[];
}) {
  const entryByDate = new Map(entries.map((e) => [e.date, e]));
  const dim = new Date(year, month, 0).getDate();
  const lead = new Date(year, month - 1, 1).getDay();
  const cells: (number | null)[] = [
    ...Array.from({ length: lead }, () => null),
    ...Array.from({ length: dim }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="overflow-hidden rounded-2xl border border-hairline">
      <div className="grid grid-cols-7 border-b border-hairline">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-2.5 text-center font-title text-xs font-medium text-muted">
            {w}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((d, i) => {
          if (d === null)
            return (
              <div
                key={i}
                className="min-h-[84px] border-b border-r border-hairline"
                style={{ background: "color-mix(in srgb, var(--muted) 4%, transparent)" }}
              />
            );
          const date = ymd(year, month, d);
          const e = entryByDate.get(date);
          const isToday = date === today;
          const isSel = selected === date;
          return (
            <div
              key={i}
              className={`relative min-h-[84px] border-b border-r border-hairline p-2 ${
                isSel ? "ring-2 ring-inset ring-accent" : ""
              }`}
              style={e ? { background: "color-mix(in srgb, var(--accent) 5%, transparent)" } : undefined}
            >
              <div className="flex items-center justify-between">
                {e ? (
                  <Snowflake className="size-3.5 text-accent" strokeWidth={2.25} aria-hidden />
                ) : (
                  <span />
                )}
                {isToday ? (
                  <span className="flex size-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                    {d}
                  </span>
                ) : (
                  <span className="text-sm font-medium text-muted">{d}</span>
                )}
              </div>
              {e && (
                <Link
                  href={entryHref(e)}
                  title={e.title}
                  className="mt-1.5 block truncate rounded-md px-2 py-1 text-xs font-medium text-accent transition hover:bg-accent hover:text-white"
                  style={{ background: "color-mix(in srgb, var(--accent) 12%, transparent)" }}
                >
                  {e.title}
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
