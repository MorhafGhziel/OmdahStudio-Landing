import { MongoClient, Db } from "mongodb";
import { attachDatabasePool } from "@vercel/functions";

// Get the MongoDB URI from environment variable (set by Vercel or fallback)
const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://omdah_admin:omdah123@cluster0.4vpukx5.mongodb.net/omdah?retryWrites=true&w=majority";
const dbName = "omdah";

// Connection options optimized for MongoDB Atlas free tier
const options = {
  maxPoolSize: 1, // Keep connection pool small for serverless
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 30000, // Free tier has 30s timeout
  connectTimeoutMS: 10000,
  // Free tier optimization
  minPoolSize: 0,
  maxIdleTimeMS: 25000, // Slightly less than the 30s timeout
  waitQueueTimeoutMS: 10000,
};

// Use globalThis for serverless environments to persist connections across invocations
declare global {
  var _mongoClient: MongoClient | undefined;
  var _mongoDb: Db | undefined;
}

let client: MongoClient | undefined;
let db: Db | undefined;

export async function connectToDatabase() {
  // In production (serverless), use cached connection from globalThis
  if (typeof window === "undefined") {
    // Check if cached connection exists and is still alive
    if (globalThis._mongoClient && globalThis._mongoDb) {
      try {
        // Ping the database to check if connection is alive
        await globalThis._mongoDb.admin().ping();
        client = globalThis._mongoClient;
        db = globalThis._mongoDb;
        return { client, db };
      } catch {
        // Connection is dead, clear cache
        console.log("Cached connection is dead, creating new one...");
        globalThis._mongoClient = undefined;
        globalThis._mongoDb = undefined;
      }
    }
  } else {
    // In browser environment, use module-level cache
    if (client && db) {
      return { client, db };
    }
  }

  try {
    console.log("Creating new MongoDB connection...");
    
    client = new MongoClient(uri, options);
    
    // Attach Vercel's database pool for optimal serverless performance
    if (typeof window === "undefined") {
      attachDatabasePool(client);
    }
    
    await client.connect();
    db = client.db(dbName);

    console.log("Connected to MongoDB successfully");

    // Cache connection for serverless environments
    if (typeof window === "undefined") {
      globalThis._mongoClient = client;
      globalThis._mongoDb = db;
    }

    return { client, db };
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);

    // More detailed error logging
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      if (error.stack) {
        console.error("Error stack:", error.stack);
      }
    }

    // Clean up on error
    if (client) {
      await client.close().catch(() => {
        // Ignore cleanup errors
      });
    }
    client = undefined;
    db = undefined;

    if (typeof window === "undefined") {
      globalThis._mongoClient = undefined;
      globalThis._mongoDb = undefined;
    }

    throw error;
  }
}

export async function getDatabase() {
  const { db } = await connectToDatabase();
  if (!db) {
    throw new Error("Database connection failed");
  }
  return db;
}
