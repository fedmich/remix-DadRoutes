// lib/db.ts
import pkg from 'pg';
const { Client } = pkg;

/*
const client = new Client({
  connectionString: process.env.DATABASE_URL, // Your PostgreSQL connection string
  ssl: {
    rejectUnauthorized: false, // Adjust as needed for security
  },
});
*/
const client = new Client({
  connectionString: `postgres://${process.env.NILEDB_USER}:${process.env.NILEDB_PASSWORD}@${process.env.NILE_DB_HOST}:${process.env.NILEDB_PORT}/${process.env.NILEDB_NAME}`, // Constructed connection string
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
