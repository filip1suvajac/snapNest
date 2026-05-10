create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  avatar_url text,
  bio text,
  created_at timestamp with time zone default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  message text,
  image_url text not null,
  latitude double precision,
  longitude double precision,
  location_visible boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  value int not null check (value in (-1, 1)),
  created_at timestamp with time zone default now(),
  unique(post_id, user_id)
);

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique(post_id, user_id)
);

create table if not exists public.push_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  token text not null,
  platform text,
  created_at timestamp with time zone default now(),
  unique(user_id, token)
);

create index if not exists posts_created_at_idx on public.posts(created_at desc);
create index if not exists posts_user_id_idx on public.posts(user_id);
create index if not exists comments_post_id_idx on public.comments(post_id);
create index if not exists votes_post_id_idx on public.votes(post_id);
create index if not exists favorites_user_id_idx on public.favorites(user_id);
create index if not exists push_tokens_user_id_idx on public.push_tokens(user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_posts_updated_at on public.posts;
create trigger set_posts_updated_at
before update on public.posts
for each row execute function public.set_updated_at();

drop trigger if exists set_comments_updated_at on public.comments;
create trigger set_comments_updated_at
before update on public.comments
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.votes enable row level security;
alter table public.favorites enable row level security;
alter table public.push_tokens enable row level security;

drop policy if exists "Profiles are public" on public.profiles;
create policy "Profiles are public" on public.profiles for select using (true);
drop policy if exists "Users insert own profile" on public.profiles;
create policy "Users insert own profile" on public.profiles for insert with check (auth.uid() = id);
drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "Posts are public" on public.posts;
create policy "Posts are public" on public.posts for select using (true);
drop policy if exists "Users insert own posts" on public.posts;
create policy "Users insert own posts" on public.posts for insert with check (auth.uid() = user_id);
drop policy if exists "Users update own posts" on public.posts;
create policy "Users update own posts" on public.posts for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Users delete own posts" on public.posts;
create policy "Users delete own posts" on public.posts for delete using (auth.uid() = user_id);

drop policy if exists "Comments are public" on public.comments;
create policy "Comments are public" on public.comments for select using (true);
drop policy if exists "Users insert own comments" on public.comments;
create policy "Users insert own comments" on public.comments for insert with check (auth.uid() = user_id);
drop policy if exists "Users update own comments" on public.comments;
create policy "Users update own comments" on public.comments for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Users delete own comments" on public.comments;
create policy "Users delete own comments" on public.comments for delete using (auth.uid() = user_id);

drop policy if exists "Votes are public" on public.votes;
create policy "Votes are public" on public.votes for select using (true);
drop policy if exists "Users insert own votes" on public.votes;
create policy "Users insert own votes" on public.votes for insert with check (auth.uid() = user_id);
drop policy if exists "Users update own votes" on public.votes;
create policy "Users update own votes" on public.votes for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Users delete own votes" on public.votes;
create policy "Users delete own votes" on public.votes for delete using (auth.uid() = user_id);

drop policy if exists "Users select own favorites" on public.favorites;
create policy "Users select own favorites" on public.favorites for select using (auth.uid() = user_id);
drop policy if exists "Users insert own favorites" on public.favorites;
create policy "Users insert own favorites" on public.favorites for insert with check (auth.uid() = user_id);
drop policy if exists "Users delete own favorites" on public.favorites;
create policy "Users delete own favorites" on public.favorites for delete using (auth.uid() = user_id);

drop policy if exists "Users select own push tokens" on public.push_tokens;
create policy "Users select own push tokens" on public.push_tokens for select using (auth.uid() = user_id);
drop policy if exists "Users insert own push tokens" on public.push_tokens;
create policy "Users insert own push tokens" on public.push_tokens for insert with check (auth.uid() = user_id);
drop policy if exists "Users delete own push tokens" on public.push_tokens;
create policy "Users delete own push tokens" on public.push_tokens for delete using (auth.uid() = user_id);
