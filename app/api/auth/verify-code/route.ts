import { type NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { jwtSecret } from "@/lib/auth";
import { bad, ok } from "@/lib/rest";
import { supabaseAdmin } from "@/lib/supabase";

const schema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

/** Step two: exchange a valid, unexpired code for a 24 hour admin token. */
export async function POST(request: NextRequest) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return bad("Invalid code");

  const email = parsed.data.email.toLowerCase().trim();
  const db = supabaseAdmin();

  const { data: row } = await db
    .from("login_codes")
    .select("code, expires_at")
    .eq("email", email)
    .maybeSingle();

  const valid =
    row && row.code === parsed.data.code && new Date(row.expires_at) > new Date();

  if (!valid) return bad("Invalid or expired code", 401);

  // Single use: burn it before handing back a token.
  await db.from("login_codes").delete().eq("email", email);

  const token = jwt.sign({ email, isAdmin: true }, jwtSecret(), {
    expiresIn: "24h",
  });

  return ok({ success: true, token, email });
}
