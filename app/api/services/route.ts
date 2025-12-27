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

// Default services to show when database is unavailable
const defaultServices = [
  {
    id: "01",
    title: "تصوير سكتشات",
    category: "تصوير",
    description: "تصوير احترافي يطلع منتجاتك بأفضل صورة ممكنة. باستخدام أحدث التقنيات والمعايير، نخلي تفاصيلها واضحة وجمالها يبان من أول نظرة.",
    features: [
      "تصوير احترافي",
      "تفاصيل واضحة",
      "أحدث التقنيات",
    ],
  },
  {
    id: "02",
    title: "مقاطع ريلز",
    category: "إنتاج",
    description: "رسوم متحركة تخطف الانتباه وتوصل رسالتك بطريقة سهلة وواضحة. حركات سلسة وجذابة تخلي محتواك تفاعلي ويشوفه كل اللي يشوفه.",
    features: [
      "رسوم متحركة",
      "حركات سلسة",
      "محتوى تفاعلي",
    ],
  },
  {
    id: "03",
    title: "كتابة محتوى",
    category: "محتوى",
    description: "محتوى إبداعي يعبر عن هوية براندك بطريقة قريبة للناس. بأسلوب جذاب يناسب جمهورك ويوصل رسالتك ويخدم أهدافك التسويقية.",
    features: [
      "محتوى إبداعي",
      "أسلوب جذاب",
      "خدمة الأهداف التسويقية",
    ],
  },
  {
    id: "04",
    title: "فويس اوفر",
    category: "صوت",
    description: "تسجيل صوتي احترافي يرفع جودة محتواك. أصوات واضحة ومؤثرة توصل رسالتك بطريقة احترافية تليق بمشروعك.",
    features: [
      "تسجيل احترافي",
      "أصوات واضحة",
      "جودة عالية",
    ],
  },
  {
    id: "05",
    title: "تصاميم ثلاثية أبعاد",
    category: "تصميم",
    description: "تصاميم ثري دي احترافية تعطي مشروعك بعد جديد. تصاميم واقعية تساعدك تبرز منتجاتك بطريقة مبتكرة وتشوف انتباه العملاء.",
    features: [
      "تصاميم واقعية",
      "بعد جديد",
      "طريقة مبتكرة",
    ],
  },
  {
    id: "06",
    title: "حملات ترويجية",
    category: "تسويق",
    description: "حملات متكاملة توصل رسالتك صح وتوصلها للناس. نخطط وننفذ اللي يهتمونك. أفكار جديدة، شغل مرتب، ونتائج تشوفها بعينك.",
    features: [
      "حملات متكاملة",
      "أفكار جديدة",
      "نتائج واضحة",
    ],
  },
  {
    id: "07",
    title: "تصوير منتجات",
    category: "تصوير",
    description: "تصوير احترافي يطلع منتجاتك بأفضل صورة ممكنة. باستخدام أحدث التقنيات والمعايير، نخلي تفاصيلها واضحة وجمالها يبان من أول نظرة.",
    features: [
      "تصوير احترافي",
      "تفاصيل واضحة",
      "أحدث التقنيات",
    ],
  },
  {
    id: "08",
    title: "موشن جرافيك",
    category: "إنتاج",
    description: "رسوم متحركة تخطف الانتباه وتوصل رسالتك بطريقة سهلة وواضحة. حركات سلسة وجذابة تخلي محتواك تفاعلي ويشوفه كل اللي يشوفه.",
    features: [
      "رسوم متحركة",
      "حركات سلسة",
      "محتوى تفاعلي",
    ],
  },
  {
    id: "09",
    title: "تغطيات",
    category: "إنتاج",
    description: "تغطية كاملة لفعالياتك ومناسباتك بجودة عالية. ننقل كل لحظة مهمة بدقة ونوثق جو الحدث بطريقة مميزة وتشوفها كل اللي يشوفها.",
    features: [
      "تغطية كاملة",
      "جودة عالية",
      "توثيق دقيق",
    ],
  },
];

// GET - Fetch all services
export async function GET() {
  try {
    // Log environment check
    console.log("[Services API] Environment:", process.env.NODE_ENV);
    console.log(
      "[Services API] MongoDB URI exists:",
      !!process.env.MONGODB_URI
    );

    console.log("[Services API] Attempting to fetch services...");

    const db = await getDatabase();
    console.log("[Services API] Database connection successful");

    // Test database connection
    await db.command({ ping: 1 });
    console.log("[Services API] Database ping successful");

    const services = await db.collection("services").find({}).toArray();
    console.log(`[Services API] Found ${services.length} services`);

    // If database is empty, seed with default services
    if (services.length === 0) {
      console.log("[Services API] Database is empty, seeding default services...");
      const seedServices = defaultServices.map((service) => ({
        ...service,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      await db.collection("services").insertMany(seedServices);
      const seededServices = await db.collection("services").find({}).toArray();
      return NextResponse.json(
        {
          services: seededServices,
          meta: {
            count: seededServices.length,
            environment: process.env.NODE_ENV,
            seeded: true,
          },
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        services,
        meta: {
          count: services.length,
          environment: process.env.NODE_ENV,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Services API] Error fetching services:", error);

    // More detailed error logging
    if (error instanceof Error) {
      console.error("[Services API] Error name:", error.name);
      console.error("[Services API] Error message:", error.message);
      console.error("[Services API] Error stack:", error.stack);
    }

    // Check MongoDB connection string
    const mongoUri = process.env.MONGODB_URI || "";
    const maskedUri = mongoUri.replace(/:([^@]+)@/, ":****@");
    console.error("[Services API] Using MongoDB URI:", maskedUri);

    // Return default services if database is unavailable
    // This allows the page to still display services even when MongoDB is down
    console.warn("[Services API] Database unavailable, returning default services");
    return NextResponse.json(
      {
        services: defaultServices,
        meta: {
          count: defaultServices.length,
          environment: process.env.NODE_ENV,
          databaseUnavailable: true,
        },
      },
      { status: 200 }
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
      console.error("Validation errors:", error.issues);
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: "Failed to create service",
        message: error instanceof Error ? error.message : "Unknown error"
      },
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
