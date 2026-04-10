import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../services/api";

export default function InboxList({ onSelect, active, refresh }) {
  const [emails, setEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEmails = async () => {
    setIsLoading(true);
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

      setEmails(res?.data || []);

    } catch (err) {
      console.error("Error fetching emails:", err);
    } finally {
      setIsLoading(false);
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
        {isLoading ? (
          <motion.div
            initial="hidden" animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            className="space-y-2"
          >
            {[1, 2, 3, 4, 5].map(i => (
              <motion.div key={i} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} className="p-4 bg-white rounded-xl border border-gray-200">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-3 animate-pulse"></div>
                <div className="flex gap-2"><div className="h-6 bg-gray-100 rounded w-16 animate-pulse"></div></div>
              </motion.div>
            ))}
          </motion.div>
        ) : emails.length === 0 ? (
          <motion.p initial={{opacity:0}} animate={{opacity:1}} className="text-gray-500 text-center py-10">No emails found</motion.p>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
            className="space-y-2"
          >
            {emails.map((email) => (
              <motion.div
                key={email._id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
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
                    <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full">⚠️ Needs Reply</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {getPreview(email.body)}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}