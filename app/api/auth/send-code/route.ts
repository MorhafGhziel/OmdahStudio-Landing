import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDatabase } from "@/lib/mongodb";
import { Resend } from "resend";

// Initialize Resend only when API key is available
const getResend = () => {
  if (
    process.env.RESEND_API_KEY &&
    process.env.RESEND_API_KEY !== "dummy-key"
  ) {
    return new Resend(process.env.RESEND_API_KEY);
  }
  return null;
};

const sendCodeSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// POST - Send verification code to email
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = sendCodeSchema.parse(body);
    const { email } = validatedData;

    // Check if email is in allowed list
    let db;
    let allowedEmail;
    
    try {
      db = await getDatabase();
      allowedEmail = await db.collection("allowedEmails").findOne({ 
        email: email.toLowerCase() 
      });
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      // If MongoDB is unavailable, return a helpful error
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

    if (!allowedEmail) {
      // Return error to prevent confusion - user needs to know email is not authorized
      return NextResponse.json(
        { 
          error: "This email is not authorized to access the admin panel.",
          message: "If the email is registered, a code has been sent." // Keep for security
        },
        { status: 403 }
      );
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Clean up old codes for this email first
    await db.collection("authCodes").deleteMany({
      email: email.toLowerCase(),
      $or: [
        { used: true },
        { expiresAt: { $lt: new Date() } },
      ],
    });

    // Store code in database with expiration (10 minutes)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    await db.collection("authCodes").insertOne({
      email: email.toLowerCase(),
      code,
      expiresAt,
      used: false,
      createdAt: new Date(),
    });

    // Send email via Resend
    const resend = getResend();
    if (!resend) {
      console.error("Resend API key not configured");
      // Clean up the code if email service is not available
      if (db) {
        try {
          await db.collection("authCodes").deleteOne({ email: email.toLowerCase(), code });
        } catch (cleanupError) {
          console.error("Error cleaning up code:", cleanupError);
        }
      }
      return NextResponse.json(
        { error: "Email service is not configured" },
        { status: 503 }
      );
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || "info@omdah.sa";
    
    try {
      await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: "Your Omdah Admin Login Code",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
              🔐 Admin Login Verification Code
            </h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Your verification code is:
            </p>
            <div style="background: #f5f5f5; border: 2px dashed #007bff; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="color: #007bff; font-size: 32px; letter-spacing: 8px; margin: 0; font-family: monospace;">
                ${code}
              </h1>
            </div>
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              This code will expire in 10 minutes. If you didn't request this code, please ignore this email.
            </p>
            <p style="color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              Omdah Admin System
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      // Clean up the code if email fails
      try {
        await db.collection("authCodes").deleteOne({ email: email.toLowerCase(), code });
      } catch (cleanupError) {
        console.error("Error cleaning up code:", cleanupError);
      }
      
      let errorMessage = "Failed to send verification code. Please try again.";
      if (emailError instanceof Error) {
        if (emailError.message.includes("API key")) {
          errorMessage = "Email service configuration error. Please contact administrator.";
        } else if (emailError.message.includes("rate limit") || emailError.message.includes("rate_limit")) {
          errorMessage = "Too many requests. Please wait a moment and try again.";
        }
      }
      
      return NextResponse.json(
        { 
          error: errorMessage,
          details: process.env.NODE_ENV === "development" ? emailError instanceof Error ? emailError.message : String(emailError) : undefined
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Verification code sent to your email" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Send code error:", error);

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
      { error: "Failed to send verification code" },
      { status: 500 }
    );
  }
}

