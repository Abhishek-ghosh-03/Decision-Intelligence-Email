import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: String,
  googleId: String,
  accessToken: String,
  refreshToken: String
});

export const User = mongoose.model("User", userSchema);