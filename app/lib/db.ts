// lib/db.ts
import pkg from 'pg';
const { Client } = pkg;

// Function to create a connection string safely
const createConnectionString = () => {
  const host = process.env.NILE_DB_HOST;
  const user = process.env.NILEDB_USER;
  const password = process.env.NILEDB_PASSWORD;
  const database = process.env.NILEDB_NAME;
  const port = process.env.NILEDB_PORT ? Number(process.env.NILEDB_PORT) : 5432; // Default to 5432

  // Ensure all required variables are defined
  if (!host || !user || !password || !database) {
    throw new Error('Database configuration is incomplete. Please check your environment variables.');
  }

  return `postgres://${user}:${password}@${host}:${port}/${database}`;
};

let client: Client | null = null;

// Connect to the database and create a new client instance
export const connectDB = async () => {
  if (client) {
    return; // Already connected
  }

  client = new Client({
    connectionString: createConnectionString(),
    ssl: {
      rejectUnauthorized: false, // Adjust as needed for security
    },
  });

  await client.connect();
};

// Query function that requires an explicit call to connect
export const query = async (text: string, params?: any[]) => {
  if (!client) {
    throw new Error('Database client is not connected. Please call connectDB first.');
  }
  
  const res = await client.query(text, params);
  return res;
};

// Disconnect function
export const disconnectDB = async () => {
  if (client) {
    await client.end();
    client = null; // Reset the client
  }
};

// Expose a way to manually connect and query
export const connectAndQuery = async (text: string, params?: any[]) => {
  await connectDB(); // Connect when querying
  const result = await query(text, params);
  return result;
};
