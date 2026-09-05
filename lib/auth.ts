import jwt from "jsonwebtoken";
import { NextResponse, type NextRequest } from "next/server";

const DEV_SECRET = "your-secret-key";
let warned = false;

/**
 * Signing/verification secret.
 *
 * The development fallback is kept so an environment without JWT_SECRET keeps
 * working, but it is a publicly known string: anyone can mint a valid admin
 * token against it. Set JWT_SECRET in the deployment environment.
 */
export function jwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (secret) return secret;

  // On a live site the fallback would mean anyone can mint an admin token
  // against a string that is in this file. Refuse rather than serve that.
  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET must be set in production.");
  }

  if (!warned) {
    warned = true;
    console.warn(
      "[auth] JWT_SECRET is not set — falling back to a public default. " +
        "Admin tokens are forgeable until this is configured."
    );
  }
  return DEV_SECRET;
}

/**
 * Bearer-token guard for admin write endpoints.
 *
 * Every mutating route carried its own copy of this check — except the
 * services and content routes, which had none, leaving the site's copy and
 * service list writable by anyone who could reach the URL.
 *
 * Returns a 401 response to hand straight back, or null when authorised.
 */
export function requireAdmin(request: NextRequest): NextResponse | null {
  const header = request.headers.get("authorization");

  if (!header?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    jwt.verify(header.slice(7), jwtSecret());
    return null;
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
