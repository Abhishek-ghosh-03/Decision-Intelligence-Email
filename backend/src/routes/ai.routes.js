import express from "express";
import OpenAI from "openai";
import { ENV } from "../config/env.js";
import { Email } from "../modules/email/email.model.js";
import { Decision } from "../modules/decision/decision.model.js";
import { Task } from "../modules/task/task.model.js";
import { Risk } from "../modules/risk/risk.model.js";

const router = express.Router();

const openai = new OpenAI({
  apiKey: ENV.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

// ✅ GENERATE REPLIES
router.post("/reply/:emailId", async (req, res) => {
  try {
    const { emailId } = req.params;

    const email = await Email.findById(emailId);
    const decisions = await Decision.find({ emailId });
    const tasks = await Task.find({ emailId });
    const risks = await Risk.find({ emailId });

    const prompt = `
You are an AI email assistant.

Generate 3 reply drafts:

1. Professional
2. Friendly
3. Direct

Use the context below:

EMAIL:
${email.body}

DECISIONS:
${decisions.map(d => d.text).join(", ")}

TASKS:
${tasks.map(t => t.title).join(", ")}

RISKS:
${risks.map(r => r.text).join(", ")}

Rules:
- Be concise
- Mention commitments clearly
- Address risks if present
- No explanation

Return JSON:
{
  "replies": [
    { "type": "professional", "text": "" },
    { "type": "friendly", "text": "" },
    { "type": "direct", "text": "" }
  ]
}
`;

    const response = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    let content = response.choices[0].message.content;

    // clean markdown
    content = content.replace(/```json|```/g, "").trim();

    const data = JSON.parse(content);

    res.json(data);

  } catch (err) {
    console.error("❌ Reply AI Error:", err);
    res.status(500).json({ error: "Failed to generate replies" });
  }
});

export default router;