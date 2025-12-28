/**
 * Order repository
 * DB access only
 */

export async function createOrder(client, order) {
  const query = `
    INSERT INTO "Order" (
      id,
      "userId",
      "storeId",
      status,
      "totalAmount",
      "createdAt",
      "updatedAt"
    )
    VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
    RETURNING *
  `;

  const values = [
    order.id,
    order.userId,
    order.storeId,
    order.status,
    order.totalAmount,
  ];

  const { rows } = await client.query(query, values);
  return rows[0];
}

export async function createOrderItems(client, orderItems) {
  const query = `
    INSERT INTO "OrderItem" (
      id,
      "orderId",
      "productId",
      quantity,
      price,
      "createdAt"
    )
    VALUES ($1, $2, $3, $4, $5, NOW())
  `;

  for (const item of orderItems) {
    await client.query(query, [
      item.id,
      item.orderId,
      item.productId,
      item.quantity,
      item.price,
    ]);
  }
}

export async function findById(orderId) {
  const { rows } = await db.query(`SELECT * FROM "Order" WHERE id = $1`, [
    orderId,
  ]);
  return rows[0];
}

export async function findUserOrders(userId) {
  const { rows } = await db.query(
    `
    SELECT *
    FROM "Order"
    WHERE "userId" = $1
    ORDER BY "createdAt" DESC
    `,
    [userId]
  );
  return rows;
}

export async function updateStatus(client, orderId, status) {
  await client.query(
    `
    UPDATE "Order"
    SET status = $1
    WHERE id = $2
    `,
    [status, orderId]
  );
}
