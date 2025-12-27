import express from "express";
import { addEmailJob, addNotificationJob } from "./queues/index.js";
import cartRoutes from "./modules/cart/cart.routes.js";
import paymentRoutes from "./modules/payment/payment.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import productRoutes from "./modules/product/product.routes.js";
import storeRoutes from "./modules/store/store.routes.js";
import morgan from "morgan";

const app = express();
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Test endpoint to add jobs to queues
app.post("/test/email", async (req, res) => {
  try {
    const job = await addEmailJob({
      to: req.body.to || "test@example.com",
      subject: req.body.subject || "Test Email",
      body: req.body.body || "This is a test email",
    });
    res.json({ success: true, jobId: job.id });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/test/notification", async (req, res) => {
  try {
    const job = await addNotificationJob({
      userId: req.body.userId || "user-123",
      message: req.body.message || "Test notification",
    });
    res.json({ success: true, jobId: job.id });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.use("/cart", cartRoutes);
app.use("/payment", paymentRoutes);
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/stores", storeRoutes);

export default app;
