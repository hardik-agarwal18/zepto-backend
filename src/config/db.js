import { PrismaClient } from "@prisma/client";
import { ENV } from "./env.js";

const prisma = new PrismaClient({
  log: ["warn", "error"],
});

// Test database connection
prisma
  .$connect()
  .then(() => {
    console.log("✅ Database connected successfully");
  })
  .catch((error) => {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  });

export default prisma;
