<!--
  PR 제목 컨벤션: <type>: <요약>  (예: feat: 글 목록 페이지)
  type = feat | fix | refactor | docs | chore | style | test
-->

## 무엇을 (What)

이 PR이 하는 일을 한두 문장으로.

관련 이슈: #

## 왜 이렇게 했나 (Why)

<!-- 이 칸은 비우지 않는다. 선택의 근거를 남기는 게 이 레포의 핵심. -->

- 어떤 선택을 했고, 왜 그 선택인가
- 고려했지만 안 한 대안이 있다면 그 이유
- 관련 ADR이 있으면 링크: `docs/adr/XXXX-*.md`

## 코드 구조 설명 (How)

<!-- 리뷰어(=미래의 나)가 흐름을 빠르게 잡을 수 있게. -->

- 추가/변경된 핵심 파일과 각각의 역할
- 데이터 흐름 (읽기 RSC? 쓰기 Server Action? 어디서 검증?)
- 어느 경계(app / features / components / lib)에 두었고 왜

## 확인 (Checklist)

- [ ] `pnpm typecheck` 통과
- [ ] `pnpm lint` 통과
- [ ] 라이트/다크 모드 둘 다 확인 (UI 변경 시)
- [ ] 접근성: 시맨틱 태그 / 키보드 / 대비 (UI 변경 시)
- [ ] ADR 갱신/추가 (구조적 결정이 있었다면)
