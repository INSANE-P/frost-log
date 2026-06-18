-- 0003: 본문 포맷을 Tiptap JSON(jsonb) → Markdown(text)으로 전환 (ADR-0014).
-- 기존 시드 본문은 버린다(개발 데이터). 운영 콘텐츠는 어드민에서 마크다운으로 작성한다.

alter table posts alter column content drop default;
alter table posts alter column content type text using '';
alter table posts alter column content set default '';
