import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { getDatabase } from "@/lib/mongodb";

const contentSchema = z.object({
  section: z.string().min(1),
  data: z.record(z.string(), z.unknown()),
});

export async function GET() {
  try {
    const db = await getDatabase();
    const sections = await db.collection("content").find({}).toArray();

    const content: Record<string, unknown> = {};
    for (const section of sections) {
      content[section.section] = section.data;
    }

    return NextResponse.json({ content });
  } catch (error) {
    console.error("[content] GET failed:", error);
    // Empty means "use the built-in copy", which is a valid page.
    return NextResponse.json({ content: {} });
  }
}

export async function PUT(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const { section, data } = contentSchema.parse(await request.json());
    const db = await getDatabase();

    await db
      .collection("content")
      .updateOne(
        { section },
        { $set: { section, data, updatedAt: new Date() } },
        { upsert: true }
      );

    return NextResponse.json({ message: "Content updated" });
  } catch (error) {
    console.error("[content] PUT failed:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}
