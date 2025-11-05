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
    const imageUrl = searchParams.get("url");

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Missing image URL parameter" },
        { status: 400 }
      );
    }

    const isIDrive = imageUrl.includes("idrivee2.com");
    
    if (!isIDrive) {
      return NextResponse.json(
        { error: "Invalid image URL - must be from IDrive e2" },
        { status: 400 }
      );
    }

    if (process.env.IDRIVE_ACCESS_KEY_ID && process.env.IDRIVE_SECRET_ACCESS_KEY) {
      try {
        const url = new URL(imageUrl);
        const bucket = process.env.IDRIVE_BUCKET_NAME || 'omdah';
        const pathParts = url.pathname.substring(1).split('/').filter(Boolean);
        
        let key: string;
        if (pathParts[0] === bucket) {
          key = pathParts.slice(1).join('/');
        } else {
          key = pathParts.slice(1).join('/') || pathParts.join('/');
        }
        
        if (!key.startsWith('images/') && !key.includes('/')) {
          key = `images/${key}`;
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

        const command = new GetObjectCommand({
          Bucket: bucket,
          Key: key,
        });

        const response = await s3Client.send(command);
        
        if (!response.Body) {
          return NextResponse.json(
            { error: "Image not found" },
            { status: 404 }
          );
        }

        const stream = response.Body as Readable;
        const readableStream = streamToReadableStream(stream);

        const contentType = response.ContentType || "image/png";
        const contentLength = response.ContentLength?.toString();

        const headers = new Headers({
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
        });

        if (contentLength) {
          headers.set("Content-Length", contentLength);
        }

        return new NextResponse(readableStream, {
          headers,
        });
      } catch (s3Error: unknown) {
        const error = s3Error as { message?: string; name?: string; Code?: string; code?: string; $metadata?: { httpStatusCode?: number } };
        
        if (error.Code === 'NoSuchKey' || error.Code === 'AccessDenied' || error.$metadata?.httpStatusCode === 404) {
          return NextResponse.json(
            { error: `Image not found or access denied: ${error.message || 'Unknown error'}` },
            { status: 404 }
          );
        }
      }
    }

    return NextResponse.json(
      { error: "IDrive e2 storage not configured" },
      { status: 500 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to proxy image" },
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
    },
  });
}

