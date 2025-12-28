import * as orderRepo from "./order.repo.js";

export async function getMyOrders(req, res, next) {
  try {
    const orders = await orderRepo.findUserOrders(req.user.id);
    res.json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
}

export async function getOrder(req, res, next) {
  try {
    const order = await orderRepo.findById(req.params.id);

    if (!order || order.userId !== req.user.id) {
      return res.status(404).json({ success: false });
    }

    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
}
