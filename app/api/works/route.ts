import { ObjectId } from "mongodb";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { getDatabase } from "@/lib/mongodb";
import { defaultWorks } from "@/lib/seed";

const workSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب"),
  category: z.string().min(1, "الفئة مطلوبة"),
  client: z.string().min(1, "العميل مطلوب"),
  year: z.string().min(1, "السنة مطلوبة"),
  description: z.string().min(1, "الوصف مطلوب"),
  image: z.string().optional(),
  video: z.string().optional(),
  video2: z.string().optional(),
  featured: z.boolean().optional(),
  services: z.array(z.string()).optional(),
});

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Only one project can hold the front page at a time. */
async function clearFeatured(
  db: Awaited<ReturnType<typeof getDatabase>>,
  except?: ObjectId
) {
  await db
    .collection("works")
    .updateMany(
      except ? { featured: true, _id: { $ne: except } } : { featured: true },
      { $set: { featured: false, updatedAt: new Date() } }
    );
}

function validationError(error: unknown) {
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { error: "Validation failed", details: error.issues },
      { status: 400 }
    );
  }
  return null;
}

export async function GET() {
  try {
    const db = await getDatabase();
    const works = await db.collection("works").find({}).toArray();

    if (works.length === 0) {
      const now = new Date();
      await db
        .collection("works")
        .insertMany(
          defaultWorks.map((w) => ({ ...w, createdAt: now, updatedAt: now }))
        );
      const seeded = await db.collection("works").find({}).toArray();
      return NextResponse.json({ works: seeded });
    }

    return NextResponse.json({ works });
  } catch (error) {
    console.error("[works] GET failed:", error);
    return NextResponse.json({ works: defaultWorks });
  }
}

export async function POST(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const data = workSchema.parse(await request.json());
    const db = await getDatabase();

    if (data.featured) await clearFeatured(db);

    const now = new Date();
    const work = {
      ...data,
      id: String(now.getTime()),
      link: `/works/${slugify(data.title)}`,
      services: data.services ?? [],
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection("works").insertOne(work);
    return NextResponse.json(
      { success: true, work: { ...work, _id: result.insertedId } },
      { status: 201 }
    );
  } catch (error) {
    console.error("[works] POST failed:", error);
    return (
      validationError(error) ??
      NextResponse.json({ error: "Failed to create work" }, { status: 500 })
    );
  }
}

export async function PUT(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const { _id, ...body } = await request.json();
    if (!_id) {
      return NextResponse.json({ error: "Work ID is required" }, { status: 400 });
    }

    const data = workSchema.parse(body);
    const db = await getDatabase();
    const objectId = new ObjectId(String(_id));

    if (data.featured) await clearFeatured(db, objectId);

    const work = await db.collection("works").findOneAndUpdate(
      { _id: objectId },
      {
        $set: {
          ...data,
          link: `/works/${slugify(data.title)}`,
          services: data.services ?? [],
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );

    if (!work) {
      return NextResponse.json({ error: "Work not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, work });
  } catch (error) {
    console.error("[works] PUT failed:", error);
    return (
      validationError(error) ??
      NextResponse.json({ error: "Failed to update work" }, { status: 500 })
    );
  }
}

export async function DELETE(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Work ID is required" }, { status: 400 });
  }

  try {
    const db = await getDatabase();
    const result = await db
      .collection("works")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Work not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[works] DELETE failed:", error);
    return NextResponse.json({ error: "Failed to delete work" }, { status: 500 });
  }
}
