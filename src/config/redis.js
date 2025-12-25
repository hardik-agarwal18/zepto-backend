import Redis from "ioredis";
import { ENV } from "./env.js";

const redisConfig = {
  host: ENV.REDIS_HOST,
  port: ENV.REDIS_PORT,
  password: ENV.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
};

// Create Redis connection
const redis = new Redis(redisConfig);

// Connection event handlers
redis.on("connect", () => {
  console.log("✅ Redis connected successfully");
});

redis.on("error", (error) => {
  console.error("❌ Redis connection error:", error.message);
});

redis.on("ready", () => {
  console.log("🚀 Redis is ready to accept commands");
});

redis.on("reconnecting", () => {
  console.log("🔄 Redis reconnecting...");
});

export default redis;
