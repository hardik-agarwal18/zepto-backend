import { createQueue, setupQueueEvents } from "../config/bullmq.js";

// Example: Email queue
export const emailQueue = createQueue("email");
setupQueueEvents("email");

// Example: Notification queue
export const notificationQueue = createQueue("notification");
setupQueueEvents("notification");

// Example: Add job to queue
export const addEmailJob = async (data) => {
  return await emailQueue.add("send-email", data, {
    priority: 1,
  });
};

export const addNotificationJob = async (data) => {
  return await notificationQueue.add("send-notification", data, {
    priority: 2,
  });
};
