import mongoose from "mongoose";

export const Risk = mongoose.model("Risk", new mongoose.Schema({
  emailId: mongoose.Schema.Types.ObjectId,
  text: String,
  type: String,
  severity: String,
  suggestion: String,
  confidence: Number
}));