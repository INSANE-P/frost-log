# ADR-0002: 기술 스택과 폴더 구조

- 상태: 수락됨
- 날짜: 2026-06-12

## 맥락 (Context)

읽기 많고 쓰기 적은 개인 블로그. 글쓰기 경험이 편해야 하고(웹에서 로그인→작성→즉시 발행), 유지보수성이 중요하다.

## 결정 (Decision)

**스택**

- Next.js 15 (App Router, React Server Components) — 읽기는 RSC로 DB 직접 조회, 쓰기는 Server Actions
- TypeScript strict
- Tailwind v4 (CSS-first `@theme`) + 2계층 CSS 변수 토큰
- Supabase (DB + Auth + Storage)
- Zod (입력 경계 검증)
- 에디터는 Tiptap 예정(콘텐츠는 jsonb로 저장) — 별도 이슈

**폴더 구조 (3원칙: 경계 분리 / 타입이 진실 / 콜로케이션)**

```
src/
  app/                  라우팅 전용(얇게). (public)·(admin) 라우트 그룹
  features/             도메인 단위. posts/{components,queries.ts,actions.ts,schema.ts}
  components/{brand,ui,layout}   도메인 무관 재사용 UI
  lib/{supabase,utils}  인프라/유틸
  styles/               디자인 토큰
  types/                DB 생성 타입
```

## 이유 (Rationale)

- **`src/` 사용**: 설정 파일과 앱 코드 분리로 루트가 깔끔.
- **도메인 기반 모듈(`features/`)**: 기능 수정 시 한 폴더만 열면 된다. 타입 기반 분류는 커질수록 파일이 흩어진다.
- **읽기/쓰기 분리(`queries.ts`/`actions.ts`)**: 캐시 성격이 정반대(RSC 캐시 vs revalidate)라 파일을 나눠 실수를 줄인다.
- **라우트 그룹 `(public)`/`(admin)`**: 방문자/관리자 레이아웃·인증 가드를 한 곳에서 통제.

## 고려한 대안 (Alternatives)

- **헤드리스 CMS(Sanity 등) / 정적 마크다운(git push 발행)** — 글쓰기 마찰 또는 디자인 제약. 웹 작성+즉시 발행을 위해 Supabase(DB) 선택. (비용은 개인 블로그 규모에서 사실상 무료)
- **타입 기반 폴더 구조** — 익숙하지만 확장성에서 도메인 기반에 밀림.

## 결과 (Consequences)

- 데이터 흐름: 읽기 = RSC → `queries.ts` → `supabase/server`; 쓰기 = Server Action → Zod 검증 → DB → `revalidatePath`.
- 인증: 미들웨어에서 세션 갱신(`src/middleware.ts`), 보호 경로 가드는 `(admin)/layout.tsx`.
- 후속: posts 도메인(목록/상세/작성)과 에디터(Tiptap)는 각각 별도 이슈/PR로 진행.
