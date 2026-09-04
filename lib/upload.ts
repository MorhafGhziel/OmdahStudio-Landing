"use client";

import { authHeaders } from "./data";

/**
 * Asset uploads.
 *
 * Large files go straight from the browser to object storage using a presigned
 * URL, because a serverless function body cap sits well below a 500MB reel.
 * Small images may take the simpler server route.
 */

const PRESIGN_THRESHOLD = 4 * 1024 * 1024; // above this, always presign

async function presign(
  endpoint: string,
  file: File,
  fallbackType: string
): Promise<string> {
  const contentType = file.type || fallbackType;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ filename: file.name, contentType }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? body?.error ?? "تعذّر بدء الرفع");
  }

  const { uploadUrl, url } = await res.json();

  const put = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": contentType },
  });

  if (!put.ok) throw new Error(`فشل الرفع (${put.status})`);

  return url as string;
}

export function uploadVideo(file: File): Promise<string> {
  return presign("/api/videos/upload-url", file, "video/mp4");
}

export async function uploadImage(file: File): Promise<string> {
  if (file.size > PRESIGN_THRESHOLD) {
    return presign("/api/upload-url", file, "image/png");
  }

  const body = new FormData();
  body.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken") ?? ""}`,
    },
    body,
  });

  if (!res.ok) {
    const json = await res.json().catch(() => null);
    throw new Error(json?.message ?? json?.error ?? "تعذّر رفع الصورة");
  }

  const { url } = await res.json();
  return url as string;
}
