import { getDatabase } from "../lib/mongodb.js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// Map of old video paths to new Blob URLs
// You'll need to replace these with the actual Blob URLs after uploading
const videoMappings = {
  "/videos/OmdahProduction.mp4": "REPLACE_WITH_BLOB_URL", // e.g., "https://5slofyvhbitc779b.public.blob.vercel-storage.com/videos/OmdahProduction.mp4"
  "/videos/Sabahik.mov": "REPLACE_WITH_BLOB_URL",
  "/videos/Safeside.mp4": "REPLACE_WITH_BLOB_URL",
  "/videos/Safeside2.mov": "REPLACE_WITH_BLOB_URL",
  "/videos/Shakkah.mov": "REPLACE_WITH_BLOB_URL",
};

async function updateWorksWithBlobUrls() {
  try {
    const { db } = await getDatabase();
    const works = await db.collection("works").find({}).toArray();

    console.log(`Found ${works.length} works in database\n`);

    let updatedCount = 0;

    for (const work of works) {
      let needsUpdate = false;
      const updates = {};

      // Update video field
      if (work.video && videoMappings[work.video]) {
        if (videoMappings[work.video] !== "REPLACE_WITH_BLOB_URL") {
          updates.video = videoMappings[work.video];
          needsUpdate = true;
          console.log(`  ${work.title}: video -> ${updates.video}`);
        }
      }

      // Update video2 field
      if (work.video2 && videoMappings[work.video2]) {
        if (videoMappings[work.video2] !== "REPLACE_WITH_BLOB_URL") {
          updates.video2 = videoMappings[work.video2];
          needsUpdate = true;
          console.log(`  ${work.title}: video2 -> ${updates.video2}`);
        }
      }

      if (needsUpdate) {
        await db.collection("works").updateOne(
          { _id: work._id },
          {
            $set: {
              ...updates,
              updatedAt: new Date(),
            },
          }
        );
        updatedCount++;
      }
    }

    console.log(`\n✅ Updated ${updatedCount} works with Blob URLs`);
  } catch (error) {
    console.error("❌ Error updating works:", error);
    throw error;
  }
}

// First, check if mappings need to be updated
const needsMapping = Object.values(videoMappings).some(
  (url) => url === "REPLACE_WITH_BLOB_URL"
);

if (needsMapping) {
  console.log("⚠️  Please update the videoMappings object with actual Blob URLs!");
  console.log("Run 'npm run upload-videos' first to get the Blob URLs.\n");
  console.log("Current mappings:");
  Object.entries(videoMappings).forEach(([oldPath, newUrl]) => {
    console.log(`  ${oldPath} -> ${newUrl}`);
  });
  process.exit(1);
}

updateWorksWithBlobUrls()
  .then(() => {
    console.log("\n✅ All works updated successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Update failed:", error);
    process.exit(1);
  });
