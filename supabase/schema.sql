-- Run this script once in the Supabase SQL Editor.
-- It is safe to re-run after the first setup.

create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text not null,
  avatar_url text,
  created_at timestamptz default now() not null
);

create table if not exists public.food_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  restaurant_name text not null,
  city text not null,
  address text,
  latitude float8,
  longitude float8,
  rating smallint check (rating >= 1 and rating <= 5) not null default 5,
  price_per_person numeric(10, 2),
  recommended_dishes text[] default '{}'::text[],
  tags text[] default '{}'::text[],
  image_urls text[] not null default '{}'::text[],
  notes text,
  dining_date date default current_date not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Migrate databases created by earlier versions of this app.
alter table public.food_logs drop constraint if exists food_logs_user_id_fkey;
alter table public.food_logs
  add constraint food_logs_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;

alter table public.profiles enable row level security;
alter table public.food_logs enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" on public.profiles
  for select to authenticated using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile" on public.profiles
  for insert to authenticated with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "Users can view own food logs" on public.food_logs;
create policy "Users can view own food logs" on public.food_logs
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists "Users can insert own food logs" on public.food_logs;
create policy "Users can insert own food logs" on public.food_logs
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "Users can update own food logs" on public.food_logs;
create policy "Users can update own food logs" on public.food_logs
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users can delete own food logs" on public.food_logs;
create policy "Users can delete own food logs" on public.food_logs
  for delete to authenticated using (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('food-images', 'food-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Users can view own food images" on storage.objects;
create policy "Users can view own food images" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'food-images'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

drop policy if exists "Users can upload own food images" on storage.objects;
create policy "Users can upload own food images" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'food-images'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

drop policy if exists "Users can update own food images" on storage.objects;
create policy "Users can update own food images" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'food-images'
    and owner_id = (select auth.uid()::text)
  )
  with check (
    bucket_id = 'food-images'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

drop policy if exists "Users can delete own food images" on storage.objects;
create policy "Users can delete own food images" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'food-images'
    and owner_id = (select auth.uid()::text)
  );
