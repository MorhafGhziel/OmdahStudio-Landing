import { NextRequest, NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";

function streamToReadableStream(stream: Readable): ReadableStream<Uint8Array> {
  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          controller.enqueue(
            chunk instanceof Buffer ? chunk : Buffer.from(chunk)
          );
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const videoUrl = searchParams.get("url");

    if (!videoUrl) {
      return NextResponse.json(
        { error: "Missing video URL parameter" },
        { status: 400 }
      );
    }

    const isVercelBlob = videoUrl.includes("blob.vercel-storage.com");
    const isIDrive = videoUrl.includes("idrivee2.com");
    
    if (!isVercelBlob && !isIDrive) {
      return NextResponse.json(
        { error: "Invalid video URL - must be from Vercel Blob or IDrive e2" },
        { status: 400 }
      );
    }

    if (isIDrive && process.env.IDRIVE_ACCESS_KEY_ID && process.env.IDRIVE_SECRET_ACCESS_KEY) {
      try {
        const url = new URL(videoUrl);
        const bucket = process.env.IDRIVE_BUCKET_NAME || 'omdah';
        const pathParts = url.pathname.substring(1).split('/').filter(Boolean);
        
        let key: string;
        if (pathParts[0] === bucket) {
          key = pathParts.slice(1).join('/');
        } else {
          key = pathParts.slice(1).join('/') || pathParts.join('/');
        }
        
        if (!key.startsWith('videos/') && !key.includes('/')) {
          key = `videos/${key}`;
        }

        const s3Client = new S3Client({
          region: process.env.IDRIVE_REGION || "us-west-1",
          endpoint: `https://${process.env.IDRIVE_ENDPOINT}`,
          forcePathStyle: true,
          credentials: {
            accessKeyId: process.env.IDRIVE_ACCESS_KEY_ID,
            secretAccessKey: process.env.IDRIVE_SECRET_ACCESS_KEY,
          },
        });

        const range = request.headers.get("range");
        const command = new GetObjectCommand({
          Bucket: bucket,
          Key: key,
          ...(range && { Range: range }),
        });

        const response = await s3Client.send(command);
        
        if (!response.Body) {
          return NextResponse.json(
            { error: "Video not found" },
            { status: 404 }
          );
        }

        const stream = response.Body as Readable;
        const readableStream = streamToReadableStream(stream);

        const contentType = response.ContentType || "video/mp4";
        const contentLength = response.ContentLength?.toString();
        const acceptRanges = response.AcceptRanges || "bytes";
        const contentRange = response.ContentRange;

        const headers = new Headers({
          "Content-Type": contentType,
          "Accept-Ranges": acceptRanges,
          "Cache-Control": "public, max-age=31536000, immutable",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
          "Access-Control-Allow-Headers": "Range",
        });

        if (contentLength) {
          headers.set("Content-Length", contentLength);
        }

        if (range && contentRange) {
          headers.set("Content-Range", contentRange);
          return new NextResponse(readableStream, {
            status: 206,
            headers,
          });
        }

        return new NextResponse(readableStream, {
          headers,
        });
      } catch (s3Error: unknown) {
        const error = s3Error as { message?: string; name?: string; Code?: string; code?: string; $metadata?: { httpStatusCode?: number } };
        
        if (error.Code === 'NoSuchKey' || error.Code === 'AccessDenied' || error.$metadata?.httpStatusCode === 404) {
          return NextResponse.json(
            { error: `Video not found or access denied: ${error.message || 'Unknown error'}` },
            { status: 404 }
          );
        }
      }
    }

    const range = request.headers.get("range");
    const fetchOptions: RequestInit = {
      headers: range ? { Range: range } : {},
    };
    
    const response = await fetch(videoUrl, fetchOptions);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch video" },
        { status: response.status }
      );
    }

    const contentType = response.headers.get("content-type") || "video/mp4";
    const contentLength = response.headers.get("content-length");
    const acceptRanges = response.headers.get("accept-ranges") || "bytes";
    const contentRange = response.headers.get("content-range");

    const headers = new Headers({
      "Content-Type": contentType,
      "Accept-Ranges": acceptRanges,
      "Cache-Control": "public, max-age=31536000, immutable",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "Range",
    });

    if (contentLength) {
      headers.set("Content-Length", contentLength);
    }

    if (response.status === 206 && contentRange) {
      headers.set("Content-Range", contentRange);
      return new NextResponse(response.body, {
        status: 206,
        headers,
      });
    }

    return new NextResponse(response.body, {
      headers,
    });
  } catch (error) {
    console.error("Error proxying video:", error);
    return NextResponse.json(
      { error: "Failed to proxy video" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "Range",
    },
  });
}

