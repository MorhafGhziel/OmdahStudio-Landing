import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// GET - List all allowed emails (admin only)
export async function GET(request: NextRequest) {
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

    const db = await getDatabase();
    const allowedEmails = await db.collection("allowedEmails").find({}).toArray();

    return NextResponse.json({ emails: allowedEmails }, { status: 200 });
  } catch (error) {
    console.error("Error fetching allowed emails:", error);
    return NextResponse.json(
      { error: "Failed to fetch allowed emails" },
      { status: 500 }
    );
  }
}

// POST - Add allowed email (admin only)
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
    const validatedData = emailSchema.parse(body);

    const db = await getDatabase();
    
    // Check if email already exists
    const existing = await db.collection("allowedEmails").findOne({
      email: validatedData.email.toLowerCase(),
    });

    if (existing) {
      return NextResponse.json(
        { error: "Email already in allowed list" },
        { status: 400 }
      );
    }

    const result = await db.collection("allowedEmails").insertOne({
      email: validatedData.email.toLowerCase(),
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "Email added successfully", id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding allowed email:", error);

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
      { error: "Failed to add email" },
      { status: 500 }
    );
  }
}

// DELETE - Remove allowed email (admin only)
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
        { error: "Email ID is required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const result = await db.collection("allowedEmails").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Email not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Email removed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing allowed email:", error);
    return NextResponse.json(
      { error: "Failed to remove email" },
      { status: 500 }
    );
  }
}

