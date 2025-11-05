import { NextRequest, NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

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
        
        console.log(`[Video Proxy] Fetching from IDrive e2:`);
        console.log(`  Original URL: ${videoUrl}`);
        console.log(`  Parsed pathname: ${url.pathname}`);
        console.log(`  Path parts: ${JSON.stringify(pathParts)}`);
        console.log(`  Bucket: ${bucket}`);
        console.log(`  Key: ${key}`);
        console.log(`  Endpoint: ${process.env.IDRIVE_ENDPOINT}`);

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

        console.log(`[Video Proxy] S3 Command:`, {
          Bucket: bucket,
          Key: key,
          Range: range || 'none',
          Endpoint: `https://${process.env.IDRIVE_ENDPOINT}`,
        });

        const response = await s3Client.send(command);
        
        console.log(`[Video Proxy] Successfully fetched from S3`);
        
        if (!response.Body) {
          return NextResponse.json(
            { error: "Video not found" },
            { status: 404 }
          );
        }

        const stream = response.Body;
        if (!stream) {
          return NextResponse.json(
            { error: "No video data received" },
            { status: 500 }
          );
        }

        const chunks: Buffer[] = [];
        
        const streamBody = stream as any;
        for await (const chunk of streamBody) {
          chunks.push(Buffer.from(chunk));
        }
        
        const videoData = Buffer.concat(chunks);

        const contentType = response.ContentType || "video/mp4";
        const contentLength = response.ContentLength || videoData.length;
        const acceptRanges = response.AcceptRanges || "bytes";
        const contentRange = response.ContentRange;

        if (range && contentRange) {
          return new NextResponse(videoData, {
            status: 206,
            headers: {
              "Content-Range": contentRange,
              "Accept-Ranges": acceptRanges,
              "Content-Length": contentLength.toString(),
              "Content-Type": contentType,
              "Cache-Control": "public, max-age=31536000, immutable",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
              "Access-Control-Allow-Headers": "Range",
            },
          });
        }

        return new NextResponse(videoData, {
          headers: {
            "Content-Type": contentType,
            "Accept-Ranges": acceptRanges,
            "Content-Length": contentLength.toString(),
            "Cache-Control": "public, max-age=31536000, immutable",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
            "Access-Control-Allow-Headers": "Range",
          },
        });
      } catch (s3Error: any) {
        console.error("[Video Proxy] Error fetching from IDrive e2:", s3Error);
        console.error("[Video Proxy] Error details:", {
          message: s3Error.message,
          name: s3Error.name,
          code: s3Error.Code || s3Error.code,
          statusCode: s3Error.$metadata?.httpStatusCode,
        });
        
        if (s3Error.Code === 'NoSuchKey' || s3Error.Code === 'AccessDenied' || s3Error.$metadata?.httpStatusCode === 404) {
          return NextResponse.json(
            { error: `Video not found or access denied: ${s3Error.message}` },
            { status: 404 }
          );
        }
        
        console.log("[Video Proxy] Falling back to direct fetch...");
      }
    }

    const fetchOptions: RequestInit = {
      headers: {},
    };

    const range = request.headers.get("range");
    if (range) {
      fetchOptions.headers = {
        ...fetchOptions.headers,
        Range: range,
      };
    }
    
    const response = await fetch(videoUrl, fetchOptions);

    if (!response.ok) {
      console.error(
        `Failed to fetch video: ${response.status} ${response.statusText}`
      );
      console.error("Video URL:", videoUrl);
      return NextResponse.json(
        { error: "Failed to fetch video" },
        { status: response.status }
      );
    }

    const contentType = response.headers.get("content-type") || "video/mp4";
    const contentLength = response.headers.get("content-length");
    const acceptRanges = response.headers.get("accept-ranges") || "bytes";
    const contentRange = response.headers.get("content-range");

    if (response.status === 206 && range) {
      const videoData = await response.arrayBuffer();
      
      return new NextResponse(videoData, {
        status: 206,
        headers: {
          "Content-Range": contentRange || "",
          "Accept-Ranges": acceptRanges,
          "Content-Length": contentLength || videoData.byteLength.toString(),
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
          "Access-Control-Allow-Headers": "Range",
        },
      });
    }

    const videoData = await response.arrayBuffer();
    return new NextResponse(videoData, {
      headers: {
        "Content-Type": contentType,
        "Accept-Ranges": acceptRanges,
        "Content-Length": contentLength || videoData.byteLength.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
        "Access-Control-Allow-Headers": "Range",
      },
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

