import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 1011,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL: process.env.DATABASE_URL || "",
  REDIS_HOST: process.env.REDIS_HOST || "localhost",
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || "",
};
