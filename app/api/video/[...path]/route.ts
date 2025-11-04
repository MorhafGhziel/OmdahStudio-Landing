import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathArray } = await params;
    const videoPath = pathArray.join("/");
    
    // Security: Prevent path traversal
    if (videoPath.includes("..") || videoPath.startsWith("/")) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }

    const filePath = join(process.cwd(), "public", "videos", videoPath);
    
    try {
      const file = await readFile(filePath);
      const fileExtension = videoPath.split(".").pop()?.toLowerCase();
      
      // Determine content type based on file extension
      let contentType = "video/mp4";
      if (fileExtension === "mov") {
        contentType = "video/quicktime";
      } else if (fileExtension === "webm") {
        contentType = "video/webm";
      }

      return new NextResponse(new Uint8Array(file), {
        headers: {
          "Content-Type": contentType,
          "Accept-Ranges": "bytes",
          "Cache-Control": "public, max-age=31536000, immutable",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (error) {
      console.error("Error reading video file:", error);
      return NextResponse.json(
        { error: "Video file not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error serving video:", error);
    return NextResponse.json(
      { error: "Failed to serve video" },
      { status: 500 }
    );
  }
}
