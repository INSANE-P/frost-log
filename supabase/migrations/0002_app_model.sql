-- 0002: posts 를 앱의 Entry 모델에 맞춰 보강
-- 기록/이야기 구분(type), 홈 큐레이션(featured), 날짜 중심 기록의 표시 날짜(entry_date).
-- 모두 멱등(if not exists) — 여러 번 실행해도 안전.

alter table posts
  add column if not exists type text not null default 'post'
    check (type in ('journal', 'post')),
  add column if not exists featured boolean not null default false,
  add column if not exists entry_date date;

-- 표시 날짜가 비면 발행일(없으면 생성일)로 채운다
update posts
  set entry_date = coalesce(entry_date, published_at::date, created_at::date)
  where entry_date is null;

-- 흐름별 최신순 조회용
create index if not exists posts_type_entry_date_idx
  on posts (type, entry_date desc);
