import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDatabase } from "@/lib/mongodb";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
    const db = await getDatabase();
    const allowedEmail = await db.collection("allowedEmails").findOne({ 
      email: email.toLowerCase() 
    });

    if (!allowedEmail) {
      // Don't reveal that email is not allowed - return success anyway for security
      return NextResponse.json(
        { message: "If the email is registered, a code has been sent." },
        { status: 200 }
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
      await db.collection("authCodes").deleteOne({ email: email.toLowerCase(), code });
      return NextResponse.json(
        { error: "Failed to send verification code" },
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

