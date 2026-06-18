-- 개발용 예시 데이터 — 읽기 연결(목록/상세/태그)이 채워지는지 확인용.
-- 운영 콘텐츠는 어드민 글쓰기로 작성한다. 멱등(on conflict do nothing).

insert into posts (slug, type, title, excerpt, content, cover_image, status, featured, entry_date)
values
  (
    'how-i-built-this', 'post', '이 블로그는 어떻게 만들었나',
    '설화가 사는 이 공간을 Next.js와 Supabase로 짓기까지의 기록.',
    '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"처음엔 다른 블로그 플랫폼을 쓸까 했다. 하지만 글 하나 올리는 데 마찰이 크면 결국 손이 안 가게 된다."}]}]}',
    '/covers/build.svg', 'published', true, '2026-06-10'
  ),
  (
    'rsc-and-caching', 'post', 'RSC와 캐싱, 한 번에 이해하기',
    '서버 컴포넌트가 언제 DB를 때리는지, 방문자 수와 비용이 왜 분리되는지.',
    '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"서버 컴포넌트는 기본적으로 캐시된다. 그래서 방문자가 늘어도 매번 DB를 때리지 않는다."}]}]}',
    null, 'published', false, '2026-06-08'
  ),
  (
    '2026-06-12', 'journal', '종일 로고만 그린 날',
    '잘 안 풀렸지만, 그래도 한 발 나아갔다.',
    '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"잘 안 풀렸지만, 그래도 한 발 나아갔다. 내일은 색을 잡아봐야지."}]}]}',
    null, 'published', true, '2026-06-12'
  ),
  (
    '2026-06-11', 'journal', '오랜만에 일찍 잤다',
    '11시에 누웠더니 아침이 개운하다.',
    '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"11시에 누웠더니 아침이 개운하다. 이걸 계속할 수 있을까."}]}]}',
    null, 'published', false, '2026-06-11'
  )
on conflict (slug) do nothing;

insert into tags (name, slug)
values ('Next.js', 'nextjs'), ('회고', 'retrospective'), ('React', 'react'), ('공부', 'study')
on conflict (slug) do nothing;

insert into post_tags (post_id, tag_id)
select p.id, t.id
from posts p
join tags t
  on (p.slug = 'how-i-built-this' and t.slug in ('nextjs', 'retrospective'))
  or (p.slug = 'rsc-and-caching' and t.slug in ('react', 'study'))
on conflict do nothing;
