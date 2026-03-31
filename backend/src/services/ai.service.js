import OpenAI from "openai";
import { ENV } from "../config/env.js";
import { Email } from "../modules/email/email.model.js";
import { Task } from "../modules/task/task.model.js";
import { Decision } from "../modules/decision/decision.model.js";
import { Risk } from "../modules/risk/risk.model.js";

/* =========================
   🔥 OPENROUTER CONFIG
========================= */
export const openai = new OpenAI({
  apiKey: ENV.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:5173",
    "X-Title": "Decision Intelligence System",
  },
});

/* =========================
   🔥 MAIN FUNCTION
========================= */
export const processEmailAI = async (emailId) => {
  try {
    const email = await Email.findById(emailId);
    if (!email) return;

    /* =========================
       🔥 PROMPT
    ========================= */
    const prompt = `
You are an AI system that extracts actionable insights from emails.

Even if information is implicit, infer intelligently.

Extract:

1. Decisions → Anything agreed, confirmed, or implied direction
2. Tasks → Any action, request, or implied responsibility
3. Risks → Any uncertainty, delay, issue, or potential problem

Return STRICT JSON:

{
  "decisions": [{ "text": "", "confidence": 0 }],
  "tasks": [{ "title": "", "deadline": "", "owner": "", "confidence": 0 }],
  "risks": [{ "text": "", "type": "", "severity": "", "suggestion": "", "confidence": 0 }]
}

Rules:
- Do not hallucinate
- Infer intelligently if needed
- Confidence between 0 and 1
- Keep text concise

Email:
${email.body}
`;

    /* =========================
       🔥 CALL AI
    ========================= */
    const response = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    let content = response.choices[0].message.content.trim();

    // 🔥 CLEAN RESPONSE (important)
    if (content.startsWith("```")) {
      content = content.replace(/```json|```/g, "").trim();
    }

    let data;

    try {
      data = JSON.parse(content);
    } catch (err) {
      console.error("❌ JSON Parse Failed:", content);
      return;
    }

    // console.log("✅ AI OUTPUT:", data);

  
    for (const task of data.tasks || []) {
      await Task.create({
        emailId,
        title: task.title,
        deadline: task.deadline || "",
        owner: task.owner || "",
        confidence: task.confidence || 0.7,
      });
    }

    /* =========================
       🔥 SAVE DECISIONS
    ========================= */
    for (const decision of data.decisions || []) {
      await Decision.create({
        emailId,
        text: decision.text,
        confidence: decision.confidence || 0.7,
      });
    }

    /* =========================
       🔥 SAVE RISKS
    ========================= */
    for (const risk of data.risks || []) {
      await Risk.create({
        emailId,
        text: risk.text,
        type: risk.type || "general",
        severity: risk.severity || "medium",
        suggestion: risk.suggestion || "",
        confidence: risk.confidence || 0.7,
      });
    }

    /* =========================
       🔥 COUNTS
    ========================= */
    const taskCount = data.tasks?.length || 0;
    const decisionCount = data.decisions?.length || 0;
    const riskCount = data.risks?.length || 0;

    /* =========================
       🔥 PRIORITY SCORE (KEY FIX)
    ========================= */
    const priorityScore =
      taskCount * 2 +
      riskCount * 3 +
      decisionCount;

    /* =========================
       🔥 FOLLOW-UP DETECTION
    ========================= */
    const bodyText = email.body.toLowerCase();

    const requiresReply =
      taskCount > 0 ||
      data.tasks.length > 0 ||
      bodyText.includes("?") ||
      bodyText.includes("please") ||
      bodyText.includes("let me know") ||
      bodyText.includes("can you") ||
      bodyText.includes("could you") ||
      bodyText.includes("update me");

      email.requiresReply = requiresReply;
    /* =========================
       🔥 UPDATE EMAIL
    ========================= */
    email.taskCount = taskCount;
    email.decisionCount = decisionCount;
    email.riskCount = riskCount;
    email.priorityScore = priorityScore;
    email.requiresReply = requiresReply;
    email.status = "processed";

    await email.save();

    // console.log("🎯 PRIORITY:", priorityScore);
    // console.log("📩 FOLLOW-UP:", requiresReply);

  } catch (err) {
    console.error("❌ AI PROCESS ERROR:", err.message);
  }
};


export const generateInsightGraph = async (emailId) => {
  try {
    const email = await Email.findById(emailId);
    if (!email) return;

    const prompt = `
You are an AI system that analyzes emails and creates a structured insight graph.

Return STRICT JSON:

{
  "summary": "",
  "people": [{ "name": "", "role": "" }],
  "tasks": [{ "text": "" }],
  "deadline": "",
  "risk": {
    "text": "",
    "severity": ""
  },
  "urgency": "",
  "suggestions": [
    ""
  ],
  "intent": ""
}

Rules:
- Infer intelligently
- Keep concise
- No extra text

Email:
${email.body}
`;

    const response = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    let content = response.choices[0].message.content.trim();

    if (content.startsWith("```")) {
      content = content.replace(/```json|```/g, "").trim();
    }

    const data = JSON.parse(content);

    return data;

  } catch (err) {
    console.error("Graph AI error:", err);
    return null;
  }
};