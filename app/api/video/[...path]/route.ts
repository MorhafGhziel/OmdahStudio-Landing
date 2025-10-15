import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const videoPath = resolvedParams.path.join("/");
    const filePath = join(process.cwd(), "public", "videos", videoPath);

    const fileBuffer = await readFile(filePath);

    // Determine content type based on file extension
    const contentType = videoPath.endsWith(".mov")
      ? "video/quicktime"
      : "video/mp4";

    return new NextResponse(new Uint8Array(fileBuffer), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Accept-Ranges": "bytes",
        "Content-Length": fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Video serving error:", error);
    return new NextResponse("Video not found", { status: 404 });
  }
}
