import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

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
    // Return default works if database fails
    return NextResponse.json({ works: defaultWorks }, { status: 200 });
  }
}
