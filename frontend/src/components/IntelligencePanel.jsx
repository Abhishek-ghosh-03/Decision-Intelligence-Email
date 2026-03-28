import { useEffect, useState } from "react";
import API from "../services/api";

export default function IntelligencePanel({ emailId }) {
  const [decisions, setDecisions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [risks, setRisks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dRes, tRes, rRes] = await Promise.all([
          API.get(`/email/decisions/${emailId}`),
          API.get(`/email/tasks/${emailId}`),
          API.get(`/email/risks/${emailId}`),
        ]);

        setDecisions(dRes.data);
        setTasks(tRes.data);
        setRisks(rRes.data);
      } catch (err) {
        console.error("Error fetching intelligence:", err);
      }
    };

    fetchData();
  }, [emailId]);

  return (
    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow space-y-6">

      <h3 className="font-semibold text-lg">💡 AI Intelligence</h3>

      {/* ---------------- DECISIONS ---------------- */}
      <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
        <h4 className="text-green-700 font-semibold mb-3">✔ Decisions</h4>

        {decisions.length === 0 ? (
          <p className="text-sm text-gray-500">No decisions found</p>
        ) : (
          decisions.map((d) => (
            <div key={d._id} className="mb-4">
              <p className="mb-1">{d.text}</p>

              <div className="w-full bg-green-200 h-2 rounded">
                <div className="bg-green-500 h-2 rounded w-[85%]"></div>
              </div>

              <p className="text-xs text-right text-gray-500 mt-1">
                85% confidence
              </p>
            </div>
          ))
        )}
      </div>

      {/* ---------------- TASKS ---------------- */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <h4 className="text-blue-700 font-semibold mb-3">📌 Tasks</h4>

        {tasks.length === 0 ? (
          <p className="text-sm text-gray-500">No tasks found</p>
        ) : (
          tasks.map((t) => (
            <div key={t._id} className="mb-4">
              <p className="mb-1">{t.title}</p>

              <div className="w-full bg-blue-200 h-2 rounded">
                <div className="bg-blue-500 h-2 rounded w-[80%]"></div>
              </div>

              <p className="text-xs text-right text-gray-500 mt-1">
                80% confidence
              </p>
            </div>
          ))
        )}
      </div>

      {/* ---------------- RISKS ---------------- */}
      <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
        <h4 className="text-red-700 font-semibold mb-3">⚠ Risks</h4>

        {risks.length === 0 ? (
          <p className="text-sm text-gray-500">No risks found</p>
        ) : (
          risks.map((r) => (
            <div key={r._id} className="mb-4">
              <p className="mb-1">{r.text}</p>

              <div className="w-full bg-red-200 h-2 rounded">
                <div className="bg-red-500 h-2 rounded w-[70%]"></div>
              </div>

              <p className="text-xs text-right text-gray-500 mt-1">
                70% confidence
              </p>
            </div>
          ))
        )}
      </div>

    </div>
  );
}