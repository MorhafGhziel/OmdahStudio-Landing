import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anon) {
  // Failing here beats failing later: without these the storage base URL
  // silently becomes "undefined/storage/..." and every video 404s with no
  // clue why.
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set."
  );
}

export const SUPABASE_URL = url;

/** Public bucket that holds the reels. */
export const SUPABASE_VIDEO_BASE = `${url}/storage/v1/object/public/videos`;

/** Browser client. Reads only — row level security blocks anon writes. */
export const supabase = createClient(url, anon);

/**
 * Server client, holding the service role key.
 *
 * Bypasses row level security, so it must never be imported into anything
 * that ships to the browser — only route handlers. Created lazily so a
 * missing key surfaces on the first write rather than at module load, which
 * would take the whole site down over an admin-only capability.
 */
export function supabaseAdmin() {
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!service) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set.");
  }

  return createClient(url!, service, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
