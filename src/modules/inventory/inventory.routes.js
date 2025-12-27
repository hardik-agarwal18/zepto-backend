import express from "express";
import authMiddleware from "../../shared/middleware/auth.middleware.js";
import { authorizeRoles } from "../../shared/middleware/rbac.middleware.js";
import { addInventory } from "./inventory.controller.js";

const router = express.Router();

router.post("/", authMiddleware, authorizeRoles("ADMIN"), addInventory);

export default router;
