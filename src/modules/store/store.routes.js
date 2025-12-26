import express from "express";
import authMiddleware from "../../shared/middleware/auth.middleware.js";
import { authorizeRoles } from "../../shared/middleware/rbac.middleware.js";
import * as controller from "./store.controller.js";

const router = express.Router();

router.post("/", authMiddleware, authorizeRoles("ADMIN"), controller.create);

router.get("/", controller.list);
router.get("/:id", controller.get);

router.patch(
  "/:id/disable",
  authMiddleware,
  authorizeRoles("ADMIN"),
  controller.disable
);

export default router;
