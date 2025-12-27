import { RateLimiterRedis } from "rate-limiter-flexible";
import { redis } from "../../config/redis.js";

/**
 * LOGIN
 * Very strict to prevent brute-force attacks
 * 5 requests / minute / IP
 */
export const loginLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: "rl:login",
  points: 5,
  duration: 60,
});

/**
 * REGISTER / OTP / PASSWORD RESET
 * Slightly relaxed
 * 10 requests / minute / IP
 */
export const authLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: "rl:auth",
  points: 10,
  duration: 60,
});

/**
 * GENERAL API (Authenticated)
 * 100 requests / minute / user
 */
export const apiLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: "rl:api",
  points: 100,
  duration: 60,
});

/**
 * ORDER CREATION
 * Prevent order spamming
 * 10 requests / minute / user
 */
export const orderLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: "rl:order",
  points: 10,
  duration: 60,
});

/**
 * PAYMENT CALLBACKS (internal)
 * High limit OR disable rate limiting
 */
export const paymentWebhookLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: "rl:webhook:payment",
  points: 500,
  duration: 60,
});
