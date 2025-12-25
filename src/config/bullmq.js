import { Queue, Worker, QueueEvents } from "bullmq";
import { ENV } from "./env.js";

// BullMQ Redis connection configuration
export const bullmqConnection = {
  host: ENV.REDIS_HOST,
  port: ENV.REDIS_PORT,
  password: ENV.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
};

// Default queue options
export const defaultQueueOptions = {
  connection: bullmqConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
    removeOnComplete: {
      age: 3600, // Keep completed jobs for 1 hour
      count: 100, // Keep last 100 completed jobs
    },
    removeOnFail: {
      age: 86400, // Keep failed jobs for 24 hours
    },
  },
};

// Default worker options
export const defaultWorkerOptions = {
  connection: bullmqConnection,
  concurrency: 5,
  limiter: {
    max: 10,
    duration: 1000,
  },
};

// Queue event logger helper
export const setupQueueEvents = (queueName) => {
  const queueEvents = new QueueEvents(queueName, {
    connection: bullmqConnection,
  });

  queueEvents.on("completed", ({ jobId }) => {
    console.log(`✅ Job ${jobId} in queue ${queueName} completed`);
  });

  queueEvents.on("failed", ({ jobId, failedReason }) => {
    console.error(
      `❌ Job ${jobId} in queue ${queueName} failed:`,
      failedReason
    );
  });

  queueEvents.on("progress", ({ jobId, data }) => {
    console.log(`⏳ Job ${jobId} in queue ${queueName} progress:`, data);
  });

  return queueEvents;
};

// Create a queue helper
export const createQueue = (queueName, options = {}) => {
  const queue = new Queue(queueName, {
    ...defaultQueueOptions,
    ...options,
  });

  console.log(`📋 Queue "${queueName}" initialized`);
  return queue;
};

// Create a worker helper
export const createWorker = (queueName, processor, options = {}) => {
  const worker = new Worker(queueName, processor, {
    ...defaultWorkerOptions,
    ...options,
  });

  worker.on("ready", () => {
    console.log(`🔧 Worker for queue "${queueName}" is ready`);
  });

  worker.on("error", (error) => {
    console.error(`❌ Worker error in queue "${queueName}":`, error);
  });

  return worker;
};
