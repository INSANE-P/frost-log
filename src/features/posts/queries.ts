import { MOCK_ENTRIES } from "./mock";
import type { ContentType, Entry } from "./types";

/**
 * 읽기 경계(ADR-0002). 지금은 mock을 반환하지만, Supabase 연결 시 이 파일 내부만
 * 교체하면 페이지·컴포넌트는 그대로 동작한다. 모든 함수는 async로 둬 DB 호출과 시그니처를 맞춘다.
 */

const byDateDesc = (a: Entry, b: Entry) => b.date.localeCompare(a.date);

/** 홈 큐레이션: 핀(featured)된 항목 */
export async function getFeatured(): Promise<Entry[]> {
  return MOCK_ENTRIES.filter((e) => e.featured).sort(byDateDesc);
}

/** 특정 흐름의 최근 항목 n개 (홈 '최근 기록/이야기') */
export async function getRecent(type: ContentType, limit: number): Promise<Entry[]> {
  return MOCK_ENTRIES.filter((e) => e.type === type)
    .sort(byDateDesc)
    .slice(0, limit);
}

/** 목록(선택적으로 태그 필터) */
export async function getList(type: ContentType, tag?: string): Promise<Entry[]> {
  return MOCK_ENTRIES.filter((e) => e.type === type && (!tag || e.tags?.includes(tag))).sort(
    byDateDesc,
  );
}

/** 상세 1건 */
export async function getBySlug(type: ContentType, slug: string): Promise<Entry | null> {
  return MOCK_ENTRIES.find((e) => e.type === type && e.slug === slug) ?? null;
}

/** 같은 흐름의 인접 항목 — 상세 하단 내비용. prev=더 오래된, next=더 최근 */
export async function getAdjacent(
  type: ContentType,
  slug: string,
): Promise<{ prev: Entry | null; next: Entry | null }> {
  const list = await getList(type);
  const i = list.findIndex((e) => e.slug === slug);
  if (i === -1) return { prev: null, next: null };
  return {
    prev: i < list.length - 1 ? list[i + 1] : null,
    next: i > 0 ? list[i - 1] : null,
  };
}

/** 해당 흐름에서 쓰인 태그 목록 */
export async function getTags(type: ContentType): Promise<string[]> {
  const set = new Set<string>();
  for (const e of MOCK_ENTRIES) {
    if (e.type === type) e.tags?.forEach((t) => set.add(t));
  }
  return [...set];
}
