import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { getDatabase } from "@/lib/mongodb";
import { defaultServices } from "@/lib/seed";

const serviceSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب"),
  category: z.string().min(1, "الفئة مطلوبة"),
  description: z.string().min(10, "الوصف لا يقل عن ١٠ أحرف"),
  features: z.array(z.string()).min(1, "أضف ميزة واحدة على الأقل"),
});

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
    const services = await db.collection("services").find({}).toArray();

    if (services.length === 0) {
      const now = new Date();
      await db
        .collection("services")
        .insertMany(
          defaultServices.map((s) => ({ ...s, createdAt: now, updatedAt: now }))
        );
      const seeded = await db.collection("services").find({}).toArray();
      return NextResponse.json({ services: seeded });
    }

    return NextResponse.json({ services });
  } catch (error) {
    console.error("[services] GET failed:", error);
    // The page renders from defaults rather than showing an empty section.
    return NextResponse.json({ services: defaultServices });
  }
}

export async function POST(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const data = serviceSchema.parse(await request.json());
    const db = await getDatabase();

    const count = await db.collection("services").countDocuments();
    const now = new Date();
    const service = {
      id: String(count + 1).padStart(2, "0"),
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection("services").insertOne(service);
    return NextResponse.json(
      { service: { ...service, _id: result.insertedId } },
      { status: 201 }
    );
  } catch (error) {
    console.error("[services] POST failed:", error);
    return (
      validationError(error) ??
      NextResponse.json({ error: "Failed to create service" }, { status: 500 })
    );
  }
}

export async function PUT(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const { id, ...body } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Service ID is required" }, { status: 400 });
    }

    const data = serviceSchema.parse(body);
    const db = await getDatabase();

    const service = await db
      .collection("services")
      .findOneAndUpdate(
        { id },
        { $set: { ...data, updatedAt: new Date() } },
        { returnDocument: "after" }
      );

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ service });
  } catch (error) {
    console.error("[services] PUT failed:", error);
    return (
      validationError(error) ??
      NextResponse.json({ error: "Failed to update service" }, { status: 500 })
    );
  }
}

export async function DELETE(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Service ID is required" }, { status: 400 });
  }

  try {
    const db = await getDatabase();
    const service = await db.collection("services").findOneAndDelete({ id });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ service });
  } catch (error) {
    console.error("[services] DELETE failed:", error);
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
  }
}
