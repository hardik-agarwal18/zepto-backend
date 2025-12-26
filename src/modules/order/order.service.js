import db from "../../shared/db/index.js";
import { v4 as uuid } from "uuid";
import * as orderRepo from "./order.repo.js";
import { reserveStock } from "../inventory/inventory.service.js";

export async function createOrder({
  userId,
  storeId,
  items, // [{ productId, quantity, price }]
}) {
  const client = await db.getClient();
  const orderId = uuid();

  try {
    await client.query("BEGIN");

    // 1️⃣ Reserve inventory (safe & locked)
    await reserveStock({
      storeId,
      items,
    });

    // 2️⃣ Calculate total
    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // 3️⃣ Create order
    const order = await orderRepo.createOrder(client, {
      id: orderId,
      userId,
      storeId,
      status: "CREATED",
      totalAmount,
    });

    // 4️⃣ Create order items
    const orderItems = items.map((item) => ({
      id: uuid(),
      orderId,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    }));

    await orderRepo.createOrderItems(client, orderItems);

    await client.query("COMMIT");

    return order;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
