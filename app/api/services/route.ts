import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDatabase } from "@/lib/mongodb";
import { ServiceType } from "@/lib/types";

// Validation schema for service cards
const serviceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  features: z.array(z.string()).min(1, "At least one feature is required"),
});

// GET - Fetch all services
export async function GET() {
  try {
    console.log("[Services API] Attempting to fetch services...");

    const db = await getDatabase();
    console.log("[Services API] Database connection successful");

    const services = await db.collection("services").find({}).toArray();
    console.log(`[Services API] Found ${services.length} services`);

    return NextResponse.json({ services }, { status: 200 });
  } catch (error) {
    console.error("[Services API] Error fetching services:", error);

    // More detailed error logging
    if (error instanceof Error) {
      console.error("[Services API] Error name:", error.name);
      console.error("[Services API] Error message:", error.message);
      console.error("[Services API] Error stack:", error.stack);
    }

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        error: "Failed to fetch services",
        details:
          process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}

// POST - Create new service
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = serviceSchema.parse(body);

    const db = await getDatabase();

    // Get the count of existing services to generate new ID
    const count = await db.collection("services").countDocuments();
    const newId = String(count + 1).padStart(2, "0");

    const newService: ServiceType = {
      id: newId,
      ...validatedData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("services").insertOne(newService);
    newService._id = result.insertedId;

    return NextResponse.json(
      { service: newService, message: "Service created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating service:", error);

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
      { error: "Failed to create service" },
      { status: 500 }
    );
  }
}

// PUT - Update existing service
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Service ID is required" },
        { status: 400 }
      );
    }

    const validatedData = serviceSchema.parse(updateData);
    const db = await getDatabase();

    const result = await db.collection("services").findOneAndUpdate(
      { id: id },
      {
        $set: {
          ...validatedData,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json(
      { service: result, message: "Service updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating service:", error);

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
      { error: "Failed to update service" },
      { status: 500 }
    );
  }
}

// DELETE - Delete service
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Service ID is required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const result = await db.collection("services").findOneAndDelete({ id: id });

    if (!result) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json(
      { service: result, message: "Service deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 }
    );
  }
}
