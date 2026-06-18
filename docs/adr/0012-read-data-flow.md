# ADR-0012: 읽기 데이터 흐름

- 상태: 수락됨
- 날짜: 2026-06-18

## 맥락 (Context)

[ADR-0002](0002-stack-and-structure.md)에서 읽기는 RSC로 정했고, 이제 mock을 Supabase로 바꾼다. 이때 "조회에 TanStack Query 같은 클라이언트 캐시 라이브러리를 쓰는 게 낫지 않나?"라는 질문이 자연스럽게 나온다.

## 결정 (Decision)

- **공개 글 읽기는 RSC에서 Supabase를 직접 조회한다.** 클라이언트 데이터 라이브러리(TanStack Query 등)는 읽기에 쓰지 않는다.
- **읽기 경계는 `queries.ts` 한 곳.** DB row를 `Entry`로 매핑하고, 본문(Tiptap JSON)은 서버에서 가벼운 HTML로 렌더한다(텍스트 escape → XSS 안전).
- **published만 읽는다** — 앱에서 명시 + DB RLS로 이중 보호.
- **읽기 캐싱은 Next(ISR)로 푼다.** 지금은 동적(쿠키 클라이언트)이고, 공개 읽기 쿠키리스 + ISR + `revalidatePath`는 글쓰기(쓰기 경로)와 함께 도입한다.

## 이유 (Rationale)

- 블로그 글은 누가 보든 같다. 서버에서 한 번 렌더해 모두에게 주는 게(서버/CDN 캐시) 방문자별 클라이언트 캐시보다 비용·속도·SEO에 유리하다.
- 클라이언트 조회는 별도 API 레이어가 필요하고 본문이 초기 HTML에 안 담겨 검색·첫 화면에 불리하다. RSC는 DB를 서버에서 바로 읽어 그 단계가 없다.
- Tiptap을 JSON으로 저장하고 렌더만 갈아끼우면 원본이 안정적이다(ADR-0011).
- TanStack Query는 클라이언트 변경·낙관적 UX(어드민·반응)에서 빛난다 — 거기서 필요할 때 검토한다.

## 고려한 대안 (Alternatives)

- **TanStack Query로 클라이언트 조회** — CSR/SPA엔 표준이지만, Next RSC 블로그의 읽기엔 서버 캐시·SEO에서 밀려 기각.
- **지금 ISR 적용** — 갱신 트리거(`revalidatePath`)는 글쓰기가 있어야 의미 있어, 그때 함께 도입.

## 결과 (Consequences)

- 읽기: `src/features/posts/queries.ts` (Supabase, published만)
- 본문 렌더: `src/lib/content/tiptap.ts`
- 키 이름은 `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`(Supabase 현행)로 정렬
- 후속: 공개 읽기 쿠키리스 + ISR 캐싱(글쓰기 DB-D와 함께)
