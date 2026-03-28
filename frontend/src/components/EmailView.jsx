import { useEffect, useState } from "react";
import API from "../services/api";
import IntelligencePanel from "./IntelligencePanel";
import ReplyAssistant from "./ReplyAssistant";
import ContextGraph from "./ContextGraph";
/* =========================
   🔥 HIGHLIGHT FUNCTION */
function highlightContent(body, tasks = []) {
  if (!body) return "";

  let updated = body;

  tasks.forEach((task) => {
    const text = task?.title;
    if (!text) return;

    // simple check
    if (updated.toLowerCase().includes(text.toLowerCase())) {
      updated = updated.replace(
        text,
        `<span class="bg-yellow-200 px-1 rounded">${text}</span>`
      );
    }
  });

  return updated;
}


/* =========================
   🔥 COMPONENT
========================= */
export default function EmailView({ email }) {
  const [decisions, setDecisions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [risks, setRisks] = useState([]);
  const [showGraph, setShowGraph] = useState(false);
  /* =========================
     🔥 FETCH AI DATA
  ========================= */
  useEffect(() => {
    if (!email?._id) return;

    const fetchData = async () => {
      try {
        const [d, t, r] = await Promise.all([
          API.get(`/email/decisions/${email._id}`),
          API.get(`/email/tasks/${email._id}`),
          API.get(`/email/risks/${email._id}`),
        ]);

        setDecisions(d.data || []);
        setTasks(t.data || []);
        setRisks(r.data || []);
      } catch (err) {
        console.error("Error fetching intelligence:", err);
      }
    };

    fetchData();
  }, [email]);

  if (!email) return <p>Select an email</p>;

  /* =========================
     🔥 HIGHLIGHTED BODY
  ========================= */
  const highlightedBody = highlightContent(
    email.body,
    decisions,
    tasks,
    risks
  );

  return (
    <div className="space-y-6">

      {/* =========================
          EMAIL HEADER
      ========================= */}
      <div>
        <div className="flex justify-between">
        <h1 className="text-2xl font-bold">{email.subject}</h1>
        <button
          onClick={() => setShowGraph(true)}
          className="mb-3 px-3 py-1 bg-blue-600 text-white rounded-full"
          >
          +
        </button>
        </div>
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <p className="text-gray-600 font-medium">
            {email.sender}
          </p>

          <p className="text-sm text-gray-400">
            {new Date(email.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        {/* =========================
            EMAIL BODY (WITH HIGHLIGHT)
        ========================= */}
        <div className="text-gray-700 leading-relaxed">
          {email.body?.includes("<") ? (
            <div
              dangerouslySetInnerHTML={{
                __html: highlightedBody,
              }}
            />
          ) : (
            <pre className="whitespace-pre-wrap">
              {highlightedBody}
            </pre>
          )}
        </div>
      </div>

      {/* =========================
          AI PANELS
      ========================= */}
      <IntelligencePanel emailId={email._id} />

      <ReplyAssistant email={email} />
      {showGraph && (
        <ContextGraph
          email={email}
          onClose={() => setShowGraph(false)}
        />
      )}
    </div>
  );
}