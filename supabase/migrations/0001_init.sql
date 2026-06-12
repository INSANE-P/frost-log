-- Frost 초기 스키마: 글(posts), 태그(tags), 글-태그(post_tags)
-- 콘텐츠는 Tiptap JSON 을 jsonb 로 저장한다 (ADR-0001 참고).

create extension if not exists "pgcrypto";

create table if not exists posts (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  title        text not null,
  excerpt      text,
  content      jsonb not null default '{}'::jsonb,   -- Tiptap 문서 JSON
  cover_image  text,
  status       text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  view_count   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists tags (
  id   uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique
);

create table if not exists post_tags (
  post_id uuid not null references posts(id) on delete cascade,
  tag_id  uuid not null references tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

create index if not exists posts_status_published_at_idx
  on posts (status, published_at desc);

-- updated_at 자동 갱신
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists posts_set_updated_at on posts;
create trigger posts_set_updated_at
  before update on posts
  for each row execute function set_updated_at();

-- ───────────────────────── RLS ─────────────────────────
-- 방문자는 published 글만 읽고, 쓰기/수정/삭제는 인증된 사용자(= 글쓴이)만.
alter table posts enable row level security;
alter table tags enable row level security;
alter table post_tags enable row level security;

-- 읽기: 누구나 published 글
create policy "published posts are readable by anyone"
  on posts for select
  using (status = 'published');

-- 읽기(관리): 인증 사용자는 자기 draft 포함 전부
create policy "authenticated can read all posts"
  on posts for select to authenticated
  using (true);

-- 쓰기/수정/삭제: 인증 사용자만
create policy "authenticated can insert posts"
  on posts for insert to authenticated with check (true);
create policy "authenticated can update posts"
  on posts for update to authenticated using (true);
create policy "authenticated can delete posts"
  on posts for delete to authenticated using (true);

-- 태그: 읽기는 누구나, 쓰기는 인증 사용자
create policy "tags readable by anyone" on tags for select using (true);
create policy "authenticated manage tags" on tags for all to authenticated using (true) with check (true);

create policy "post_tags readable by anyone" on post_tags for select using (true);
create policy "authenticated manage post_tags" on post_tags for all to authenticated using (true) with check (true);
