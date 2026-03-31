import { useEffect, useState } from "react";
import API from "../services/api";

export default function InboxList({ onSelect, active, refresh }) {
  const [emails, setEmails] = useState([]);

  const fetchEmails = async () => {
    try {
      let res;

      if (active === "Inbox") {
        res = await API.get("/api/email");
      }
      else if (active === "Priority") {
        res = await API.get("/api/email/priority");
      }
      else if (active === "Follow-ups") {
        res = await API.get("/api/email/followups");
      }

      console.log("ACTIVE TAB:", active);
      console.log("DATA:", res?.data);

      setEmails(res?.data || []);

    } catch (err) {
      console.error("Error fetching emails:", err);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, [active, refresh]);

  const getPreview = (body) => {
    if (!body) return "";
    const cleanText = body.replace(/<[^>]+>/g, "");
    return cleanText.slice(0, 120) + "...";
  };

  return (
    <div>
      <div className="mb-2 shadow space-y-1 pt-4 p-2 py-1">
        <h1 className="text-xl font-bold text-gray-800">{active}</h1>
        <p className="text-sm text-gray-500">
          {emails.length} emails
        </p>
      </div>


      <div className="space-y-2">
        {emails.length === 0 ? (
          <p>No emails found</p>
        ) : (
          emails.map((email) => (
            <div
              key={email._id}
              onClick={() => onSelect(email)}
              className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition cursor-pointer border border-gray-200"
            >
              <h2 className="font-semibold text-gray-800">
                {email.subject}
              </h2>

              <p className="text-sm text-gray-500">
                {email.sender}
              </p>

              <div className="flex flex-wrap gap-2 mt-3 text-xs">
                {email.decisionCount > 0 && (
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    🧠 {email.decisionCount}
                  </span>
                )}

                {email.taskCount > 0 && (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    📌 {email.taskCount}
                  </span>
                )}

                {email.riskCount > 0 && (
                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full">
                    ⚠️ {email.riskCount}
                  </span>
                )}
                {email.requiresReply && !email.lastRepliedAt && (
                  <span>⚠️ Needs Reply</span>
                )}
              </div>

              <p className="text-sm text-gray-600 mt-1">
                {getPreview(email.body)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}