import express from "express";
import { google } from "googleapis";
import { Email } from "../modules/email/email.model.js";
import { Task } from "../modules/task/task.model.js";
import { Decision } from "../modules/decision/decision.model.js";
import { Risk } from "../modules/risk/risk.model.js";
import { emailQueue } from "../queues/email.queue.js";
import { fetchEmailDetails, getGmailClientForUser } from "../services/gmail.service.js";
import { generateInsightGraph } from "../services/ai.service.js";
import { openai } from "../config/openrouter.js"; 
import multer from "multer";

const router = express.Router();
const upload = multer();


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


router.post("/ingest", async (req, res) => {
  const email = await Email.create(req.body);

  await emailQueue.add("process-email", {
    emailId: email._id,
  });

  res.json({ message: "Queued successfully" });
});


router.get("/tasks/:emailId", async (req, res) => {
  const tasks = await Task.find({ emailId: req.params.emailId });
  res.json(tasks);
});


router.get("/decisions/:emailId", async (req, res) => {
  const decisions = await Decision.find({ emailId: req.params.emailId });
  res.json(decisions);
});




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




router.post("/sync", async (req, res) => {
  // console.log("🚀 SYNC STARTED");

  try {

    const gmail = await getGmailClientForUser();

    // console.log("📡 Calling Gmail API...");

    const list = await gmail.users.messages.list({
      userId: "me",
      maxResults: 5,
    });

    // console.log("📥 Messages fetched:", list.data.messages);

    for (const msg of list.data.messages || []) {
      // console.log("➡️ Processing message:", msg.id);

      const { subject, sender, body } = await fetchEmailDetails(gmail, msg.id);

      // console.log("📩 Email:", subject);

      const email = await Email.create({
        subject,
        sender,
        body,
      });

      // console.log("💾 Saved email:", email._id);

      await emailQueue.add("process-email", {
        emailId: email._id,
      });

      // console.log("📤 Job added:", email._id);
    }

    res.json({ success: true, message: "Sync completed" });
  } catch (err) {
    console.error("❌ SYNC ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get("/test-queue", async (req, res) => {

  await emailQueue.add("process-email", {
    emailId: "test123",
  });

  console.log("📤 Test job added");

  res.send("Test done");
});

router.post("/send-reply", async (req, res) => {
  try {
    const { to, cc, bcc, subject, message, emailId } = req.body;
    const attachments = req.body.attachments || [];

    if (!to || !subject || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const gmail = await getGmailClientForUser();

    const boundary = "boundary123";

    let emailContent =
      `To: ${to}\r\n` +
      (cc ? `Cc: ${cc}\r\n` : "") +
      (bcc ? `Bcc: ${bcc}\r\n` : "") +
      `Subject: ${subject}\r\n` +
      `MIME-Version: 1.0\r\n` +
      `Content-Type: multipart/mixed; boundary="${boundary}"\r\n\r\n`;


    emailContent +=
      `--${boundary}\r\n` +
      `Content-Type: text/plain; charset="UTF-8"\r\n\r\n` +
      `${message}\r\n`;


    if (attachments.length > 0) {
      attachments.forEach((file) => {
        if (!file.data) return;

        emailContent +=
          `--${boundary}\r\n` +
          `Content-Type: ${file.type || "application/octet-stream"}; name="${file.name}"\r\n` +
          `Content-Disposition: attachment; filename="${file.name}"\r\n` +
          `Content-Transfer-Encoding: base64\r\n\r\n` +
          `${file.data}\r\n`;
      });
    }


    emailContent += `--${boundary}--`;

    const encodedMessage = Buffer.from(emailContent)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw: encodedMessage },
    });

    await Email.findByIdAndUpdate(emailId, {
      requiresReply: false,
      lastRepliedAt: new Date(),
    });

    res.json({ success: true });

  } catch (err) {
    console.error("❌ SEND ERROR:", err);
    res.status(500).json({ error: err.message });
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

router.get("/groups", async (req, res) => {
  try {
    const emails = await Email.find();

    const groupsMap = {};


    emails.forEach((email) => {
      const domain = email.sender.split("@")[1];

      if (!groupsMap[domain]) {
        groupsMap[domain] = {
          _id: domain,
          domain,
          emails: [],
          decisionCount: 0,
          taskCount: 0,
          riskCount: 0,
        };
      }

      groupsMap[domain].emails.push(email);
      groupsMap[domain].decisionCount += email.decisionCount || 0;
      groupsMap[domain].taskCount += email.taskCount || 0;
      groupsMap[domain].riskCount += email.riskCount || 0;
    });

    const groups = Object.values(groupsMap);


    const enrichedGroups = await Promise.all(
      groups.map(async (group) => {
        const combinedText = group.emails
          .slice(0, 3) 
          .map((e) => e.subject + " " + e.body)
          .join("\n");

        try {
          const response = await openai.chat.completions.create({
            model: "openai/gpt-4o-mini",
            messages: [
              {
                role: "user",
                content: `
Generate a short, professional title (max 6 words)
for this email conversation.

Do NOT include extra text.
Only return the title.

Emails:
${combinedText}
                `,
              },
            ],
            temperature: 0.3,
          });

          const title = response.choices[0].message.content.trim();

          return {
            ...group,
            title: title || group.domain, // fallback
          };
        } catch (err) {
          console.error("❌ Title generation failed");
          return {
            ...group,
            title: group.domain,
          };
        }
      })
    );

    res.json(enrichedGroups);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch groups" });
  }
});

router.get("/groups/:groupId/summary", async (req, res) => {
  try {
    const { groupId } = req.params;

    console.log("📦 GROUP:", groupId);

    
    const emails = await Email.find({
      sender: { $regex: groupId, $options: "i" }
    });

    console.log("📧 Emails found:", emails.length);

    
    if (!emails.length) {
      return res.json({
        overview: "No emails found in this group",
        decisions: [],
        tasks: [],
        risks: []
      });
    }

    
    const combinedText = emails
      .map(e => e.body)
      .filter(Boolean)
      .join("\n");

    
    if (!combinedText.trim()) {
      return res.json({
        overview: "Emails contain no readable content",
        decisions: [],
        tasks: [],
        risks: []
      });
    }

    console.log("🧠 Sending to AI...");

    const response = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `
You are an AI system that analyzes email conversations.

Return STRICT JSON ONLY:

{
  "overview": "short summary of the entire conversation",
  "decisions": ["clear decisions made"],
  "tasks": ["action items"],
  "risks": ["potential risks or concerns"]
}

Rules:
- Do NOT return markdown
- Do NOT leave fields undefined
- If nothing found, return empty arrays

Emails:
${combinedText}
          `
        }
      ],
      temperature: 0.2
    });

    const raw = response.choices[0].message.content;

    console.log("🧾 RAW:", raw);

    
    const clean = raw.replace(/```json|```/g, "").trim();

    let data;

    try {
      data = JSON.parse(clean);
    } catch (err) {
      console.error("❌ JSON PARSE ERROR");

      return res.json({
        overview: "AI response parsing failed",
        decisions: [],
        tasks: [],
        risks: []
      });
    }

    res.json(data);

  } catch (err) {
    console.error("❌ SUMMARY ERROR:", err.message);

    res.status(500).json({
      overview: "Failed to generate summary",
      decisions: [],
      tasks: [],
      risks: []
    });
  }
});
export default router;