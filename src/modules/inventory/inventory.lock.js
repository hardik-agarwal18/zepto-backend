import redis from "../../shared/redis/index.js";

export async function acquireInventoryLock(storeId, productId) {
  const key = `lock:inventory:${storeId}:${productId}`;

  const acquired = await redis.set(
    key,
    "locked",
    "NX",
    "PX",
    5000 // 5 seconds
  );

  if (!acquired) {
    throw new Error("Inventory is locked, try again");
  }

  return key;
}

export async function releaseInventoryLock(lockKey) {
  await redis.del(lockKey);
}
