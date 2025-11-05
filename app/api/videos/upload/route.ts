import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import jwt from "jsonwebtoken";

const getIDriveClient = () => {
  if (
    process.env.IDRIVE_ENDPOINT &&
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

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `videos/${timestamp}_${originalName}`;

    const idriveClient = getIDriveClient();
    
    if (!idriveClient || !process.env.IDRIVE_BUCKET_NAME) {
      return NextResponse.json(
        { error: "IDrive e2 storage not configured" },
        { status: 500 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const command = new PutObjectCommand({
      Bucket: process.env.IDRIVE_BUCKET_NAME,
      Key: filename,
      Body: buffer,
      ContentType: file.type || "video/mp4",
    });

    await idriveClient.send(command);

    const publicUrl = `https://s3.${process.env.IDRIVE_REGION || "us-west-1"}.idrivee2.com/${process.env.IDRIVE_BUCKET_NAME}/${filename}`;

    return NextResponse.json(
      { 
        url: publicUrl,
        filename: filename,
        storage: "idrive"
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading video:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorDetails = error instanceof Error ? error.stack : String(error);
    console.error("Error details:", errorDetails);
    
    return NextResponse.json(
      { 
        error: "Failed to upload video",
        message: errorMessage,
        details: process.env.NODE_ENV === "development" ? errorDetails : undefined
      },
      { status: 500 }
    );
  }
}
