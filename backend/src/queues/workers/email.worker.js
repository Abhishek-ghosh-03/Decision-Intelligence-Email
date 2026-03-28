import "dotenv/config";
import { Worker } from "bullmq";
import { redis } from "../../config/redis.js";
import { processEmailAI } from "../../services/ai.service.js";
import { connectDB } from "../../config/db.js";

console.log("🚀 Worker starting...");
await connectDB();
console.log("✅ Worker DB connected");

const worker = new Worker(
  "email-processing",   // 🔥 MUST match queue
  async (job) => {
    const { emailId } = job.data;

    console.log("🔥 JOB RECEIVED:", job.data);

    // 🔥 CORRECT CALL
    await processEmailAI(emailId);

    console.log("✅ AI processing completed for:", emailId);
  },
  { connection: redis }
);

// Debug logs
worker.on("completed", (job) => {
  console.log("🎉 Job completed:", job.id);
});

worker.on("failed", (job, err) => {
  console.error("❌ Job failed:", err.message);
});