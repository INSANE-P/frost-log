/** "2026-06-10" → "2026.06.10" */
export function formatDate(iso: string): string {
  return iso.replaceAll("-", ".");
}

/** "2026-06-10" → { day: "10", weekday: "수" } — 기록 날짜 부각용 */
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
export function formatDay(iso: string): { day: string; weekday: string } {
  const d = new Date(iso + "T00:00:00");
  return { day: String(d.getDate()), weekday: WEEKDAYS[d.getDay()] };
}
