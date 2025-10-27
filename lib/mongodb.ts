import { MongoClient, Db } from "mongodb";

const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://omdah_admin:omdah123@cluster0.4vpukx5.mongodb.net/?retryWrites=true&w=majority";
const dbName = "omdah";

// Connection options with proper timeout and pooling
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
};

let client: MongoClient | null = null;
let db: Db | null = null;
let isConnecting = false;

export async function connectToDatabase() {
  if (db && client) {
    return { client, db };
  }

  if (isConnecting) {
    // Wait for existing connection attempt
    let attempts = 0;
    while (attempts < 50) {
      if (db && client) return { client, db };
      await new Promise((resolve) => setTimeout(resolve, 100));
      attempts++;
    }
    throw new Error(
      "Connection timeout - another connection attempt is in progress"
    );
  }

  isConnecting = true;

  try {
    if (client && !db) {
      db = client.db(dbName);
    } else if (!client) {
      client = new MongoClient(uri, options);
      await client.connect();
      db = client.db(dbName);
    }

    console.log("Connected to MongoDB successfully");
    isConnecting = false;
    return { client, db };
  } catch (error) {
    isConnecting = false;
    console.error("Failed to connect to MongoDB:", error);
    // Reset client and db on error to allow retry
    client = null;
    db = null;
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
