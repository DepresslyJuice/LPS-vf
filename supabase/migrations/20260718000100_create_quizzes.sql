-- Migration: Create quizzes table and index
create table if not exists public.quizzes (
  id text primary key default gen_random_uuid()::text,
  "sectionId" text not null references public.course_sections(id) on delete cascade,
  title text not null,
  description text not null default '',
  questions jsonb not null default '[]'::jsonb
);

create index if not exists quizzes_section_id_idx
  on public.quizzes ("sectionId");

alter table public.quizzes enable row level security;
