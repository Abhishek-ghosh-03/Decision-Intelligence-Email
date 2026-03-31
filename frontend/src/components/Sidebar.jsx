import { useEffect, useState } from "react";
import API from "../services/api";
import {
  Inbox,
  AlertTriangle,
  Clock,
  FileText,
  User2
} from "lucide-react";

export default function Sidebar({ active, setActive , triggerRefresh }) {
  const [followUpCount, setFollowUpCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await API.get("/api/email/followups/count");
        setFollowUpCount(res.data.count || 0);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCount();
  }, []);

  const menu = [
    { name: "Inbox", icon: Inbox },
    { name: "Follow-ups", icon: Clock },
    { name: "Priority", icon: AlertTriangle },
    { name: "Templates", icon: FileText } ,
    { name: "Groups" , icon: User2}
  ];
  const handleSync = async () => {
    try {
      await API.post("/email/sync");

      alert("✅ Emails synced!");

      
      triggerRefresh();

    } catch (err) {
      console.error(err);
      alert("❌ Sync failed");
    }
  };
  return (
    <div className="w-64 h-screen bg-[#0f172a] text-white flex flex-col justify-between p-4">

      
      <div>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold">
            DI
          </div>
          <div>
            <h1 className="text-lg font-semibold">Decision Intel</h1>
            <p className="text-xs text-gray-400">Email Intelligence</p>
          </div>
        </div>

      
        <div className="space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.name;

            return (
              <div
                key={item.name}
                onClick={() => setActive(item.name)}
                className={`group flex items-center justify-between px-4 py-2 rounded-lg cursor-pointer transition-all duration-200
    ${active === item.name
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-blue-500/20 hover:text-white"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={18}
                    className={`transition ${active === item.name
                      ? "text-white"
                      : "text-gray-400 group-hover:text-white"
                      }`}
                  />
                  <span className="text-sm">{item.name}</span>
                </div>

                {item.name === "Follow-ups" && followUpCount > 0 && (
                  <span className="bg-orange-500 text-xs px-2 py-0.5 rounded-full">
                    {followUpCount}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      
      <div className="text-xs text-gray-500 space-y-2">
        <button
          onClick={handleSync}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
           Sync Emails
        </button>
        <p>version 1 . Decision Intelligence</p>
      </div>
    </div>
  );
}