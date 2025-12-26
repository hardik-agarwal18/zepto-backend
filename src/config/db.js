import pg from "pg";
import { ENV } from "./env.js";

const { Pool } = pg;

const pool = new Pool({
  connectionString: ENV.DATABASE_URL,
});

// Test database connection
pool
  .connect()
  .then((client) => {
    console.log("✅ Database connected successfully");
    client.release();
  })
  .catch((error) => {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  });

export default pool;
