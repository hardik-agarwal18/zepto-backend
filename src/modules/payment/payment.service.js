import db from "../../config/db.js";
import { v4 as uuid } from "uuid";

export async function initiatePayment(orderId, provider = "MOCK") {
  const client = await db.getClient();

  try {
    await client.query("BEGIN");

    // 1️⃣ Check order
    const { rows } = await client.query(
      `SELECT * FROM "Order" WHERE id = $1 FOR UPDATE`,
      [orderId]
    );

    const order = rows[0];
    if (!order) throw new Error("Order not found");

    if (order.status !== "CREATED") {
      throw new Error("Order not payable");
    }

    // 2️⃣ Create payment
    const paymentId = uuid();

    await client.query(
      `
      INSERT INTO "Payment" (
        id,
        "orderId",
        status,
        provider
      )
      VALUES ($1, $2, 'INITIATED', $3)
      `,
      [paymentId, orderId, provider]
    );

    await client.query("COMMIT");

    return {
      paymentId,
      amount: order.totalAmount,
      currency: "INR",
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function confirmPayment(orderId) {
  const client = await db.getClient();

  try {
    await client.query("BEGIN");

    // 1️⃣ Fetch payment
    const { rows } = await client.query(
      `
      SELECT * FROM "Payment"
      WHERE "orderId" = $1
      FOR UPDATE
      `,
      [orderId]
    );

    const payment = rows[0];
    if (!payment) throw new Error("Payment not found");

    if (payment.status === "SUCCESS") {
      await client.query("COMMIT");
      return;
    }

    // 2️⃣ Mark payment success
    await client.query(
      `
      UPDATE "Payment"
      SET status = 'SUCCESS'
      WHERE id = $1
      `,
      [payment.id]
    );

    // 3️⃣ Update order
    await client.query(
      `
      UPDATE "Order"
      SET status = 'PAID'
      WHERE id = $1
      `,
      [orderId]
    );

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
