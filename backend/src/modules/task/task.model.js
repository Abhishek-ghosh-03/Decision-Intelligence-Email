import mongoose from "mongoose";

export const Task = mongoose.model("Task", new mongoose.Schema({
  emailId: mongoose.Schema.Types.ObjectId,
  title: String,
  deadline: String,
  owner: String,
  confidence: Number
}));

