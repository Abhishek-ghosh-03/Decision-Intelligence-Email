import { useEffect, useState } from "react";
import API from "../services/api";

export default function GroupSummary({ group }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (group) fetchSummary();
  }, [group]);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/api/email/groups/${group._id}/summary`);
      setSummary(res.data);
    } catch (err) {
      console.error(err);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  if (!group) {
    return (
      <p className="text-gray-400 text-sm p-4">
        Select a group to view AI summary
      </p>
    );
  }

  return (
    <div className="p-3 md:p-5 space-y-4">

      <div>
        <h2 className="font-bold text-lg md:text-xl">✨ AI Summary</h2>
        <p className="text-xs text-gray-500">{group.title}</p>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">🧠 Analyzing...</p>
      ) : (
        <>
          
          <div className="p-3 rounded-xl bg-gray-50 border text-sm">
            {summary?.overview ?? "No summary available"}
          </div>

          
          <SummaryBlock
            title="✅ Decisions"
            data={summary?.decisions}
            color="green"
          />

          <SummaryBlock
            title="📌 Tasks"
            data={summary?.tasks}
            color="blue"
          />

          <SummaryBlock
            title="⚠️ Risks"
            data={summary?.risks}
            color="red"
          />
        </>
      )}
    </div>
  );
}

function SummaryBlock({ title, data, color }) {
  const colorMap = {
    green: "bg-green-50 text-green-700",
    blue: "bg-blue-50 text-blue-700",
    red: "bg-red-50 text-red-700",
  };

  return (
    <div>
      <p className="font-medium text-sm mb-1">{title}</p>

      {data?.length ? (
        <ul className={`text-sm space-y-1 rounded-lg p-3 ${colorMap[color]}`}>
          {data.map((item, i) => (
            <li key={i}>• {item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-gray-400">No data found</p>
      )}
    </div>
  );
}