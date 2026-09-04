import { ObjectId } from "mongodb";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { getDatabase } from "@/lib/mongodb";
import { defaultClients } from "@/lib/seed";

const clientSchema = z.object({
  name: z.string().min(1),
  logo: z.string().min(1),
});

export async function GET() {
  try {
    const db = await getDatabase();
    const clients = await db.collection("clients").find({}).toArray();

    if (clients.length === 0) {
      const now = new Date();
      await db
        .collection("clients")
        .insertMany(
          defaultClients.map((c) => ({ ...c, createdAt: now, updatedAt: now }))
        );
      const seeded = await db.collection("clients").find({}).toArray();
      return NextResponse.json({ clients: seeded });
    }

    return NextResponse.json({ clients });
  } catch (error) {
    console.error("[clients] GET failed:", error);
    return NextResponse.json({
      clients: defaultClients.map((client, i) => ({
        _id: `default-${i}`,
        ...client,
      })),
    });
  }
}

export async function POST(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const data = clientSchema.parse(await request.json());
    const db = await getDatabase();
    const now = new Date();

    const result = await db
      .collection("clients")
      .insertOne({ ...data, createdAt: now, updatedAt: now });

    return NextResponse.json({ id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("[clients] POST failed:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: "Failed to create client" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Client ID is required" }, { status: 400 });
  }

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid client ID" }, { status: 400 });
  }

  try {
    const db = await getDatabase();
    const result = await db
      .collection("clients")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Client deleted" });
  } catch (error) {
    console.error("[clients] DELETE failed:", error);
    return NextResponse.json({ error: "Failed to delete client" }, { status: 500 });
  }
}
