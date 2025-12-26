import { v4 as uuid } from "uuid";
import db from "../../config/db.js";
import * as productRepo from "./product.repo.js";

export async function createProduct(data) {
  const client = await db.getClient();
  try {
    await client.query("BEGIN");

    const product = await productRepo.createProduct(client, {
      id: uuid(),
      ...data,
    });

    await client.query("COMMIT");
    return product;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function listProducts(filter) {
  return productRepo.listProducts(filter);
}

export async function getProduct(id) {
  return productRepo.findById(id);
}
