import { type NextRequest } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { bad, fromPostgres, ok } from "@/lib/rest";
import { supabaseAdmin } from "@/lib/supabase";

const schema = z.object({ email: z.string().email() });

/** Who may sign in. Managed from the admin panel. */
export async function GET(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const { data, error } = await supabaseAdmin()
    .from("allowed_emails")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) return fromPostgres("auth.allowed-emails.GET", error);
  return ok({ emails: data });
}

export async function POST(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return bad("Invalid email");

  const { data, error } = await supabaseAdmin()
    .from("allowed_emails")
    .insert({ email: parsed.data.email.toLowerCase().trim() })
    .select()
    .single();

  if (error) return fromPostgres("auth.allowed-emails.POST", error);
  return ok({ email: data }, 201);
}

export async function DELETE(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const email = new URL(request.url).searchParams.get("email");
  if (!email) return bad("Email is required");

  const db = supabaseAdmin();

  // Never let the last door close: an empty allowlist means nobody can ever
  // sign in again, and there is no UI left to fix it from.
  const { count } = await db
    .from("allowed_emails")
    .select("email", { count: "exact", head: true });

  if ((count ?? 0) <= 1) {
    return bad("Cannot remove the only address that can sign in.", 409);
  }

  const { error } = await db
    .from("allowed_emails")
    .delete()
    .eq("email", email.toLowerCase());

  if (error) return fromPostgres("auth.allowed-emails.DELETE", error);
  return ok({ success: true });
}
