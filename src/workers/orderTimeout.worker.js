import { Worker } from "bullmq";
import { bullRedisConnection } from "../config/bullmq.config.js";
import { cancelOrder } from "../modules/order/order.service.js";

new Worker(
  "order-queue",
  async (job) => {
    if (job.name === "ORDER_TIMEOUT") {
      await cancelOrder(job.data.orderId);
    }
  },
  { connection: bullRedisConnection }
);
