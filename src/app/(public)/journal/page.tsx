import type { Metadata } from "next";
import { EmptyState } from "@/components/ui/EmptyState";
import { JournalCalendar } from "@/features/posts/components/JournalCalendar";
import { getList } from "@/features/posts/queries";

export const metadata: Metadata = { title: "기록" };

/** 기록(일기) — 눈송이 달력(히트맵)으로 날짜를 훑고, 누르면 그날 기록만. 아래는 날짜 부각 목록. */
export default async function JournalPage() {
  const entries = await getList("journal");

  // 서버 기준일을 내려 히트맵 격자를 결정적으로 그린다(서버/클라 동일 → 하이드레이션 안전)
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate(),
  ).padStart(2, "0")}`;

  return (
    <div className="mx-auto max-w-3xl px-5 pb-12 pt-20">
      <h1 className="text-[34px] font-bold tracking-tight text-foreground">기록</h1>
      <p className="mt-3 text-base text-muted">매일의 한 줄을 남깁니다.</p>

      {entries.length > 0 ? (
        <JournalCalendar entries={entries} today={today} />
      ) : (
        <div className="mt-10">
          <EmptyState message="아직 남긴 기록이 없어요" hint="곧 하루 한 줄씩 쌓일 거예요" />
        </div>
      )}
    </div>
  );
}
