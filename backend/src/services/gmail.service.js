import { google } from "googleapis";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

export let ACCESS_TOKEN = "";

export const setAccessToken = (token) => {
  ACCESS_TOKEN = token;
  console.log(  "ACCESS TOKEN SET ",ACCESS_TOKEN);
};
// 🔥 DEBUG (IMPORTANT)
console.log("CLIENT_ID:", CLIENT_ID);
console.log("REDIRECT_URI:", REDIRECT_URI);

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI   // 👈 THIS MUST NOT BE UNDEFINED
);

// ✅ AUTH URL
export const getAuthUrl = () => {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/gmail.readonly","https://www.googleapis.com/auth/gmail.send"],
    prompt: "consent",
  });
};

// ✅ 2. Exchange code → tokens
export const getTokens = async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
};
// 🔥 Gmail client setup (you already have OAuth)
export const getGmailClient = (accessToken) => {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  return google.gmail({ version: "v1", auth: oauth2Client });
};

// ✅ Decode base64 (Gmail format)
function decodeBase64(data) {
  return Buffer.from(data.replace(/-/g, "+").replace(/_/g, "/"), "base64")
    .toString("utf-8")
    .replace(/\r\n/g, "\n");
}

// ✅ Extract headers
function getHeader(headers, name) {
  return headers.find(h => h.name === name)?.value || "";
}

// function decodeBase64(data) {
//   return Buffer.from(
//     data.replace(/-/g, "+").replace(/_/g, "/"),
//     "base64"
//   ).toString("utf-8");
// }

function getEmailBody(payload) {
  // 🔥 recursive search
  const extract = (parts) => {
    for (let part of parts) {
      // plain text
      if (part.mimeType === "text/plain" && part.body?.data) {
        return decodeBase64(part.body.data);
      }

      // html fallback
      if (part.mimeType === "text/html" && part.body?.data) {
        return decodeBase64(part.body.data);
      }

      // 🔥 IMPORTANT (nested emails)
      if (part.parts) {
        const result = extract(part.parts);
        if (result) return result;
      }
    }
    return null;
  };

  // direct body
  if (payload.body?.data) {
    return decodeBase64(payload.body.data);
  }

  // multipart
  if (payload.parts) {
    const result = extract(payload.parts);
    if (result) return result;
  }

  return "No content found";
}
// 🔥 MAIN FUNCTION → fetch + parse email
export const fetchEmailDetails = async (gmail, messageId) => {
  const res = await gmail.users.messages.get({
    userId: "me",
    id: messageId,
  });

  const payload = res.data.payload;

  const subject = getHeader(payload.headers, "Subject");
  const sender = getHeader(payload.headers, "From");
  const body = getEmailBody(payload);
  console.log("📩 SUBJECT:", subject);
  console.log("📨 BODY:", body?.slice(0, 100));

  return {
    subject,
    sender,
    body,
  };
};