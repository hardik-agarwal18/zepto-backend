import db from "../../config/db.js";

export async function createStore(client, store) {
  const { rows } = await client.query(
    `
    INSERT INTO "Store" (id, name, city, area, "isActive", "createdAt", "updatedAt")
    VALUES ($1, $2, $3, $4, true, NOW(), NOW())
    RETURNING *
    `,
    [store.id, store.name, store.city, store.area]
  );
  return rows[0];
}

export async function listActiveStores() {
  const { rows } = await db.query(
    `SELECT * FROM "Store" WHERE "isActive" = true`
  );
  return rows;
}

export async function findById(id) {
  const { rows } = await db.query(`SELECT * FROM "Store" WHERE id = $1`, [id]);
  return rows[0];
}

export async function updateStatus(client, id, isActive) {
  await client.query(
    `
    UPDATE "Store"
    SET "isActive" = $1, "updatedAt" = NOW()
    WHERE id = $2
    `,
    [isActive, id]
  );
}
