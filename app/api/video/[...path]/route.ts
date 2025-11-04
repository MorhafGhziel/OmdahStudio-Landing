import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

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
    
    // Check if file exists
    if (!existsSync(filePath)) {
      console.error("Video file not found at:", filePath);
      return NextResponse.json(
        { error: "Video file not found" },
        { status: 404 }
      );
    }

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

      // Handle range requests for video streaming
      const range = request.headers.get("range");
      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : file.length - 1;
        const chunksize = end - start + 1;
        const chunk = file.slice(start, end + 1);

        return new NextResponse(chunk, {
          status: 206,
          headers: {
            "Content-Range": `bytes ${start}-${end}/${file.length}`,
            "Accept-Ranges": "bytes",
            "Content-Length": chunksize.toString(),
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=31536000, immutable",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }

      return new NextResponse(file, {
        headers: {
          "Content-Type": contentType,
          "Accept-Ranges": "bytes",
          "Content-Length": file.length.toString(),
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
