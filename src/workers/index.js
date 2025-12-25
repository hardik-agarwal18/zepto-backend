import { createWorker } from "../config/bullmq.js";

// Email worker processor
const emailProcessor = async (job) => {
  console.log(`📧 Processing email job ${job.id}:`, job.data);

  // Simulate email sending
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Update progress
  await job.updateProgress(50);

  // Simulate more processing
  await new Promise((resolve) => setTimeout(resolve, 2000));

  await job.updateProgress(100);

  return { success: true, emailId: `email-${Date.now()}` };
};

// Notification worker processor
const notificationProcessor = async (job) => {
  console.log(`🔔 Processing notification job ${job.id}:`, job.data);

  // Simulate notification sending
  await new Promise((resolve) => setTimeout(resolve, 1500));

  await job.updateProgress(100);

  return { success: true, notificationId: `notif-${Date.now()}` };
};

// Initialize workers
export const emailWorker = createWorker("email", emailProcessor);
export const notificationWorker = createWorker(
  "notification",
  notificationProcessor
);

console.log("👷 All workers initialized");
