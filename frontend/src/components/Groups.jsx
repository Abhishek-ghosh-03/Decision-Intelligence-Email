import { useState } from "react";
import { CheckCircle, AlertTriangle, Star } from "lucide-react";

export default function Groups() {
  const [activeTab, setActiveTab] = useState("All Groups");

  const groups = [
    {
      title: "Q4 Budget Review – Design Team",
      email: "@acme.com",
      priority: "high",
      stats: { decisions: 2, tasks: 3, risks: 1 },
      emails: 5,
      time: "2 hours ago",
      color: "blue",
    },
    {
      title: "Security Audit – Q4 Planning",
      email: "@acme.com",
      priority: "high",
      stats: { decisions: 1, tasks: 2, risks: 2 },
      emails: 8,
      time: "1 hour ago",
      color: "red",
    },
    {
      title: "Performance Metrics – Monthly Review",
      email: "@techcorp.io",
      priority: "medium",
      stats: { decisions: 1, tasks: 1, risks: 0 },
      emails: 3,
      time: "4 hours ago",
      color: "yellow",
    },
    {
      title: "Vendor Onboarding – Marketing",
      email: "@startup.ai",
      priority: "low",
      stats: { decisions: 2, tasks: 2, risks: 1 },
      emails: 4,
      time: "Yesterday",
      color: "gray",
    },
  ];

  const getBorder = (color) => {
    switch (color) {
      case "blue":
        return "border-blue-400 bg-blue-50";
      case "red":
        return "border-red-400 bg-red-50";
      case "yellow":
        return "border-yellow-400 bg-yellow-50";
      default:
        return "border-gray-300 bg-gray-50";
    }
  };

  return (
    <div>
      {/* HEADER */}
      <h1 className="text-2xl font-semibold mb-1">Groups</h1>
      <p className="text-sm text-gray-500 mb-4">
        Conversations automatically grouped by sender, organization, and topic.
      </p>

      {/* FILTER BUTTONS */}
      <div className="flex gap-3 mb-6">
        {["All Groups", "High Priority", "By Organization"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-lg text-sm ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* GROUP CARDS */}
      <div className="grid grid-cols-2 gap-5">
        {groups.map((g, i) => (
          <div
            key={i}
            className={`p-4 rounded-xl border ${getBorder(g.color)} shadow-sm`}
          >
            {/* TITLE */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-medium">{g.title}</h2>
                <p className="text-xs text-gray-500">{g.email}</p>
              </div>

              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  g.priority === "high"
                    ? "bg-red-200 text-red-700"
                    : g.priority === "medium"
                    ? "bg-yellow-200 text-yellow-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {g.priority}
              </span>
            </div>

            {/* STATS */}
            <div className="flex gap-3 mt-3">
              <span className="flex items-center gap-1 text-xs bg-green-100 px-2 py-0.5 rounded">
                <CheckCircle size={12} /> {g.stats.decisions}
              </span>

              <span className="flex items-center gap-1 text-xs bg-blue-100 px-2 py-0.5 rounded">
                <Star size={12} /> {g.stats.tasks}
              </span>

              <span className="flex items-center gap-1 text-xs bg-orange-100 px-2 py-0.5 rounded">
                <AlertTriangle size={12} /> {g.stats.risks}
              </span>
            </div>

            {/* FOOTER */}
            <div className="flex justify-between text-xs text-gray-500 mt-4">
              <span>{g.emails} emails</span>
              <span>{g.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}