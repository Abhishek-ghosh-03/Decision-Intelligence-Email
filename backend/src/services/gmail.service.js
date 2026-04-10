import { google } from "googleapis";
import { User } from "../modules/auth/user.model.js";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

export let ACCESS_TOKEN = "";

export const setAccessToken = (token) => {
  ACCESS_TOKEN = token;
};

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI   
);


export const getAuthUrl = () => {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/gmail.readonly","https://www.googleapis.com/auth/gmail.send"],
    prompt: "consent",
  });
};


export const getTokens = async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
};

export const getGmailClient = (accessToken) => {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  return google.gmail({ version: "v1", auth: oauth2Client });
};

export const getGmailClientForUser = async () => {
  const user = await User.findOne({ email: "test@gmail.com" });
  if (!user || (!user.accessToken && !user.refreshToken)) {
    throw new Error("No authenticated user found. Please login first.");
  }

  const client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );

  client.setCredentials({
    access_token: user.accessToken,
    refresh_token: user.refreshToken,
  });

  client.on('tokens', async (tokens) => {
    const updateData = {};
    if (tokens.access_token) updateData.accessToken = tokens.access_token;
    if (tokens.refresh_token) updateData.refreshToken = tokens.refresh_token;
    await User.findOneAndUpdate({ email: "test@gmail.com" }, updateData);
  });

  return google.gmail({ version: "v1", auth: client });
};

function decodeBase64(data) {
  return Buffer.from(data.replace(/-/g, "+").replace(/_/g, "/"), "base64")
    .toString("utf-8")
    .replace(/\r\n/g, "\n");
}


function getHeader(headers, name) {
  return headers.find(h => h.name === name)?.value || "";
}



function getEmailBody(payload) {

  const extract = (parts) => {
    for (let part of parts) {

      if (part.mimeType === "text/plain" && part.body?.data) {
        return decodeBase64(part.body.data);
      }


      if (part.mimeType === "text/html" && part.body?.data) {
        return decodeBase64(part.body.data);
      }


      if (part.parts) {
        const result = extract(part.parts);
        if (result) return result;
      }
    }
    return null;
  };


  if (payload.body?.data) {
    return decodeBase64(payload.body.data);
  }


  if (payload.parts) {
    const result = extract(payload.parts);
    if (result) return result;
  }

  return "No content found";
}

export const fetchEmailDetails = async (gmail, messageId) => {
  const res = await gmail.users.messages.get({
    userId: "me",
    id: messageId,
  });

  const payload = res.data.payload;

  const subject = getHeader(payload.headers, "Subject");
  const sender = getHeader(payload.headers, "From");
  const body = getEmailBody(payload);
  // console.log("📩 SUBJECT:", subject);
  // console.log("📨 BODY:", body?.slice(0, 100));

  return {
    subject,
    sender,
    body,
  };
};