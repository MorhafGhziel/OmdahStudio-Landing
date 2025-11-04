import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://omdah_admin:omdah123@cluster0.4vpukx5.mongodb.net/omdah?retryWrites=true&w=majority";
const dbName = "omdah";

const options = {
  maxPoolSize: 1,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 30000,
  connectTimeoutMS: 10000,
  minPoolSize: 0,
  maxIdleTimeMS: 25000,
  waitQueueTimeoutMS: 10000,
};

let client = null;
let db = null;

export async function connectToDatabase() {
  if (client && db) {
    return { client, db };
  }

  try {
    console.log("Connecting to MongoDB...");
    client = new MongoClient(uri, options);
    await client.connect();
    db = client.db(dbName);
    console.log("Connected to MongoDB successfully");
    return { client, db };
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}

export async function getDatabase() {
  const { db: database } = await connectToDatabase();
  if (!database) {
    throw new Error("Database connection failed");
  }
  return database;
}
