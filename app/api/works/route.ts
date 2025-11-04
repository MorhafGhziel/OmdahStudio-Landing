import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

// Default works data
const defaultWorks = [
  {
    id: "01",
    title: "Deal",
    category: "تسويق",
    image: "/images/jedeal.png",
    video: "/videos/OmdahProduction.mp4",
    client: "Deal",
    year: "2024",
    featured: true,
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
    id: "02",
    title: "Deal",
    category: "تسويق",
    image: "/images/jedeal.png",
    client: "Deal",
    year: "2024",
    link: "/works/jedeal",
    description:
      "تغطية شاملة لفعالية إطلاق منتج جديد، مع إنتاج فيديو ترويجي ومحتوى لوسائل التواصل الاجتماعي",
    services: [
      "تغطية الفعالية",
      "إنتاج فيديو ترويجي",
      "محتوى وسائل التواصل الاجتماعي",
      "تصوير احترافي",
    ],
  },
  {
    id: "03",
    title: "Sabahik",
    category: "تسويق",
    image: "/images/sabahk.png",
    video: "/videos/Sabahik.mov",
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
    video: "/videos/Safeside.mp4",
    video2: "/videos/Safeside2.mov",
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
    video: "/videos/Shakkah.mov",
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

    return NextResponse.json({ works }, { status: 200 });
  } catch (error) {
    console.error("Error fetching works:", error);
    // Return default works if database fails
    return NextResponse.json({ works: defaultWorks }, { status: 200 });
  }
}
