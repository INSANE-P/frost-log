/**
 * 콘텐츠 도메인 타입.
 * 기록(journal)과 이야기(post)는 같은 모양을 공유하고 `type`으로 구분한다 —
 * 상세·에디터 레이아웃을 공유하기 위함(차이는 날짜 부각 정도).
 */
export type ContentType = "journal" | "post";

export type Entry = {
  slug: string;
  type: ContentType;
  title: string;
  excerpt: string;
  /** "YYYY-MM-DD" */
  date: string;
  tags?: string[];
  /** 홈 큐레이션(핀) 노출 여부 */
  featured?: boolean;
  /** 대표(커버) 이미지 경로. 없으면 본문 첫 이미지를 대표로 끌어올린다(coverOf 참고). */
  coverImage?: string;
  /** 본문 마크다운 원문 */
  body?: string;
  /** "불 지피기" 누적 수 */
  stokes?: number;
};

/** 타입에 맞는 상세 경로 */
export function entryHref(e: Pick<Entry, "type" | "slug">): string {
  return `/${e.type === "post" ? "posts" : "journal"}/${e.slug}`;
}

/**
 * 카드·상단에 노출할 대표 이미지.
 * 명시한 coverImage가 우선, 없으면 본문(마크다운)의 첫 이미지를 자동으로 끌어올린다
 * (글 안에 이미지를 넣기만 하면 목록에 대표로 보이게 — 글쓰기 마찰 최소화).
 */
export function coverOf(e: Pick<Entry, "coverImage" | "body">): string | undefined {
  if (e.coverImage) return e.coverImage;
  const m = e.body?.match(/!\[[^\]]*\]\(([^)]+)\)/);
  return m?.[1];
}
