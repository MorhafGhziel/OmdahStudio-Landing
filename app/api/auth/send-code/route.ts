import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { bad, fromPostgres, ok } from "@/lib/rest";
import { supabaseAdmin } from "@/lib/supabase";

const schema = z.object({ email: z.string().email() });

const CODE_TTL_MINUTES = 10;

/**
 * Step one of sign-in: mint a six-digit code for an allowlisted address.
 *
 * The response never reveals whether an address is on the list — an endpoint
 * that answers differently for known and unknown emails is an account
 * enumeration oracle. Both paths return the same body.
 */
export async function POST(request: NextRequest) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return bad("Invalid email");

  const email = parsed.data.email.toLowerCase().trim();
  const db = supabaseAdmin();

  const { data: allowed, error: lookupError } = await db
    .from("allowed_emails")
    .select("email")
    .eq("email", email)
    .maybeSingle();

  if (lookupError) return fromPostgres("auth.send-code", lookupError);

  const neutral = ok({ message: "If the email is registered, a code has been sent." });
  if (!allowed) return neutral;

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const expires = new Date(Date.now() + CODE_TTL_MINUTES * 60_000).toISOString();

  const { error: writeError } = await db
    .from("login_codes")
    .upsert({ email, code, expires_at: expires }, { onConflict: "email" });

  if (writeError) return fromPostgres("auth.send-code", writeError);

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    // In development the code goes to the terminal so the panel stays usable
    // before a mail provider is wired up. It is never returned in the HTTP
    // response — that would hand the code to anyone who can guess an address.
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[auth.send-code] RESEND_API_KEY not set. Dev login code for ${email}: ${code}`
      );
      return neutral;
    }

    // In production there is nowhere for the code to go. Say so plainly
    // rather than pretending it was sent.
    console.error("[auth.send-code] RESEND_API_KEY is not set; code not sent.");
    return NextResponse.json(
      { error: "Email delivery is not configured." },
      { status: 503 }
    );
  }

  try {
    // Resend reports API-level failures — an unverified sending domain, a
    // rejected recipient — in the returned `error`, not by throwing. Only
    // network faults reach the catch below, so a send that the API refused
    // used to be reported to the user as sent.
    const { error } = await new Resend(key).emails.send({
      // RESEND_FROM_EMAIL is the name already set in the deployment;
      // RESEND_FROM stays accepted so a local .env with either works.
      from:
        process.env.RESEND_FROM_EMAIL ??
        process.env.RESEND_FROM ??
        "Omdah <onboarding@resend.dev>",
      to: email,
      subject: `${code} — رمز الدخول إلى لوحة عُمدة`,
      text: `رمز الدخول: ${code}\n\nصالح لمدة ${CODE_TTL_MINUTES} دقائق.`,
    });

    if (error) {
      console.error("[auth.send-code] Resend refused the message:", error);
      return NextResponse.json({ error: "Could not send the code." }, { status: 502 });
    }
  } catch (error) {
    console.error("[auth.send-code] send failed:", error);
    return NextResponse.json({ error: "Could not send the code." }, { status: 502 });
  }

  return neutral;
}
