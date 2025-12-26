import { v4 as uuid } from "uuid";
import db from "../../config/db.js";
import * as storeRepo from "./store.repo.js";

export async function createStore(data) {
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const store = await storeRepo.createStore(client, {
      id: uuid(),
      ...data,
    });

    await client.query("COMMIT");
    return store;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function listStores() {
  return storeRepo.listActiveStores();
}

export async function getStore(id) {
  return storeRepo.findById(id);
}

export async function setStoreStatus(id, isActive) {
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    await storeRepo.updateStatus(client, id, isActive);
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
