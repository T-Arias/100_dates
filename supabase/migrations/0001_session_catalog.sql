-- Catalog feature: search/filter the 100 date ideas per session, with locked/completed state.
-- Run this in the Supabase SQL Editor (or via the CLI) against the project's database.

-- 1. Verify RLS on date_ideas allows read access before relying on the invoker RPC below:
--   select tablename, policyname, cmd from pg_policies where tablename in ('date_ideas','memories');
-- If date_ideas has RLS enabled without a select policy, uncomment:
-- create policy "date_ideas legibles por autenticados"
--   on public.date_ideas for select to authenticated using (true);

-- 2. Safety net against the two-partner race: one memory per (session, date_idea).
create unique index if not exists memories_session_idea_uq
  on public.memories (session_id, date_idea_id);

-- 3. Catalog RPC: date_ideas LEFT JOIN memories scoped to one session.
-- security invoker (default) is required so memories' RLS still applies per caller.
create or replace function public.get_session_catalog(p_session_id uuid)
returns table (
  id uuid,
  title text,
  description text,
  category text,
  difficulty int,
  is_completed boolean,
  memory_id uuid,
  photo_url text,
  photo_url_2 text,
  completed_at timestamptz
)
language sql
stable
set search_path = public
as $$
  select
    di.id,
    di.title,
    di.description,
    di.category,
    di.difficulty,
    (m.id is not null) as is_completed,
    m.id as memory_id,
    m.photo_url,
    m.photo_url_2,
    m.created_at as completed_at
  from date_ideas di
  left join memories m
    on m.date_idea_id = di.id
   and m.session_id = p_session_id
  order by di.category, di.title;
$$;

grant execute on function public.get_session_catalog(uuid) to authenticated;

-- 4. Enable Realtime on memories so a partner's completion is reflected live.
alter publication supabase_realtime add table public.memories;
