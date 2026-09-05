import { type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { bad, ok } from "@/lib/rest";
import { SUPABASE_URL, supabaseAdmin } from "@/lib/supabase";

/**
 * Hands the browser a short-lived signed URL so the file goes straight to
 * Supabase Storage.
 *
 * Uploads deliberately do not pass through this function: a serverless request
 * body is capped at a few megabytes, which a reel clears many times over.
 */

const BUCKETS = { image: "images", video: "videos" } as const;
type Kind = keyof typeof BUCKETS;

/**
 * Storage keys are URL path segments, and most of these filenames arrive in
 * Arabic. Anything outside the safe set is dropped, and a timestamp keeps a
 * re-upload of the same name from overwriting the live file.
 */
function objectName(filename: string): string {
  const dot = filename.lastIndexOf(".");
  const ext = dot > 0 ? filename.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, "") : "";
  const stem = (dot > 0 ? filename.slice(0, dot) : filename)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  const base = `${stem || "file"}-${Date.now().toString(36)}`;
  return ext ? `${base}.${ext}` : base;
}

export async function POST(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const body = await request.json().catch(() => null);
  const kind: Kind = body?.kind === "video" ? "video" : "image";
  const filename = typeof body?.filename === "string" ? body.filename : "";

  if (!filename) return bad("filename is required");

  const bucket = BUCKETS[kind];
  const path = objectName(filename);

  const { data, error } = await supabaseAdmin()
    .storage.from(bucket)
    .createSignedUploadUrl(path);

  if (error || !data) {
    console.error("[upload-url]", error);
    return bad("تعذّر بدء الرفع", 500);
  }

  return ok({
    bucket,
    path,
    token: data.token,
    // Videos are stored as bare object names so the bucket can move; images
    // are referenced by full URL, matching the /images/* files already on disk.
    value: kind === "video" ? path : `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`,
  });
}
