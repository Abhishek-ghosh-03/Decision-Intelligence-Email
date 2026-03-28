import OpenAI from "openai";
import { ENV } from "./env.js";

export const openai = new OpenAI({
  apiKey: ENV.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:5173",
    "X-Title": "Decision Intelligence System"
  }
});