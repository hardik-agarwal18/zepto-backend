import { Queue } from "bullmq";
import { defaultQueueOptions } from "../config/bullmq.config.js";

export const orderQueue = new Queue("order-queue", defaultQueueOptions);
