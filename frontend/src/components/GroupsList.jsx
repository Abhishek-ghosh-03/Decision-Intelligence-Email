import { useEffect, useState } from "react";
import API from "../services/api";

export default function GroupsList({ onSelect, selectedGroup }) {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await API.get("/api/email/groups");
      setGroups(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "high":
        return "border-red-300 bg-red-50";
      case "medium":
        return "border-yellow-300 bg-yellow-50";
      default:
        return "border-gray-200 bg-white";
    }
  };

  return (
    <div className="px-3 md:px-6 py-4 space-y-4">

      
      <div>
        <h2 className="text-xl md:text-2xl font-bold">Groups</h2>
        <p className="text-xs md:text-sm text-gray-500">
          Conversations grouped by sender, organization, and topic.
        </p>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">

        {groups.map((g) => (
          <div
            key={g._id}
            onClick={() => onSelect(g)}
            className={`p-4 rounded-xl border cursor-pointer transition ${
              selectedGroup?._id === g._id
                ? "border-blue-400 bg-blue-50"
                : `${getPriorityStyle(g.priority)} hover:shadow-md`
            }`}
          >
            
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-sm md:text-base">
                {g.title}
              </h3>

              {g.priority && (
                <span className="text-[10px] md:text-xs px-2 py-1 rounded-full bg-red-100 text-red-600">
                  {g.priority}
                </span>
              )}
            </div>

            
            <p className="text-xs md:text-sm text-gray-500">
              {g.domain}
            </p>

            
            <div className="flex gap-2 mt-2">
              {g.participants?.slice(0, 3).map((p, i) => (
                <div
                  key={i}
                  className="w-6 h-6 text-xs flex items-center justify-center rounded-full bg-blue-200 text-blue-700"
                >
                  {p[0]}
                </div>
              ))}
            </div>

            
            <div className="flex flex-wrap gap-2 mt-3 text-[10px] md:text-xs">
              <span className="px-2 py-1 rounded-lg bg-green-100 text-green-600">
                ✅ {g.decisionCount}
              </span>
              <span className="px-2 py-1 rounded-lg bg-blue-100 text-blue-600">
                📌 {g.taskCount}
              </span>
              <span className="px-2 py-1 rounded-lg bg-red-100 text-red-600">
                ⚠️ {g.riskCount}
              </span>
            </div>

            
            <div className="flex justify-between mt-3 text-[10px] md:text-xs text-gray-400">
              <span>{g.emailCount} emails</span>
              <span>{g.lastActivity || "recent"}</span>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}