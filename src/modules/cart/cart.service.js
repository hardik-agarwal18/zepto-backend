import * as cartRepo from "./cart.repo.js";

export async function addItemToCart(userId, storeId, item) {
  const cart = (await cartRepo.getCart(userId)) || {
    storeId,
    items: [],
  };

  if (cart.storeId !== storeId) {
    throw new Error("Cart can only contain one store");
  }

  const existing = cart.items.find((i) => i.productId === item.productId);

  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.items.push(item);
  }

  await cartRepo.saveCart(userId, cart);
  return cart;
}

export async function removeItemFromCart(userId, productId) {
  const cart = await cartRepo.getCart(userId);
  if (!cart) return null;

  cart.items = cart.items.filter((i) => i.productId !== productId);

  await cartRepo.saveCart(userId, cart);
  return cart;
}

export async function checkout(userId) {
  const cart = await cartRepo.getCart(userId);

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  // 🔥 NOW you call Phase 2 logic
  const order = await createOrder({
    userId,
    storeId: cart.storeId,
    items: cart.items,
  });

  await cartRepo.clearCart(userId);
  return order;
}
