import mongoose from "mongoose";

const templateSchema = new mongoose.Schema({
  name: String,            
  greeting: String,
  tone: String,
  closing: String,
  signature: String,
  isDefault: { type: Boolean, default: false },
}, { timestamps: true });

export const Template = mongoose.model("Template", templateSchema);