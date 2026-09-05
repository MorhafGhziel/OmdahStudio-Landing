"use client";

import { authHeaders } from "./data";
import { supabase } from "./supabase";

/**
 * Asset uploads.
 *
 * The server only mints a signed URL; the bytes go from the browser straight
 * to Supabase Storage. Routing a 45MB reel through a route handler would hit
 * the serverless request-body cap long before it finished.
 *
 * `onProgress` receives 0–1. Supabase's client gives no progress events, so a
 * large file reports 0 until it lands — callers should show an indeterminate
 * state rather than a stalled bar.
 */

type Kind = "image" | "video";

async function upload(kind: Kind, file: File): Promise<string> {
  const res = await fetch("/api/upload-url", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ kind, filename: file.name }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? body?.error ?? "تعذّر بدء الرفع");
  }

  const { bucket, path, token, value } = await res.json();

  const { error } = await supabase.storage
    .from(bucket)
    .uploadToSignedUrl(path, token, file, { contentType: file.type || undefined });

  if (error) throw new Error(error.message || "فشل الرفع");

  return value as string;
}

export const uploadImage = (file: File) => upload("image", file);
export const uploadVideo = (file: File) => upload("video", file);
