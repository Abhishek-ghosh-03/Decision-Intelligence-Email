import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../services/api";

export default function GroupsList({ onSelect, selectedGroup }) {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setIsLoading(true);
    try {
      const res = await API.get("/api/email/groups");
      setGroups(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
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
        {isLoading ? (
          [1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 rounded-xl border border-gray-200 bg-white shadow-md"
            >
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-3 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-3 animate-pulse"></div>
              <div className="flex gap-2 mb-3">
                <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-4 bg-gray-100 rounded w-12 animate-pulse"></div>
                <div className="h-4 bg-gray-100 rounded w-12 animate-pulse"></div>
              </div>
            </motion.div>
          ))
        ) : groups.length === 0 ? (
          <p className="col-span-full py-6 text-center text-gray-500">No groups found</p>
        ) : (
          groups.map((g, index) => (
            <motion.div
              key={g._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelect(g)}
              className={`p-4 rounded-xl border cursor-pointer shadow-md hover:shadow-lg transition-all ${
                selectedGroup?._id === g._id
                  ? "border-blue-400 bg-blue-50 ring-2 ring-blue-500/20"
                  : `${getPriorityStyle(g.priority)}`
              }`}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-sm md:text-base">
                  {g.title}
                </h3>
                {g.priority && (
                  <span className="text-[10px] md:text-xs px-2 py-1 rounded-full bg-red-100 text-red-600 font-medium">
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
                    className="w-6 h-6 text-[10px] font-bold flex items-center justify-center rounded-full bg-blue-200/50 text-blue-700 shadow-sm"
                  >
                    {p[0]?.toUpperCase()}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 mt-3 text-[10px] md:text-xs">
                {g.decisionCount > 0 && <span className="px-2 py-1 rounded-lg bg-green-100 text-green-700 shadow-sm font-medium">✅ {g.decisionCount}</span>}
                {g.taskCount > 0 && <span className="px-2 py-1 rounded-lg bg-blue-100 text-blue-700 shadow-sm font-medium">📌 {g.taskCount}</span>}
                {g.riskCount > 0 && <span className="px-2 py-1 rounded-lg bg-red-100 text-red-700 shadow-sm font-medium">⚠️ {g.riskCount}</span>}
              </div>

              <div className="flex justify-between mt-3 text-[10px] md:text-xs text-gray-500 font-medium">
                <span>{g.emailCount} emails</span>
                <span>{g.lastActivity || "recent"}</span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}