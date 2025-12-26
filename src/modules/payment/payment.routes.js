import express from "express";
import authMiddleware from "../../shared/middleware/auth.middleware.js";
import { pay, mockWebhook } from "./payment.controller.js";

const router = express.Router();

router.post("/pay", authMiddleware, pay);
router.post("/webhook", mockWebhook);

export default router;
