import { NextResponse } from "next/server";
import type { PostgrestError } from "@supabase/supabase-js";

/**
 * Shared shapes for route handlers, so every endpoint fails the same way.
 */

export function ok<T>(body: T, status = 200) {
  return NextResponse.json(body, { status });
}

export function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Turn a Postgres error into a response. The message is logged in full and
 * only a category is returned — constraint names and column details are
 * server business.
 */
export function fromPostgres(scope: string, error: PostgrestError) {
  console.error(`[${scope}]`, error.code, error.message, error.details);

  // 23505 = unique_violation. The only one a user can act on.
  if (error.code === "23505") {
    return bad("A record with that value already exists.", 409);
  }

  return bad("Request failed", 500);
}

/** Build the public path for a project from its slug. */
export const workPath = (slug: string) => `/works/${slug}`;

/** URL-safe slug from a title, with a fallback for non-Latin input. */
export function slugify(title: string): string {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  // Arabic titles reduce to an empty string, so fall back to something
  // stable and unique rather than writing a row with a blank slug.
  return slug || `work-${Date.now().toString(36)}`;
}
