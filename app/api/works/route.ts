import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { ObjectId } from "mongodb";

function verifyAuth(request: NextRequest): { valid: boolean; error?: string } {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { valid: false, error: "Unauthorized" };
  }

  const token = authHeader.substring(7);
  try {
    jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    return { valid: true };
  } catch {
    return { valid: false, error: "Invalid token" };
  }
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const workSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  client: z.string().min(1, "Client is required"),
  year: z.string().min(1, "Year is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().optional(),
  video: z.string().optional(),
  video2: z.string().optional(),
  featured: z.boolean().optional(),
  services: z.array(z.string()).optional(),
});

// Default works data
const defaultWorks = [
  {
    id: "00",
    title: "Omdah Production",
    category: "إنتاج",
    image: "/images/jedeal.png",
    video: "https://s3.us-west-1.idrivee2.com/omdah/videos/OmdahProduction.mp4",
    client: "Omdah",
    year: "2024",
    featured: true,
    link: "/works/omdah-production",
    description:
      "إنتاج فيديو ترويجي يعرض أعمالنا وإنجازاتنا في مجال الإنتاج والتسويق",
    services: [
      "إنتاج فيديو ترويجي",
      "تصوير احترافي",
      "مونتاج وتحرير",
      "هوية بصرية",
    ],
  },
  {
    id: "01",
    title: "Deal",
    category: "تسويق",
    image: "/images/jedeal.png",
    video: "https://s3.us-west-1.idrivee2.com/omdah/videos/jedeal.mov",
    client: "Deal",
    year: "2024",
    featured: false,
    link: "/works/jedeal",
    description:
      "تطوير هوية بصرية متكاملة وحملة تسويقية شاملة لـ Deal، تضمنت إنتاج فيديوهات ترويجية وتصميم مواد تسويقية",
    services: [
      "تطوير الهوية البصرية",
      "إنتاج فيديوهات ترويجية",
      "تصميم المواد التسويقية",
      "حملة تسويقية شاملة",
    ],
  },
  {
    id: "03",
    title: "Sabahik",
    category: "تسويق",
    image: "/images/sabahk.png",
    video: "https://s3.us-west-1.idrivee2.com/omdah/videos/Sabahik.mov",
    client: "Sabahik",
    year: "2024",
    link: "/works/sabahik",
    description:
      "تطوير هوية بصرية متكاملة وحملة تسويقية شاملة لـ Sabahik، تضمنت إنتاج فيديوهات ترويجية وتصميم مواد تسويقية",
    services: [
      "تطوير الهوية البصرية",
      "إنتاج فيديوهات ترويجية",
      "تصميم المواد التسويقية",
      "حملة تسويقية شاملة",
    ],
  },
  {
    id: "04",
    title: "Safeside",
    category: "3D",
    image: "/images/safesidee.png",
    video: "https://s3.us-west-1.idrivee2.com/omdah/videos/Safeside.mp4",
    video2: "https://s3.us-west-1.idrivee2.com/omdah/videos/Safeside2.mov",
    client: "Safeside",
    year: "2023",
    link: "/works/safeside",
    description:
      "تصميم ثلاثي الأبعاد لمشروع معماري ضخم، مع إنتاج فيديو تفاعلي للعرض",
    services: [
      "تصميم ثلاثي الأبعاد",
      "النمذجة المعمارية",
      "إنتاج فيديو تفاعلي",
      "العرض المرئي",
    ],
  },
  {
    id: "05",
    title: "Shakkah",
    category: "تسويق",
    image: "/images/Shakkah.png",
    video: "https://s3.us-west-1.idrivee2.com/omdah/videos/Shakkah.mov",
    client: "Shakkah",
    year: "2024",
    link: "/works/shakkah",
    description:
      "تطوير هوية بصرية متكاملة وحملة تسويقية شاملة لـ Shakkah، تضمنت إنتاج فيديوهات ترويجية وتصميم مواد تسويقية",
    services: [
      "تطوير الهوية البصرية",
      "إنتاج فيديوهات ترويجية",
      "تصميم المواد التسويقية",
      "حملة تسويقية شاملة",
    ],
  },
];

// GET - Fetch all works
export async function GET() {
  try {
    const db = await getDatabase();
    const works = await db.collection("works").find({}).toArray();

    // If database is empty, seed with default works
    if (works.length === 0) {
      const seedWorks = defaultWorks.map((work) => ({
        ...work,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      await db.collection("works").insertMany(seedWorks);
      const seededWorks = await db.collection("works").find({}).toArray();
      return NextResponse.json({ works: seededWorks }, { status: 200 });
    }

    // Ensure Omdah Production is featured (not Deal)
    const featuredWork = works.find((work) => work.featured === true);
    const omdahProduction = works.find(
      (work) => work.title === "Omdah Production" || work.title === "Omdah"
    );
    const dealWork = works.find((work) => work.title === "Deal");

    if (featuredWork && featuredWork.title === "Deal") {
      // Remove featured from Deal
      await db.collection("works").updateOne(
        { _id: featuredWork._id },
        {
          $set: {
            featured: false,
            updatedAt: new Date(),
          },
        }
      );
    }

    if (omdahProduction && !omdahProduction.featured) {
      // Make Omdah Production featured
      await db.collection("works").updateOne(
        { _id: omdahProduction._id },
        {
          $set: {
            featured: true,
            video: "https://s3.us-west-1.idrivee2.com/omdah/videos/OmdahProduction.mp4",
            updatedAt: new Date(),
          },
        }
      );
    } else if (!omdahProduction) {
      // Create Omdah Production if it doesn't exist
      const defaultOmdah = defaultWorks.find(
        (work) => work.title === "Omdah Production"
      );
      if (defaultOmdah) {
        await db.collection("works").insertOne({
          ...defaultOmdah,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    // Ensure Deal has the correct video
    if (dealWork && dealWork.video !== "https://s3.us-west-1.idrivee2.com/omdah/videos/jedeal.mov") {
      await db.collection("works").updateOne(
        { _id: dealWork._id },
        {
          $set: {
            video: "https://s3.us-west-1.idrivee2.com/omdah/videos/jedeal.mov",
            featured: false,
            updatedAt: new Date(),
          },
        }
      );
    }

    // Remove duplicate Deal entries without video
    const duplicateDeals = works.filter(
      (work) =>
        work.title === "Deal" &&
        work._id !== dealWork?._id &&
        (!work.video || work.video === "")
    );
    if (duplicateDeals.length > 0) {
      const idsToRemove = duplicateDeals.map((work) => work._id);
      await db.collection("works").deleteMany({
        _id: { $in: idsToRemove },
      });
    }

    const updatedWorks = await db.collection("works").find({}).toArray();
    return NextResponse.json({ works: updatedWorks }, { status: 200 });
  } catch (error) {
    console.error("Error fetching works:", error);
    return NextResponse.json({ works: defaultWorks }, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = verifyAuth(request);
    if (!auth.valid) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = workSchema.parse(body);

    const db = await getDatabase();
    const slug = generateSlug(validatedData.title);
    const link = `/works/${slug}`;

    if (validatedData.featured) {
      await db.collection("works").updateMany(
        { featured: true },
        { $set: { featured: false, updatedAt: new Date() } }
      );
    }

    const newWork = {
      ...validatedData,
      id: new Date().getTime().toString(),
      link,
      services: validatedData.services || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("works").insertOne(newWork);

    return NextResponse.json(
      { success: true, work: { ...newWork, _id: result.insertedId } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating work:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create work" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = verifyAuth(request);
    if (!auth.valid) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const body = await request.json();
    const { _id, ...workData } = body;

    if (!_id) {
      return NextResponse.json(
        { error: "Work ID is required" },
        { status: 400 }
      );
    }

    const validatedData = workSchema.parse(workData);

    const db = await getDatabase();

    if (validatedData.featured) {
      await db.collection("works").updateMany(
        { featured: true, _id: { $ne: new ObjectId(_id) } },
        { $set: { featured: false, updatedAt: new Date() } }
      );
    }

    const slug = generateSlug(validatedData.title);
    const link = `/works/${slug}`;

    const updateData = {
      ...validatedData,
      link,
      services: validatedData.services || [],
      updatedAt: new Date(),
    };

    const result = await db.collection("works").updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Work not found" }, { status: 404 });
    }

    const updatedWork = await db.collection("works").findOne({
      _id: new ObjectId(_id),
    });

    return NextResponse.json(
      { success: true, work: updatedWork },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating work:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update work" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = verifyAuth(request);
    if (!auth.valid) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Work ID is required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const result = await db.collection("works").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Work not found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: "Work deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting work:", error);
    return NextResponse.json(
      { error: "Failed to delete work" },
      { status: 500 }
    );
  }
}
