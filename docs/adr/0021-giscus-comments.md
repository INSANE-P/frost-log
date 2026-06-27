# ADR-0021: 댓글은 Giscus(GitHub Discussions)로 받는다

- 상태: 수락됨
- 날짜: 2026-06-21

## 맥락 (Context)

글에 깊은 대화를 받을 댓글이 필요했다. 무계정 가벼운 반응은 "불 지피기"가 이미 커버한다([ADR-0016](0016-stoke-anon-write.md)). 네이티브로 직접 댓글을 만들면 **익명 자유 텍스트** 때문에 스팸·모더레이션·살균(XSS) 부담을 우리가 다 떠안는다.

## 결정 (Decision)

- 댓글은 **Giscus(GitHub Discussions 기반)** 로 받는다. `@giscus/react`로 글 상세에 임베드한다.
- 설정: `mapping=pathname`, `strict=1`, `lang=ko`, `loading=lazy`, 반응 on. 카테고리는 **Announcement 형**(`댓글`)이라 아무나 새 토론을 못 만들어 스팸을 막는다.
- 우리 `.dark` 클래스를 감시해 **라이트/다크를 동기화**한다. 색은 **frost 커스텀 테마 CSS**(giscus 기본 테마를 `@import` 후 우리 토큰 색만 덮음)로 맞춘다 — 배포(https)에서 적용되고, 로컬(http)은 mixed-content로 커스텀 CSS가 차단돼 내장 `noborder` 테마로 폴백한다.

## 이유 (Rationale)

- **백엔드·DB·모더레이션 인프라 0** — 댓글은 우리 레포의 GitHub Discussions에 저장되고, 모더레이션은 GitHub에서 한다. 스팸은 GitHub 로그인 장벽으로 낮다.
- iframe 격리라 우리 페이지의 XSS 표면이 늘지 않는다.
- 저장이 GitHub Discussions라 **표시 방식만 교체**하면 나중에 셀프 렌더로 옮길 수 있다(종속 위험 낮음).
- 설정값(repo-id·category-id)은 공개라 커밋해도 안전하고, 정적 임베드라 로컬에서도 테스트된다 — **배포 직전 통합**에 적합.

## 트레이드오프 (Trade-off)

- **댓글 쓰려면 GitHub 계정**이 필요 — 개발 블로그라 수용. 무계정은 불 지피기로.
- 외부 스크립트·iframe 의존(giscus.app) — 다운되면 댓글만 안 뜬다. 필요 시 셀프 호스팅 가능.
- iframe이라 **SSR/SEO에는 안 잡힌다** — 댓글은 fold 아래라 영향이 작다.
- GitHub 로그인 UI의 구조는 못 바꾸지만, **색은 커스텀 테마로 frost에 맞춘다**(로그인 버튼·배경·테두리·링크 등). 단 커스텀 테마 CSS는 **https에서만** 로드되므로 로컬에선 내장 테마로 보인다 — 색 확인은 배포 후.

## 고려한 대안 (Alternatives)

- **네이티브(Supabase `comments` + 관리자 승인제)** — 완전한 브랜드 톤이지만 모더레이션·스팸·살균을 다 만들어야 해 개인 블로그엔 과함.
- **GitHub Discussions를 직접 렌더** — 표시는 더 네이티브지만, 작성용 OAuth 중개를 우리가 만들어야 해 비용·보안 부담이 큼.

## 결과 (Consequences)

- `features/posts/components/Comments.tsx`: `@giscus/react` 임베드 + 라이트/다크·환경(https/http)별 테마 동기화.
- `public/giscus-frost-{light,dark}.css`: frost 커스텀 테마(기본 테마 `@import` + 토큰 색 덮기).
- `PostArticle`: 본문·반응 아래 댓글 섹션.
- 의존성: `@giscus/react`.
