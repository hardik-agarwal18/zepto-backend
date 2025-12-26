import { addItemToCart, removeItemFromCart, checkout } from "./cart.service.js";

export async function addItem(req, res, next) {
  try {
    const userId = req.user.id;
    const { storeId, productId, quantity } = req.body;

    const cart = await addItemToCart(userId, storeId, {
      productId,
      quantity,
    });

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (err) {
    next(err);
  }
}

export async function removeItem(req, res, next) {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const cart = await removeItemFromCart(userId, productId);

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (err) {
    next(err);
  }
}

export async function checkoutCart(req, res, next) {
  try {
    const userId = req.user.id;

    const order = await checkout(userId);

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (err) {
    next(err);
  }
}
