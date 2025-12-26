import db from "../../config/db.js";
import * as inventoryRepo from "./inventory.repo.js";
import {
  acquireInventoryLock,
  releaseInventoryLock,
} from "./inventory.lock.js";

export async function reserveStock({ storeId, items }) {
  const client = await db.connect();
  const locks = [];

  try {
    // 1️⃣ Acquire Redis locks
    for (const item of items) {
      const lockKey = await acquireInventoryLock(storeId, item.productId);
      locks.push(lockKey);
    }

    // 2️⃣ Start DB transaction
    await client.query("BEGIN");

    const productIds = items.map((i) => i.productId);
    const inventoryRows = await inventoryRepo.getInventoryForUpdate(
      client,
      storeId,
      productIds
    );

    // 3️⃣ Validate stock
    for (const item of items) {
      const row = inventoryRows.find((r) => r.productId === item.productId);

      if (!row || row.quantity < item.quantity) {
        throw new Error("Insufficient stock");
      }
    }

    // 4️⃣ Reduce stock
    for (const item of items) {
      const row = inventoryRows.find((r) => r.productId === item.productId);

      await inventoryRepo.reduceInventory(client, row.id, item.quantity);
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();

    // 5️⃣ Release Redis locks
    for (const lockKey of locks) {
      await releaseInventoryLock(lockKey);
    }
  }
}
