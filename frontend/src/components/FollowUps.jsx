import { useEffect, useState } from "react";
import API from "../services/api";

export default function FollowUps({ setSelectedEmail }) {
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    API.get("api/email/followups")
      .then(res => {
        const sorted = res.data.sort(
          (a, b) => b.followUpScore - a.followUpScore
        );
        setEmails(sorted);
      });
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Follow-ups</h2>

      {emails.map((email) => (
        <div
          key={email._id}
          onClick={() => setSelectedEmail(email)}
          className="p-4 border rounded mb-2 cursor-pointer hover:bg-gray-50"
        >
          <p className="font-semibold">{email.subject}</p>
          <p className="text-sm text-gray-500">{email.sender}</p>

          <p className="text-xs text-orange-600 mt-1">
            Priority: {email.followUpScore}
          </p>
        </div>
      ))}
    </div>
  );
}