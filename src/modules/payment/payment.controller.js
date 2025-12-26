import { initiatePayment, confirmPayment } from "./payment.service.js";

export async function pay(req, res, next) {
  try {
    const { orderId } = req.body;
    const payment = await initiatePayment(orderId);
    res.status(200).json({ success: true, data: payment });
  } catch (err) {
    next(err);
  }
}

export async function mockWebhook(req, res, next) {
  try {
    const { orderId } = req.body;
    await confirmPayment(orderId);
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
}
