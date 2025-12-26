import * as storeService from "./store.service.js";

export async function create(req, res, next) {
  try {
    const store = await storeService.createStore(req.body);
    res.status(201).json({ success: true, data: store });
  } catch (err) {
    next(err);
  }
}

export async function list(req, res, next) {
  try {
    const stores = await storeService.listStores();
    res.json({ success: true, data: stores });
  } catch (err) {
    next(err);
  }
}

export async function get(req, res, next) {
  try {
    const store = await storeService.getStore(req.params.id);
    res.json({ success: true, data: store });
  } catch (err) {
    next(err);
  }
}

export async function disable(req, res, next) {
  try {
    await storeService.setStoreStatus(req.params.id, false);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
