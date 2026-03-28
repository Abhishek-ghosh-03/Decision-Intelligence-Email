import mongoose from "mongoose";

export const Decision = mongoose.model("Decision", new mongoose.Schema({
  emailId: mongoose.Schema.Types.ObjectId,
  text: String,
  confidence: Number
}));