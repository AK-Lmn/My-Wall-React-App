-- Run once in the Supabase SQL Editor. Safe to rerun for this schema.
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_name text not null default 'Anonymous Friend'
    check (char_length(btrim(author_name)) between 1 and 80),
  body text not null check (char_length(body) <= 280 and char_length(btrim(body)) > 0),
  image_url text check (image_url is null or image_url ~ '^https://'),
  created_at timestamptz not null default now()
);

create index if not exists posts_created_at_id_idx on public.posts (created_at desc, id desc);
alter table public.posts enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'posts' and policyname = 'Public read posts') then
    create policy "Public read posts" on public.posts for select to anon, authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'posts' and policyname = 'Public insert posts') then
    create policy "Public insert posts" on public.posts for insert to anon, authenticated with check (true);
  end if;
end $$;

-- Clients can read and insert content, but cannot override IDs or timestamps.
revoke all on public.posts from anon, authenticated;
grant select on public.posts to anon, authenticated;
grant insert (author_name, body, image_url) on public.posts to anon, authenticated;

do $$ begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'posts') then
    alter publication supabase_realtime add table public.posts;
  end if;
end $$;
