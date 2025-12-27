import db from "../../config/db.js";

// Fetch inventory rows for given products in a store

export async function getInventoryForUpdate(client, storeId, productIds) {
  const query = `
    SELECT *
    FROM "Inventory"
    WHERE "storeId" = $1
      AND "productId" = ANY($2)
    FOR UPDATE
  `;

  const { rows } = await client.query(query, [storeId, productIds]);
  return rows;
}

// Reduce inventory quantity

export async function reduceInventory(client, inventoryId, quantity) {
  const query = `
    UPDATE "Inventory"
    SET "quantity" = "quantity" - $1, "updatedAt" = NOW()
    WHERE "id" = $2
  `;

  await client.query(query, [quantity, inventoryId]);
}
