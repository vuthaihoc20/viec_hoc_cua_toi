-- Viec hoc: Supabase database schema
-- Run this file in Supabase Dashboard > SQL Editor.
-- Schedule image uploads must use the private "schedule-images" bucket and
-- store objects under a first-level folder named with the authenticated user UUID.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null check (length(trim(title)) > 0),
  completed boolean not null default false,
  subject text,
  due_at timestamptz,
  urgent boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null check (length(trim(name)) > 0),
  description text not null default '',
  kind text not null default 'personal' check (kind in ('personal', 'team')),
  subject text not null default '',
  priority text not null default 'medium'
    check (priority in ('high', 'medium', 'normal')),
  progress smallint not null default 0 check (progress between 0 and 100),
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.schedule_subjects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null check (length(trim(name)) > 0),
  credits smallint check (credits is null or credits > 0),
  term text,
  created_at timestamptz not null default now(),
  unique (id, user_id)
);

create table if not exists public.schedule_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  subject_id uuid,
  title text not null check (length(trim(title)) > 0),
  weekday smallint not null check (weekday between 1 and 7),
  start_time time not null,
  end_time time not null check (end_time > start_time),
  room text,
  instructor text,
  notes text,
  created_at timestamptz not null default now(),
  constraint schedule_events_subject_owner_fkey
    foreign key (subject_id, user_id)
    references public.schedule_subjects (id, user_id)
    on delete cascade
);

create table if not exists public.schedule_images (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  storage_path text not null unique,
  file_name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.pomodoro_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  task_id uuid references public.tasks (id) on delete set null,
  mode text not null check (mode in ('focus', 'break')),
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  planned_seconds integer not null check (planned_seconds > 0),
  completed boolean not null default false
);

create index if not exists tasks_user_created_idx
  on public.tasks (user_id, created_at desc);
create index if not exists tasks_user_due_idx
  on public.tasks (user_id, due_at);
create index if not exists projects_user_updated_idx
  on public.projects (user_id, updated_at desc);
create index if not exists schedule_subjects_user_idx
  on public.schedule_subjects (user_id);
create index if not exists schedule_events_user_weekday_idx
  on public.schedule_events (user_id, weekday, start_time);
create index if not exists pomodoro_sessions_user_started_idx
  on public.pomodoro_sessions (user_id, started_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_tasks_updated_at on public.tasks;
create trigger set_tasks_updated_at
  before update on public.tasks
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
  before update on public.projects
  for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.tasks enable row level security;
alter table public.projects enable row level security;
alter table public.schedule_subjects enable row level security;
alter table public.schedule_events enable row level security;
alter table public.schedule_images enable row level security;
alter table public.pomodoro_sessions enable row level security;

grant usage on schema public to authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on
  public.tasks,
  public.projects,
  public.schedule_subjects,
  public.schedule_events,
  public.schedule_images,
  public.pomodoro_sessions
to authenticated;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

drop policy if exists "Users can manage own tasks" on public.tasks;
create policy "Users can manage own tasks"
  on public.tasks for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can manage own projects" on public.projects;
create policy "Users can manage own projects"
  on public.projects for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can manage own schedule subjects" on public.schedule_subjects;
create policy "Users can manage own schedule subjects"
  on public.schedule_subjects for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can manage own schedule events" on public.schedule_events;
create policy "Users can manage own schedule events"
  on public.schedule_events for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can manage own schedule images" on public.schedule_images;
create policy "Users can manage own schedule images"
  on public.schedule_images for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can manage own Pomodoro sessions" on public.pomodoro_sessions;
create policy "Users can manage own Pomodoro sessions"
  on public.pomodoro_sessions for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'schedule-images',
  'schedule-images',
  false,
  15728640,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Users can read own schedule image files" on storage.objects;
create policy "Users can read own schedule image files"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'schedule-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "Users can upload own schedule image files" on storage.objects;
create policy "Users can upload own schedule image files"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'schedule-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "Users can update own schedule image files" on storage.objects;
create policy "Users can update own schedule image files"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'schedule-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'schedule-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "Users can delete own schedule image files" on storage.objects;
create policy "Users can delete own schedule image files"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'schedule-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
