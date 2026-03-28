import mongoose from "mongoose";

const followUpSchema = new mongoose.Schema({
  emailId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Email",
  },
  status: {
    type: String,
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const FollowUp = mongoose.model("FollowUp", followUpSchema);