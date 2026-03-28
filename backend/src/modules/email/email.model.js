import mongoose from "mongoose";

const schema = new mongoose.Schema({
  threadId: String,
  subject: String,
  body: String,
  sender: String,
  timestamp: Date,
  status: { type: String, default: "pending" },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  
  taskCount: { type: Number, default: 0 },
  decisionCount: { type: Number, default: 0 },
  riskCount: { type: Number, default: 0 },

  priorityScore: { type: Number, default: 0 },
  isFollowUp: {
      type: Boolean,
      default: false,
    },

    followUpScore: {
      type: Number,
      default: 0,
    },
    urgency: {
      type: String,
      enum: ["low","medium","high"],
      default:"low"
    },
    requiresReply: {
      type: Boolean,
      default: false,
    },
    lastRepliedAt: Date,
}, { timestamps: true });

export const Email = mongoose.model("Email", schema);