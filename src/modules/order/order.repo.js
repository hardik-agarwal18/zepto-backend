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
      "totalAmount"
    )
    VALUES ($1, $2, $3, $4, $5)
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
      price
    )
    VALUES ($1, $2, $3, $4, $5)
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
