import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import jwt from "jsonwebtoken";

// POST - Update works with Blob URLs
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
    const { videoMappings } = body;

    if (!videoMappings || typeof videoMappings !== "object") {
      return NextResponse.json(
        { error: "videoMappings object is required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const works = await db.collection("works").find({}).toArray();

    let updatedCount = 0;

    for (const work of works) {
      let needsUpdate = false;
      const updates: Record<string, string> = {};

      // Update video field
      if (work.video && videoMappings[work.video]) {
        updates.video = videoMappings[work.video];
        needsUpdate = true;
      }

      // Update video2 field
      if (work.video2 && videoMappings[work.video2]) {
        updates.video2 = videoMappings[work.video2];
        needsUpdate = true;
      }

      if (needsUpdate) {
        await db.collection("works").updateOne(
          { _id: work._id },
          {
            $set: {
              ...updates,
              updatedAt: new Date(),
            },
          }
        );
        updatedCount++;
      }
    }

    return NextResponse.json(
      {
        message: `Successfully updated ${updatedCount} works with Blob URLs`,
        updatedCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating works:", error);
    return NextResponse.json(
      { error: "Failed to update works" },
      { status: 500 }
    );
  }
}
