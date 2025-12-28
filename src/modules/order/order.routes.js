import express from "express";
import authMiddleware from "../../shared/middleware/auth.middleware.js";
import { getMyOrders, getOrder } from "./order.controller.js";

const router = express.Router();

router.get("/", authMiddleware, getMyOrders);
router.get("/:id", authMiddleware, getOrder);

export default router;
