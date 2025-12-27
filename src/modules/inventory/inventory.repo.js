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

// Create new inventory entry

export async function createInventory(client, storeId, productId, quantity) {
  const query = `
    INSERT INTO "Inventory" ("storeId", "productId", "quantity", "createdAt", "updatedAt")
    VALUES ($1, $2, $3, NOW(), NOW())
    RETURNING *
  `;

  const { rows } = await client.query(query, [storeId, productId, quantity]);
  return rows[0];
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
