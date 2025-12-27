import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

// Client schema
const clientSchema = z.object({
  name: z.string().min(1),
  logo: z.string().min(1),
});

// Default clients to seed if database is empty
const defaultClients = [
  { name: "STC Bank", logo: "/images/StcBank.png" },
  { name: "Zid", logo: "/images/zid.png" },
  { name: "Pangaea", logo: "/images/pangaea.png" },
  { name: "Safeside", logo: "/images/safeside.png" },
  { name: "Al Dammam", logo: "/images/aldammam.png" },
  { name: "Slope", logo: "/images/slope.png" },
  { name: "Deal", logo: "/images/deal.png" },
  { name: "شفل", logo: "/images/شفل.png" },
  { name: "AMF", logo: "/images/AMFlogo.png" },
  { name: "Unknown Room", logo: "/images/Unknown-Room.png" },
  { name: "Client 1", logo: "/images/f2c8e19a-b510-4653-89f4-3ab306ed9139_removalai_preview.png" },
  { name: "Client 2", logo: "/images/e26e1692-ae63-482a-8ab0-0c34c917cc43_removalai_preview.png" },
  { name: "Client 3", logo: "/images/9d1be18b-4426-469d-9076-67e22731bd92_removalai_preview.png" },
  { name: "Client 4", logo: "/images/mylk.png" },
  { name: "Client 5", logo: "/images/09191da8-fe58-4854-8891-c19ea6d9ce30_removalai_preview.png" },
  { name: "Client 6", logo: "/images/02254bd4-0bd2-40c6-ab3d-45fc52844914_removalai_preview.png" },
];

// GET - Fetch all clients
export async function GET() {
  try {
    const db = await getDatabase();
    const clients = await db.collection("clients").find({}).toArray();

    // If database is empty, seed with default clients
    if (clients.length === 0) {
      const seedClients = defaultClients.map((client) => ({
        ...client,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      await db.collection("clients").insertMany(seedClients);
      const seededClients = await db.collection("clients").find({}).toArray();
      return NextResponse.json({ clients: seededClients }, { status: 200 });
    }

    return NextResponse.json({ clients }, { status: 200 });
  } catch (error) {
    console.error("Error fetching clients:", error);
    // Return default clients if database is unavailable
    // This allows the page to still display content
    const defaultClientsWithIds = defaultClients.map((client, index) => ({
      _id: `default-${index}`,
      ...client,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    return NextResponse.json({ clients: defaultClientsWithIds }, { status: 200 });
  }
}

// POST - Create new client
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
    const validatedData = clientSchema.parse(body);

    const db = await getDatabase();
    const result = await db.collection("clients").insertOne({
      ...validatedData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { message: "Client created successfully", id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating client:", error);

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
      { error: "Failed to create client" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a client
export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Client ID is required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    let result;
    try {
      result = await db.collection("clients").deleteOne({ _id: new ObjectId(id) });
    } catch {
      // If ObjectId conversion fails, try finding by a different field or return error
      return NextResponse.json(
        { error: "Invalid client ID format" },
        { status: 400 }
      );
    }

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Client deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting client:", error);
    return NextResponse.json(
      { error: "Failed to delete client" },
      { status: 500 }
    );
  }
}

