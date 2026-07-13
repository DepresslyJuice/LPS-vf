alter table public.courses
  add column if not exists status text not null default 'draft'
  check (status in ('draft', 'published', 'archived'));

create table if not exists public.course_sections (
  id text primary key default gen_random_uuid()::text,
  "courseId" text not null references public.courses(id) on delete cascade,
  title text not null,
  summary text not null default '',
  "order" integer not null check ("order" > 0)
);

create index if not exists course_sections_course_id_order_idx
  on public.course_sections ("courseId", "order");

create table if not exists public.course_resources (
  id text primary key default gen_random_uuid()::text,
  "sectionId" text not null references public.course_sections(id) on delete cascade,
  title text not null,
  type text not null check (type in ('link', 'text')),
  url text,
  content text
);

create index if not exists course_resources_section_id_idx
  on public.course_resources ("sectionId");

alter table public.course_sections enable row level security;
alter table public.course_resources enable row level security;
