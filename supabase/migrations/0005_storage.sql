-- 0005: 에디터 이미지 업로드용 Storage 버킷 + 정책
-- 공개 읽기 버킷 post-images. 업로드/수정/삭제는 인증 사용자(나)만, 읽기는 공개.
-- 정책은 drop-if-exists 후 생성해 여러 번 실행해도 안전.

insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do nothing;

-- storage.objects RLS는 기본 활성. post-images 버킷에 한해 권한을 연다.
drop policy if exists "post-images insert by authenticated" on storage.objects;
create policy "post-images insert by authenticated"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'post-images');

drop policy if exists "post-images update by authenticated" on storage.objects;
create policy "post-images update by authenticated"
  on storage.objects for update to authenticated
  using (bucket_id = 'post-images');

drop policy if exists "post-images delete by authenticated" on storage.objects;
create policy "post-images delete by authenticated"
  on storage.objects for delete to authenticated
  using (bucket_id = 'post-images');

drop policy if exists "post-images read by anyone" on storage.objects;
create policy "post-images read by anyone"
  on storage.objects for select
  using (bucket_id = 'post-images');
