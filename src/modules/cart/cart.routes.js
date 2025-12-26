import express from "express";
import authMiddleware from "../../shared/middleware/auth.middleware.js";
import { addItem, removeItem, checkoutCart } from "./cart.controller.js";

const router = express.Router();

router.post("/items", authMiddleware, addItem);
router.delete("/items/:productId", authMiddleware, removeItem);
router.post("/checkout", authMiddleware, checkoutCart);

export default router;
