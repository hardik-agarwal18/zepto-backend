import * as productService from "./product.service.js";

export async function create(req, res, next) {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
}

export async function list(req, res, next) {
  try {
    const products = await productService.listProducts(req.query);
    res.json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
}

export async function get(req, res, next) {
  try {
    const product = await productService.getProduct(req.params.id);
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
}
