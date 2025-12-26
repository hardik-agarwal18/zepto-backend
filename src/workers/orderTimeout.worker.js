import { Worker } from "bullmq";
import { bullRedisConnection } from "../config/bullmq.js";
import { cancelOrder } from "../modules/order/order.service.js";

const worker = new Worker(
  "order-queue",
  async (job) => {
    try {
      if (job.name !== "ORDER_TIMEOUT") return;

      const { orderId } = job.data;

      console.log(`[ORDER_TIMEOUT] Processing order ${orderId}`);

      await cancelOrder(orderId);

      console.log(`[ORDER_TIMEOUT] Order ${orderId} handled`);
    } catch (err) {
      console.error(`[ORDER_TIMEOUT] Failed for job ${job.id}`, err);
      throw err; // important: lets BullMQ retry
    }
  },
  {
    connection: bullRedisConnection,
    concurrency: 5,
  }
);

worker.on("failed", (job, err) => {
  console.error(`[ORDER_TIMEOUT] Job ${job.id} failed`, err.message);
});

worker.on("completed", (job) => {
  console.log(`[ORDER_TIMEOUT] Job ${job.id} completed`);
});
