import { useState } from "react";
import Sidebar from "../components/Sidebar";
import InboxList from "../components/InboxList";
import EmailView from "../components/EmailView";
import Templates from "../components/Templates";
import Groups from "../components/Groups";

export default function Dashboard() {
  const [active, setActive] = useState("Inbox");
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="flex h-screen w-full bg-[#f1f5f9]">

      {/* SIDEBAR */}
      <div className="w-64 bg-[#0f172a] text-white flex-shrink-0">
        <Sidebar
          active={active}
          setActive={setActive}
          triggerRefresh={() => setRefresh(prev => !prev)}
        />
      </div>

      {/* INBOX (ONLY SHOW WHEN NOT TEMPLATES) */}
      {active !== "Templates" && (
        <div className="w-[380px] border-r bg-gray-100 overflow-y-auto p-4">
          <InboxList
            onSelect={setSelectedEmail}
            selectedEmail={selectedEmail}
            active={active}
            refresh={refresh}
          />
        </div>
      )}

      {/* RIGHT PANEL (ONLY ONE) */}
      <div className="flex-1 bg-white overflow-y-auto p-6">
        {active === "Templates" ? (
          <Templates />
        ) : active === "Groups" ? (
          <Groups />
        ) : (
          <EmailView email={selectedEmail} />
        )}
      </div>

    </div>
  );
}