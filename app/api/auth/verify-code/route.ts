import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { getDatabase } from "@/lib/mongodb";

const verifyCodeSchema = z.object({
  email: z.string().email("Invalid email address"),
  code: z.string().length(6, "Code must be 6 digits"),
});

// POST - Verify code and issue JWT token
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = verifyCodeSchema.parse(body);
    const { email, code } = validatedData;

    let db;
    try {
      db = await getDatabase();
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      let errorMessage = "Database connection unavailable. Please try again later.";
      if (process.env.NODE_ENV === "development") {
        if (dbError instanceof Error) {
          if (dbError.message.includes("authentication failed")) {
            errorMessage = "MongoDB authentication failed. Please check your MONGODB_URI in .env.local";
          } else if (dbError.message.includes("ENOTFOUND") || dbError.message.includes("ECONNREFUSED")) {
            errorMessage = "Cannot connect to MongoDB. Please check your connection string.";
          }
        }
      }
      return NextResponse.json(
        { 
          error: errorMessage,
          details: process.env.NODE_ENV === "development" ? dbError instanceof Error ? dbError.message : String(dbError) : undefined
        },
        { status: 503 }
      );
    }

    // Find the code
    const authCode = await db.collection("authCodes").findOne({
      email: email.toLowerCase(),
      code,
      used: false,
    });

    if (!authCode) {
      return NextResponse.json(
        { error: "Invalid or expired code" },
        { status: 401 }
      );
    }

    // Check if code is expired
    if (new Date() > authCode.expiresAt) {
      await db.collection("authCodes").updateOne(
        { _id: authCode._id },
        { $set: { used: true } }
      );
      return NextResponse.json(
        { error: "Code has expired" },
        { status: 401 }
      );
    }

    // Mark code as used
    await db.collection("authCodes").updateOne(
      { _id: authCode._id },
      { $set: { used: true } }
    );

    // Verify email is still in allowed list
    const allowedEmail = await db.collection("allowedEmails").findOne({
      email: email.toLowerCase(),
    });

    if (!allowedEmail) {
      return NextResponse.json(
        { error: "Email not authorized" },
        { status: 403 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      { email: email.toLowerCase(), isAdmin: true },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        token,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verify code error:", error);

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
      { error: "Failed to verify code" },
      { status: 500 }
    );
  }
}

