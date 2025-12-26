import redis from "../../shared/redis/index.js";

const CART_TTL = 60 * 30; // 30 minutes

export async function getCart(userId) {
  const data = await redis.get(`cart:${userId}`);
  return data ? JSON.parse(data) : null;
}

export async function saveCart(userId, cart) {
  await redis.set(`cart:${userId}`, JSON.stringify(cart), "EX", CART_TTL);
}

export async function clearCart(userId) {
  await redis.del(`cart:${userId}`);
}
