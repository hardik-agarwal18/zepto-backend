import { v4 as uuid } from "uuid";
import db from "../../config/db.js";
import * as inventoryRepo from "./inventory.repo.js";

export async function addInventory(req, res, next) {
  const client = await db.getClient();

  try {
    const { storeId, productId, quantity, expiryDate } = req.body;

    await client.query("BEGIN");

    const inventory = await inventoryRepo.createInventory(client, {
      id: uuid(),
      storeId,
      productId,
      quantity,
      expiryDate: expiryDate || null,
    });

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      data: inventory,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    next(err);
  } finally {
    client.release();
  }
}
