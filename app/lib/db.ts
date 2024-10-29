// lib/db.ts
import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.DATABASE_URL, // Your PostgreSQL connection string
  ssl: {
    rejectUnauthorized: false, // Adjust as needed for security
  },
});

export const connectDB = async () => {
  await client.connect();
};

export const query = async (text: string, params?: any[]) => {
  const res = await client.query(text, params);
  return res;
};

export const disconnectDB = async () => {
  await client.end();
};
