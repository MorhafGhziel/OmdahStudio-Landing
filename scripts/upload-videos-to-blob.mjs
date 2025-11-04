import { put } from "@vercel/blob";
import { readFile } from "fs/promises";
import { readdir } from "fs/promises";
import { join } from "path";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

const videosDir = join(process.cwd(), "public", "videos");

async function uploadVideos() {
  try {
    // Check for BLOB_READ_WRITE_TOKEN
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error(
        "❌ BLOB_READ_WRITE_TOKEN not found in environment variables!"
      );
      console.log("Please add BLOB_READ_WRITE_TOKEN to your .env.local file");
      console.log(
        "You can find it in Vercel Dashboard → Your Project → Settings → Environment Variables"
      );
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

    const uploadedVideos = [];

    for (const file of videoFiles) {
      try {
        console.log(`📤 Uploading ${file}...`);
        const filePath = join(videosDir, file);
        const fileBuffer = await readFile(filePath);

        // Determine content type
        let contentType = "video/mp4";
        if (file.endsWith(".mov")) {
          contentType = "video/quicktime";
        }

        const blob = await put(`videos/${file}`, fileBuffer, {
          access: "public",
          contentType: contentType,
        });

        uploadedVideos.push({
          filename: file,
          url: blob.url,
          path: `/videos/${file}`,
        });

        console.log(`   ✅ Uploaded: ${blob.url}\n`);
      } catch (error) {
        console.error(`   ❌ Failed to upload ${file}:`, error.message);
      }
    }

    console.log("\n" + "=".repeat(60));
    console.log("📊 UPLOAD SUMMARY");
    console.log("=".repeat(60));
    console.log(
      `✅ Successfully uploaded: ${uploadedVideos.length}/${videoFiles.length} videos\n`
    );

    console.log("📋 Video URLs (copy these to update your database):\n");
    uploadedVideos.forEach((video, index) => {
      console.log(`${index + 1}. ${video.filename}`);
      console.log(`   Old path: ${video.path}`);
      console.log(`   New URL:  ${video.url}\n`);
    });

    console.log("\n💡 Next steps:");
    console.log("1. Copy the URLs above");
    console.log("2. Update your MongoDB 'works' collection");
    console.log(
      "3. Replace video paths like '/videos/OmdahProduction.mp4' with the Blob URLs"
    );
    console.log("4. Deploy to Vercel\n");

    return uploadedVideos;
  } catch (error) {
    console.error("❌ Error uploading videos:", error);
    throw error;
  }
}

uploadVideos()
  .then(() => {
    console.log("✅ All videos processed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Upload failed:", error);
    process.exit(1);
  });
