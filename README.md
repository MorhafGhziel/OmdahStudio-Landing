# عُمدة — Omdah Studio

The site for a Saudi visual-production studio. Arabic-first, right-to-left,
and dark-only: a gallery with the lights down, where the footage is the
brightest thing in the room.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

## Design system

The whole visual language lives in `app/globals.css` — tokens first, then a
handful of typography and layout primitives. Nothing else defines a colour or
a type size.

**There is no light theme and no light surface anywhere.** `color-scheme:
dark` is set on the root so UA-painted surfaces — form controls, scrollbars —
never flash white.

**Surfaces** — three near-black tiers, warm rather than blue-black so the
paper-gallery character survives the lights going out:
`ink` `#0c0b0a` (page canvas) · `ink-2` `#131211` (alternating band) ·
`ink-3` `#1b1917` (cards, media plates) · `hairline` `#2c2825` (borders).
Sections alternate canvas → band → canvas → band on hard cuts; there are no
gradients between them.

**Text** — `chalk` `#f4f1eb` for headings and inverted buttons, `ash`
`#b3ada3` for body, `smoke` `#7b756c` for metadata.

**Accent** — `clay` `#d9714f`, one colour, reserved for interaction: the
scroll rule, active nav, focus rings, hover fills, the sweep hand on the
leader mark. Lifted from the light build's `#b2482a`, which went muddy
against near-black; that value survives as `clay-deep` for pressed states.
Never a decorative fill.

**Anything solid inverts.** A filled button is `bg-chalk text-ink` — a dark
fill on a dark page is invisible. Same for the wordmark, which uses
`WhiteLogo.svg`, and the hamburger rules.

**Client logos** ship as dark marks on white plates, so they are inverted
rather than multiplied — see `components/sections/Clients.tsx` for the
filter chain and why its order has to be written by hand.

**Type** — three families, each with one job:

| Family | Role |
| --- | --- |
| IBM Plex Sans Arabic | every word of Arabic, 300–700 |
| Instrument Serif | Latin display: index numerals, project titles, the footer wordmark |
| Inter | Latin wall labels and metadata only |

Use the primitives — `.t-display`, `.t-h1`, `.t-h2`, `.t-h3`, `.t-lead`,
`.t-body`, `.t-serif`, `.t-label`, `.t-label-ar`, `.t-meta` — rather than
ad-hoc font sizes.

`.t-label` is Latin only. Arabic gets `.t-label-ar`: Arabic must never be
letterspaced, and it has no uppercase, so the Latin label's two defining
moves are both unavailable to it.

**Flat by rule.** No drop shadows anywhere. Depth comes from surface contrast
and 1px hairlines (`.ring-hairline`).

## Motion

One easing curve (`EASE` in `lib/motion.ts`) for everything, so the page
moves like a single object.

- `<Reveal>` — the site's only scroll entrance. Rise + defocus.
- `<WordReveal>` — headline words wipe up from behind a mask. Splits on
  whitespace only; Arabic is cursive, so a per-character version renders
  nonsense.
- `<Marquee>` — CSS-driven infinite ticker, pauses on hover. Pinned to LTR
  internally: under RTL the track anchors right and grows leftward, and the
  keyframes walk it off the edge.
- `<Preloader>` — curtain, once per session.
- `.grain` — film grain over the whole page, blended with `screen`: against
  near-black a multiplied layer has nothing left to darken and disappears.
- Everything collapses under `prefers-reduced-motion`.

## Architecture

```
app/
  (site)/               the public site — shares one layout with the chrome
    page.tsx            hero → manifesto → services → works → clients → contact
    works/[slug]/       project page
  admin/                the panel: overview, works, services, clients,
                        content, access
  login/                email + one-time-code sign-in
  api/                  content, works, services, clients, signed upload URLs
components/
  sections/             one file per band of the page
  layout/               header, footer, preloader, scroll progress
  motion/               Reveal, WordReveal, Marquee
  media/                SmartImage, SmartVideo
  graphics/             Lens (the studio mark)
  admin/                shell, ui kit, forms, media field, modal
lib/
  content.tsx           editable copy: one fetch, shared by every section
  data.ts               works / services / clients, promise-cached per URL
  media.ts              resolves a stored value to a playable URL
  upload.ts             browser → Supabase Storage, via a signed URL
  supabase.ts           anon client, and the server-only service-role client
  auth.ts               admin guard for every write endpoint
supabase/migrations/    the schema; run 0001_init.sql once
```

**Data.** Postgres on Supabase. Reads are public through RLS; every write goes
through a route handler holding the service role key, so the browser never
carries a credential that can change anything. `allowed_emails` and
`login_codes` have RLS on and no policies at all — unreachable with the anon
key, readable only on the server.

**Media.** Every `<video>` goes through `SmartVideo` and every image through
`SmartImage`, so source resolution, the play-while-visible rule, and the
degrade-to-a-still failure path are each written once. Files live in the
public `videos` and `images` buckets. Uploads never pass through a route
handler — the server mints a signed URL and the browser sends the bytes
straight to storage, because a 45MB reel clears the serverless body cap many
times over.

**Editing.** Everything is edited at `/admin`, gated on the sign-in token.
The public pages carry no editing chrome in the DOM at all, signed in or not.

## Environment

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | the project; also where media URLs are built from |
| `SUPABASE_SERVICE_ROLE_KEY` | server-only. Every admin write, and every read of the sign-in tables |
| `JWT_SECRET` | **set this.** Production refuses to start an admin session without it; development falls back to a public default and says so |
| `RESEND_API_KEY` | sends the one-time sign-in code. Unset in development, the code is printed to the server console instead |
| `RESEND_FROM_EMAIL` | optional sender address (`RESEND_FROM` also accepted) |

## First run

Paste `supabase/migrations/0001_init.sql` into the Supabase SQL editor and run
it once. It creates the tables, the policies, and seeds the current content
plus the first address that may sign in. Re-running it is safe — every
statement is guarded and the seed only fills empty tables.
