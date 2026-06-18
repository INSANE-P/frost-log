# ADR-0014: 본문 포맷 — 마크다운

- 상태: 수락됨
- 날짜: 2026-06-18

## 맥락 (Context)

[ADR-0011](0011-content-schema.md)에서 본문을 Tiptap JSON(jsonb)으로 정했었다. 글쓰기를 붙이기 전 다시 보니, 본문 포맷이 **독자에게 보이는 결과는 같고**(둘 다 같은 HTML로 렌더됨), 차이는 작성자(나) 쪽에만 있다.

## 결정 (Decision)

- **본문은 마크다운(text)으로 저장·작성한다.** Tiptap JSON을 대체한다.
- 렌더는 `react-markdown`(+ remark-gfm, rehype-highlight)로 화면(`.prose`)에서 한다.
- 스키마 `posts.content`는 `jsonb` → `text`로 바꾼다(0003).

## 이유 (Rationale)

- 독자가 보는 결과는 동일하다 — 포맷은 작성자 경험·저장 방식의 문제다.
- 마크다운은 **가볍고 포터블**하다: 텍스트라 백업·이전·검색·버전관리가 쉽고, 개발자에게 자연스러우며 코드·표가 많은 기술 글에 잘 맞는다.
- `react-markdown`은 원시 HTML을 렌더하지 않아 XSS에 안전하다(ADR-0011의 안전 근거를 그대로 만족).
- Tiptap의 WYSIWYG 이점은 비개발자·리치 블록에서 크지만, 개발자 1인 블로그엔 단순함·포터블이 더 중요하다.

## 고려한 대안 (Alternatives)

- **Tiptap JSON 유지** — WYSIWYG는 좋으나 무겁고 종속적. 독자 결과가 같으니 단순한 마크다운으로.
- **HTML 문자열 저장** — 다루기 까다롭고 별도 안전 처리가 필요해 기각(ADR-0011과 같은 이유).

## 결과 (Consequences)

- 스키마: `supabase/migrations/0003_markdown_content.sql` (`content` text)
- 렌더: `src/lib/content/Markdown.tsx` (`react-markdown`)
- 읽기: `queries.ts` — body는 마크다운 원문
- 본문 스타일·코드 하이라이트: `globals.css`(`.prose` + hljs 토큰)
- 후속: 마크다운 에디터(작성·미리보기)는 DB-D
- **ADR-0011의 "Tiptap jsonb" 본문 결정을 대체한다.**
