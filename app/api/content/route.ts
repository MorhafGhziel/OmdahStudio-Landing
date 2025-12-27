import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { z } from "zod";

// Content sections schema
const contentSchema = z.object({
  section: z.string(),
  data: z.record(z.string(), z.unknown()),
});

// GET - Fetch all content
export async function GET() {
  try {
    const db = await getDatabase();
    const content = await db.collection("content").find({}).toArray();

    // Convert array to object for easier access
    const contentMap: Record<string, unknown> = {};
    content.forEach((item) => {
      contentMap[item.section] = item.data;
    });

    return NextResponse.json({ content: contentMap }, { status: 200 });
  } catch (error) {
    console.error("Error fetching content:", error);
    // Return empty content instead of error to allow page to load with defaults
    // This prevents the page from breaking when MongoDB is unavailable
    return NextResponse.json({ content: {} }, { status: 200 });
  }
}

// PUT - Update content section
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = contentSchema.parse(body);

    const db = await getDatabase();

    // Upsert content section
    await db.collection("content").findOneAndUpdate(
      { section: validatedData.section },
      {
        $set: {
          section: validatedData.section,
          data: validatedData.data,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json(
      { message: "Content updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating content:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update content" },
      { status: 500 }
    );
  }
}

