import db from "../../config/db.js";

export async function createProduct(client, product) {
  const { rows } = await client.query(
    `
    INSERT INTO "Product" (id, name, category, unit, "isPerishable")
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [
      product.id,
      product.name,
      product.category,
      product.unit,
      product.isPerishable,
    ]
  );

  return rows[0];
}

export async function listProducts({ category }) {
  let query = `SELECT * FROM "Product"`;
  const params = [];

  if (category) {
    query += ` WHERE category = $1`;
    params.push(category);
  }

  const { rows } = await db.query(query, params);
  return rows;
}

export async function findById(id) {
  const { rows } = await db.query(`SELECT * FROM "Product" WHERE id = $1`, [
    id,
  ]);
  return rows[0];
}
