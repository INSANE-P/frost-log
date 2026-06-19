-- 0004: "불 지피기" 반응 영속화
-- 익명 방문자도 누를 수 있어야 하지만, 테이블 직접 쓰기는 RLS로 계속 막는다.
-- 대신 "발행 글의 카운트 +1" 한 가지만 하는 좁은 함수를 익명에 노출한다(ADR-0016).
-- 모두 멱등 — 여러 번 실행해도 안전.

alter table posts
  add column if not exists stokes integer not null default 0;

-- 익명 쓰기를 위한 좁은 통로.
-- security definer: 함수는 소유자 권한으로 실행돼 RLS를 우회하지만,
-- 하는 일은 "발행된 글의 stokes +1" 딱 하나뿐. search_path 고정으로 하이재킹 방지.
create or replace function increment_stokes(p_slug text)
returns integer
language sql
security definer
set search_path = public
as $$
  update posts
    set stokes = stokes + 1
    where slug = p_slug and status = 'published'
  returning stokes;
$$;

-- 기본(PUBLIC) 실행권을 거두고, 익명·인증 역할에만 명시적으로 부여
revoke execute on function increment_stokes(text) from public;
grant execute on function increment_stokes(text) to anon, authenticated;
