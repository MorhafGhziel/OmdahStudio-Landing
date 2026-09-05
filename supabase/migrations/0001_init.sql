-- ============================================================
-- Omdah — initial schema
--
-- Run once in the Supabase SQL editor. Safe to re-run: every
-- statement is guarded, and the seed block only fills empty tables.
--
-- Reads are public (the site is public). Every write goes through
-- the service role from a route handler, which bypasses RLS — so
-- there is deliberately no anon insert/update/delete policy.
-- ============================================================

create extension if not exists "pgcrypto";

-- ---- Projects ----------------------------------------------

create table if not exists public.works (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title       text not null,
  category    text not null,
  client      text not null,
  year        text not null,
  description text not null default '',
  image       text,
  video       text,
  video2      text,
  featured    boolean not null default false,
  services    text[] not null default '{}',
  position    integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Only one project can hold the front page. A partial unique index
-- makes that a database rule rather than something the app has to
-- remember on every write.
create unique index if not exists works_single_featured
  on public.works (featured) where featured;

create index if not exists works_position_idx on public.works (position, created_at);

-- ---- Services ----------------------------------------------

create table if not exists public.services (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  category    text not null,
  description text not null,
  features    text[] not null default '{}',
  position    integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists services_position_idx on public.services (position, created_at);

-- ---- Clients -----------------------------------------------

create table if not exists public.clients (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  logo       text not null,
  position   integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists clients_position_idx on public.clients (position, created_at);

-- ---- Editable site copy ------------------------------------

create table if not exists public.site_content (
  section    text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ---- Who may sign in ---------------------------------------

create table if not exists public.allowed_emails (
  email      text primary key,
  created_at timestamptz not null default now()
);

-- Sign-in lowercases the address before looking it up, so a row holding any
-- capital is an address that can never sign in. Reject it at the door rather
-- than letting someone add one by hand in the dashboard and wonder why the
-- code never arrives.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'allowed_emails_lowercase'
  ) then
    alter table public.allowed_emails
      add constraint allowed_emails_lowercase check (email = lower(email));
  end if;
end $$;

create table if not exists public.login_codes (
  email      text primary key,
  code       text not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

-- ---- Row level security ------------------------------------

alter table public.works          enable row level security;
alter table public.services       enable row level security;
alter table public.clients        enable row level security;
alter table public.site_content   enable row level security;
alter table public.allowed_emails enable row level security;
alter table public.login_codes    enable row level security;

do $$
begin
  -- Public content: anyone may read, nobody may write without the
  -- service role.
  if not exists (select 1 from pg_policies where tablename = 'works' and policyname = 'works are public') then
    create policy "works are public" on public.works for select using (true);
  end if;

  if not exists (select 1 from pg_policies where tablename = 'services' and policyname = 'services are public') then
    create policy "services are public" on public.services for select using (true);
  end if;

  if not exists (select 1 from pg_policies where tablename = 'clients' and policyname = 'clients are public') then
    create policy "clients are public" on public.clients for select using (true);
  end if;

  if not exists (select 1 from pg_policies where tablename = 'site_content' and policyname = 'site content is public') then
    create policy "site content is public" on public.site_content for select using (true);
  end if;
end $$;

-- allowed_emails and login_codes get no policies at all: RLS is on
-- and nothing is permitted, so they are unreachable with the anon
-- key and readable only by the service role on the server.

-- ---- Keep updated_at honest --------------------------------

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

do $$
declare t text;
begin
  foreach t in array array['works', 'services', 'clients', 'site_content'] loop
    execute format('drop trigger if exists touch_%1$s on public.%1$s', t);
    execute format(
      'create trigger touch_%1$s before update on public.%1$s
       for each row execute function public.touch_updated_at()', t);
  end loop;
end $$;

-- ============================================================
-- Seed. Only runs while a table is empty, so re-running never
-- duplicates rows or overwrites edits made in the dashboard.
-- ============================================================

insert into public.works (slug, title, category, client, year, description, image, video, video2, featured, services, position)
select * from (values
  ('omdah-production', 'Omdah Production', 'إنتاج', 'Omdah', '2024',
   'إنتاج فيديو ترويجي يعرض أعمالنا وإنجازاتنا في مجال الإنتاج والتسويق',
   '/images/jedeal.png', 'OmdahProduction.mp4', null, true,
   array['إنتاج فيديو ترويجي','تصوير احترافي','مونتاج وتحرير','هوية بصرية'], 0),
  ('jedeal', 'Deal', 'تسويق', 'Deal', '2024',
   'تطوير هوية بصرية متكاملة وحملة تسويقية شاملة لـ Deal، تضمنت إنتاج فيديوهات ترويجية وتصميم مواد تسويقية',
   '/images/jedeal.png', 'jedeal.mp4', null, false,
   array['تطوير الهوية البصرية','إنتاج فيديوهات ترويجية','تصميم المواد التسويقية','حملة تسويقية شاملة'], 1),
  ('sabahik', 'Sabahik', 'تسويق', 'Sabahik', '2024',
   'تطوير هوية بصرية متكاملة وحملة تسويقية شاملة لـ Sabahik، تضمنت إنتاج فيديوهات ترويجية وتصميم مواد تسويقية',
   '/images/sabahk.png', 'Sabahik.mp4', null, false,
   array['تطوير الهوية البصرية','إنتاج فيديوهات ترويجية','تصميم المواد التسويقية','حملة تسويقية شاملة'], 2),
  ('safeside', 'Safeside', '3D', 'Safeside', '2023',
   'تصميم ثلاثي الأبعاد لمشروع معماري ضخم، مع إنتاج فيديو تفاعلي للعرض',
   '/images/safesidee.png', 'Safeside.mp4', 'Safeside2.mp4', false,
   array['تصميم ثلاثي الأبعاد','النمذجة المعمارية','إنتاج فيديو تفاعلي','العرض المرئي'], 3),
  -- Shakkah has no transcoded upload yet, so it carries no video and
  -- falls back to its still until one exists.
  ('shakkah', 'Shakkah', 'تسويق', 'Shakkah', '2024',
   'تطوير هوية بصرية متكاملة وحملة تسويقية شاملة لـ Shakkah، تضمنت إنتاج فيديوهات ترويجية وتصميم مواد تسويقية',
   '/images/Shakkah.png', null, null, false,
   array['تطوير الهوية البصرية','إنتاج فيديوهات ترويجية','تصميم المواد التسويقية','حملة تسويقية شاملة'], 4)
) as seed
where not exists (select 1 from public.works);

insert into public.services (title, category, description, features, position)
select * from (values
  ('تصوير سكتشات', 'تصوير', 'تصوير احترافي يطلع منتجاتك بأفضل صورة ممكنة. باستخدام أحدث التقنيات والمعايير، نخلي تفاصيلها واضحة وجمالها يبان من أول نظرة.', array['تصوير احترافي','تفاصيل واضحة','أحدث التقنيات'], 0),
  ('مقاطع ريلز', 'إنتاج', 'رسوم متحركة تخطف الانتباه وتوصل رسالتك بطريقة سهلة وواضحة. حركات سلسة وجذابة تخلي محتواك تفاعلي ويشوفه كل اللي يشوفه.', array['رسوم متحركة','حركات سلسة','محتوى تفاعلي'], 1),
  ('كتابة محتوى', 'محتوى', 'محتوى إبداعي يعبر عن هوية براندك بطريقة قريبة للناس. بأسلوب جذاب يناسب جمهورك ويوصل رسالتك ويخدم أهدافك التسويقية.', array['محتوى إبداعي','أسلوب جذاب','خدمة الأهداف التسويقية'], 2),
  ('فويس اوفر', 'صوت', 'تسجيل صوتي احترافي يرفع جودة محتواك. أصوات واضحة ومؤثرة توصل رسالتك بطريقة احترافية تليق بمشروعك.', array['تسجيل احترافي','أصوات واضحة','جودة عالية'], 3),
  ('تصاميم ثلاثية أبعاد', 'تصميم', 'تصاميم ثري دي احترافية تعطي مشروعك بعد جديد. تصاميم واقعية تساعدك تبرز منتجاتك بطريقة مبتكرة وتشوف انتباه العملاء.', array['تصاميم واقعية','بعد جديد','طريقة مبتكرة'], 4),
  ('حملات ترويجية', 'تسويق', 'حملات متكاملة توصل رسالتك صح وتوصلها للناس. نخطط وننفذ اللي يهتمونك. أفكار جديدة، شغل مرتب، ونتائج تشوفها بعينك.', array['حملات متكاملة','أفكار جديدة','نتائج واضحة'], 5),
  ('تصوير منتجات', 'تصوير', 'تصوير احترافي يطلع منتجاتك بأفضل صورة ممكنة. باستخدام أحدث التقنيات والمعايير، نخلي تفاصيلها واضحة وجمالها يبان من أول نظرة.', array['تصوير احترافي','تفاصيل واضحة','أحدث التقنيات'], 6),
  ('موشن جرافيك', 'إنتاج', 'رسوم متحركة تخطف الانتباه وتوصل رسالتك بطريقة سهلة وواضحة. حركات سلسة وجذابة تخلي محتواك تفاعلي ويشوفه كل اللي يشوفه.', array['رسوم متحركة','حركات سلسة','محتوى تفاعلي'], 7),
  ('تغطيات', 'إنتاج', 'تغطية كاملة لفعالياتك ومناسباتك بجودة عالية. ننقل كل لحظة مهمة بدقة ونوثق جو الحدث بطريقة مميزة وتشوفها كل اللي يشوفها.', array['تغطية كاملة','جودة عالية','توثيق دقيق'], 8)
) as seed
where not exists (select 1 from public.services);

insert into public.clients (name, logo, position)
select * from (values
  ('STC Bank', '/images/StcBank.png', 0),
  ('Zid', '/images/zid.png', 1),
  ('Pangaea', '/images/pangaea.png', 2),
  ('Safeside', '/images/safeside.png', 3),
  ('Al Dammam', '/images/aldammam.png', 4),
  ('Slope', '/images/slope.png', 5),
  ('Deal', '/images/deal.png', 6),
  ('شفل', '/images/شفل.png', 7),
  ('AMF', '/images/AMFlogo.png', 8),
  ('Unknown Room', '/images/Unknown-Room.png', 9),
  ('8Oz Coffee', '/images/02254bd4-0bd2-40c6-ab3d-45fc52844914_removalai_preview.png', 10),
  ('Client 1', '/images/f2c8e19a-b510-4653-89f4-3ab306ed9139_removalai_preview.png', 11),
  ('Client 2', '/images/e26e1692-ae63-482a-8ab0-0c34c917cc43_removalai_preview.png', 12),
  ('Client 3', '/images/9d1be18b-4426-469d-9076-67e22731bd92_removalai_preview.png', 13),
  ('Client 4', '/images/09191da8-fe58-4854-8891-c19ea6d9ce30_removalai_preview.png', 14),
  ('Mylk', '/images/mylk.png', 15)
) as seed
where not exists (select 1 from public.clients);

insert into public.site_content (section, data)
select * from (values
  ('hero', '{"title":"معك عُمدة","subtitle":"ما يعتمد عليه مشروعك","description":"شركة سعودية، نشتغل على المحتوى المرئي. نشتغل ببساطة، والبساطة هي قوتنا.","ctaText":"اكتشف خدماتنا","storyTitle":"قصتنا"}'::jsonb),
  ('services', '{"badge":"خدماتنا","title":"عمدة، وش عنده؟","description":"عنده خدمات إنتاجية فنية رهيبة تليق بك، بعملائك، بمجتمعك. نسوق لك بطريقة ترفع مشوارك!","ctaText":"تواصل معنا الآن"}'::jsonb),
  ('clients', '{"title":"عملائنا","description":"نفخر بالعمل مع مجموعة من العملاء المميزين"}'::jsonb),
  ('footer', '{"tagline":"ما يعتمد عليه مشروعك","contactHeading":"تواصل معنا","whatsappUrl":"https://wa.me/966558960098","instagramUrl":"https://www.instagram.com/omdah.sa","email":"Info@omdah.sa"}'::jsonb)
) as seed
where not exists (select 1 from public.site_content);

-- Seed the sign-in allowlist so you are not locked out. Add or remove
-- addresses from the admin panel afterwards.
--
-- Stored lowercase deliberately: sign-in lowercases whatever is typed
-- before looking it up, so a row saved as "Info@omdah.sa" would never be
-- matched and that address could never sign in. Typing it with capitals
-- still works.
insert into public.allowed_emails (email)
values
  ('info@omdah.sa'),
  ('ghzielmorhaf@gmail.com')
on conflict (email) do nothing;
