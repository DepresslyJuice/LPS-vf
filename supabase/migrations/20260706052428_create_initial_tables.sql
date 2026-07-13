create extension if not exists pgcrypto;

create table if not exists public.students (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  email text not null unique,
  "enrolledCourseIds" text[] not null default '{}'
);

create table if not exists public.teachers (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  email text not null unique,
  specialty text not null
);

create table if not exists public.courses (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  description text not null,
  "teacherId" text not null references public.teachers(id) on delete restrict,
  capacity integer not null check (capacity > 0),
  status text not null default 'draft'
    check (status in ('draft', 'published', 'archived'))
);

alter table public.students enable row level security;
alter table public.teachers enable row level security;
alter table public.courses enable row level security;
