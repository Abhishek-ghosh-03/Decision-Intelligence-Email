import express from "express";
import { getAuthUrl, getTokens } from "../services/gmail.service.js";
import { User } from "../modules/auth/user.model.js";
import { setAccessToken } from "../services/gmail.service.js";

const router = express.Router();

router.get("/google", (req, res) => {
  res.redirect(getAuthUrl());
});

router.get("/google/callback", async (req, res) => {
  const { code } = req.query;
  
  const tokens = await getTokens(code);
  setAccessToken(tokens.access_token);
  const updateData = { accessToken: tokens.access_token };
  if (tokens.refresh_token) {
    updateData.refreshToken = tokens.refresh_token;
  }

  await User.findOneAndUpdate(
    { email: "test@gmail.com" },
    updateData,
    { upsert: true, returnDocument: 'after' }
  );
  
  res.redirect("http://localhost:5173/auth-success");
});

export default router;