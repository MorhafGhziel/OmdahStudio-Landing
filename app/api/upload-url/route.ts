import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import jwt from "jsonwebtoken";

const getIDriveClient = () => {
  if (
    process.env.IDRIVE_ACCESS_KEY_ID &&
    process.env.IDRIVE_SECRET_ACCESS_KEY
  ) {
    const endpoint = process.env.IDRIVE_ENDPOINT 
      ? `https://${process.env.IDRIVE_ENDPOINT}`
      : `https://s3.${process.env.IDRIVE_REGION || "us-west-1"}.idrivee2.com`;
    
    return new S3Client({
      region: process.env.IDRIVE_REGION || "us-west-1",
      endpoint: endpoint,
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.IDRIVE_ACCESS_KEY_ID,
        secretAccessKey: process.env.IDRIVE_SECRET_ACCESS_KEY,
      },
    });
  }
  return null;
};

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    try {
      jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await request.json();
    const { filename, contentType } = body;

    if (!filename) {
      return NextResponse.json(
        { error: "Filename is required" },
        { status: 400 }
      );
    }

    const idriveClient = getIDriveClient();
    
    if (!idriveClient) {
      return NextResponse.json(
        { 
          error: "IDrive e2 storage not configured",
          message: "Missing IDrive e2 credentials"
        },
        { status: 500 }
      );
    }

    if (!process.env.IDRIVE_BUCKET_NAME) {
      return NextResponse.json(
        { 
          error: "IDrive e2 bucket not configured",
          message: "IDRIVE_BUCKET_NAME environment variable is missing"
        },
        { status: 500 }
      );
    }

    const timestamp = Date.now();
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
    const key = `images/${timestamp}_${sanitizedFilename}`;

    const command = new PutObjectCommand({
      Bucket: process.env.IDRIVE_BUCKET_NAME,
      Key: key,
      ContentType: contentType || "image/png",
    });

    const signedUrl = await getSignedUrl(idriveClient, command, {
      expiresIn: 3600,
    });

    const publicUrl = `https://s3.${process.env.IDRIVE_REGION || "us-west-1"}.idrivee2.com/${process.env.IDRIVE_BUCKET_NAME}/${key}`;

    return NextResponse.json(
      { 
        uploadUrl: signedUrl,
        url: publicUrl,
        key: key,
        filename: key
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error generating upload URL:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    return NextResponse.json(
      { 
        error: "Failed to generate upload URL",
        message: errorMessage
      },
      { status: 500 }
    );
  }
}

