import express from "express";
import { google } from "googleapis";
import { Email } from "../modules/email/email.model.js";
import { Task } from "../modules/task/task.model.js";
import { Decision } from "../modules/decision/decision.model.js";
import { Risk } from "../modules/risk/risk.model.js";
import { emailQueue } from "../queues/email.queue.js";
import { FollowUp } from "../modules/followup/followup.model.js";
import { fetchEmailDetails, getGmailClient } from "../services/gmail.service.js";
import { ACCESS_TOKEN } from "../services/gmail.service.js";
import { generateInsightGraph } from "../services/ai.service.js";


const router = express.Router();

// ✅ GET all emails
router.get("/", async (req, res) => {
  try {
    const emails = await Email.find().sort({ createdAt: -1 });

    const enrichedEmails = await Promise.all(
      emails.map(async (email) => {
        const decisionCount = await Decision.countDocuments({
          emailId: email._id,
        });

        const taskCount = await Task.countDocuments({
          emailId: email._id,
        });

        const riskCount = await Risk.countDocuments({
          emailId: email._id,
        });

        return {
          ...email.toObject(),
          decisionCount,
          taskCount,
          riskCount,
        };
      })
    );

    res.json(enrichedEmails);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch emails" });
  }
});

// ✅ POST ingest
router.post("/ingest", async (req, res) => {
  const email = await Email.create(req.body);

  await emailQueue.add("process-email", {
    emailId: email._id,
  });

  res.json({ message: "Queued successfully" });
});

// ✅ GET tasks
router.get("/tasks/:emailId", async (req, res) => {
  const tasks = await Task.find({ emailId: req.params.emailId });
  res.json(tasks);
});

// ✅ GET decisions
router.get("/decisions/:emailId", async (req, res) => {
  const decisions = await Decision.find({ emailId: req.params.emailId });
  res.json(decisions);
});



// ✅ GET risks
router.get("/risks/:emailId", async (req, res) => {
  const risks = await Risk.find({ emailId: req.params.emailId });
  res.json(risks);
});


router.post("/reply", async (req, res) => {
  const { emailId } = req.body;

  const email = await Email.findById(emailId);

  const prompt = `
You are an AI assistant.

Generate 3 reply options for this email:

1. Safe (low risk)
2. Balanced
3. Aggressive (high commitment)

Email:
${email.body}

Return JSON:
[
  { type: "safe", text: "..." },
  { type: "balanced", text: "..." },
  { type: "aggressive", text: "..." }
]
`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "openai/gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await response.json();

  const replies = JSON.parse(data.choices[0].message.content);

  res.json(replies);
});



// Example route
router.post("/sync", async (req, res) => {
  console.log("🚀 SYNC STARTED");

try {
  console.log("🔑 TOKEN:", ACCESS_TOKEN);

  const gmail = getGmailClient(ACCESS_TOKEN);

  console.log("📡 Calling Gmail API...");

  const list = await gmail.users.messages.list({
    userId: "me",
    maxResults: 5,
  });

  console.log("📥 Messages fetched:", list.data.messages);

  for (const msg of list.data.messages || []) {
    console.log("➡️ Processing message:", msg.id);

    const { subject, sender, body } = await fetchEmailDetails(gmail, msg.id);

    console.log("📩 Email:", subject);

    const email = await Email.create({
      subject,
      sender,
      body,
    });

    console.log("💾 Saved email:", email._id);

    await emailQueue.add("process-email", {
      emailId: email._id,
    });

    console.log("📤 Job added:", email._id);
  }

} catch (err) {
  console.error("❌ SYNC ERROR:", err.message);
}
});

router.get("/test-queue", async (req, res) => {
  console.log("🧪 Test route hit");

  await emailQueue.add("process-email", {
    emailId: "test123",
  });

  console.log("📤 Test job added");

  res.send("Test done");
});

router.post("/send-reply", async (req, res) => {
  try {
    const { to, subject, message , emailId} = req.body;

    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.REDIRECT_URI
    );

    oAuth2Client.setCredentials({
      access_token: ACCESS_TOKEN // ⚠️ must exist
    });

    const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

    const emailContent = [
      `To: ${to}`,
      `Subject: Re: ${subject}`,
      "Content-Type: text/plain; charset=utf-8",
      "",
      message,
    ].join("\n");

    const encodedMessage = Buffer.from(emailContent)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage,
      },
    });
    await Email.findByIdAndUpdate(emailId, {
    requiresReply: false,
    lastRepliedAt: new Date(),
    });

    res.json({ success: true });

  } catch (err) {
    console.error("❌ Send Email Error:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
});

router.get("/followups", async (req, res) => {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const emails = await Email.find({
      requiresReply: true,
      lastRepliedAt: null,
    }).sort({ createdAt: -1 });

    res.json(emails);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch followups" });
  }
});

router.get("/followups/count", async (req, res) => {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const count = await Email.countDocuments({
      requiresReply: true,
      lastRepliedAt: null,
      createdAt: { $lte: oneHourAgo },
    });

    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: "Count failed" });
  }
});

router.get("/priority", async (req, res) => {
  try {
    const emails = await Email.find()
      .sort({ priorityScore: -1 })
      .limit(20);

    res.json(emails);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch priority emails" });
  }
});


router.get("/insight/:id", async (req, res) => {
  try {
    const data = await generateInsightGraph(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to generate insights" });
  }
});

export default router;