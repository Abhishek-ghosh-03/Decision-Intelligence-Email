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
  console.log("ACCESS TOKEN:", tokens.access_token);
  setAccessToken(tokens.access_token);
  await User.findOneAndUpdate(
  // ✅ Upsert instead of create
    { email: "test@gmail.com" },
    {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token
    },
    { upsert: true, returnDocument: 'after' }
  );
  
  res.send("Auth success, you can close this tab");
});

export default router;