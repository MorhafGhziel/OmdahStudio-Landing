import { put } from "@vercel/blob";
import { readFile } from "fs/promises";
import { readdir } from "fs/promises";
import { join } from "path";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config({ path: ".env.local" });

const videosDir = join(process.cwd(), "public", "videos");

// MongoDB connection
const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://omdah_admin:omdah123@cluster0.4vpukx5.mongodb.net/omdah?retryWrites=true&w=majority";
const dbName = "omdah";

async function uploadAndUpdateVideos() {
  try {
    // Check for BLOB_READ_WRITE_TOKEN
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error("❌ BLOB_READ_WRITE_TOKEN not found in environment variables!");
      console.log("\n💡 To get the token:");
      console.log("1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables");
      console.log("2. Find BLOB_READ_WRITE_TOKEN and copy it");
      console.log("3. Add it to your .env.local file:\n");
      console.log("   BLOB_READ_WRITE_TOKEN=your_token_here\n");
      process.exit(1);
    }

    console.log("📁 Reading videos directory...");
    const files = await readdir(videosDir);
    const videoFiles = files.filter(
      (file) => file.endsWith(".mp4") || file.endsWith(".mov")
    );

    if (videoFiles.length === 0) {
      console.log("❌ No video files found in public/videos directory");
      process.exit(1);
    }

    console.log(`✅ Found ${videoFiles.length} video files\n`);

    // Upload videos
    const videoMappings = {};

    for (const file of videoFiles) {
      try {
        console.log(`📤 Uploading ${file}...`);
        const filePath = join(videosDir, file);
        const fileBuffer = await readFile(filePath);

        let contentType = "video/mp4";
        if (file.endsWith(".mov")) {
          contentType = "video/quicktime";
        }

        const blob = await put(`videos/${file}`, fileBuffer, {
          access: "public",
          contentType: contentType,
        });

        const oldPath = `/videos/${file}`;
        videoMappings[oldPath] = blob.url;

        console.log(`   ✅ Uploaded: ${blob.url}\n`);
      } catch (error) {
        console.error(`   ❌ Failed to upload ${file}:`, error.message);
      }
    }

    console.log("\n" + "=".repeat(60));
    console.log("📊 UPLOAD SUMMARY");
    console.log("=".repeat(60));
    console.log(
      `✅ Successfully uploaded: ${Object.keys(videoMappings).length}/${videoFiles.length} videos\n`
    );

    // Update database
    console.log("🔄 Updating database with Blob URLs...\n");

    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);

    const works = await db.collection("works").find({}).toArray();
    console.log(`Found ${works.length} works in database\n`);

    let updatedCount = 0;

    for (const work of works) {
      let needsUpdate = false;
      const updates = {};

      if (work.video && videoMappings[work.video]) {
        updates.video = videoMappings[work.video];
        needsUpdate = true;
        console.log(`  ${work.title}: video -> ${updates.video}`);
      }

      if (work.video2 && videoMappings[work.video2]) {
        updates.video2 = videoMappings[work.video2];
        needsUpdate = true;
        console.log(`  ${work.title}: video2 -> ${updates.video2}`);
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

    await client.close();

    console.log(`\n✅ Updated ${updatedCount} works in database`);
    console.log("\n🎉 All done! Videos are now stored in Blob Storage and database is updated.");
    console.log("   Deploy to Vercel and videos should work!\n");
  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  }
}

uploadAndUpdateVideos()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Process failed:", error);
    process.exit(1);
  });
