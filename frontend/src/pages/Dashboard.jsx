import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import InboxList from "../components/InboxList";
import EmailView from "../components/EmailView";
import Templates from "../components/Templates";
import GroupsList from "../components/GroupsList";
import GroupDetails from "../components/GroupDetails";
import GroupSummary from "../components/GroupSummary";

export default function Dashboard() {
  const [active, setActive] = useState("Inbox");
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);


  useEffect(() => {
    setSelectedEmail(null);
    setSelectedGroup(null);
  }, [active]);

  return (
    <div className="flex h-screen w-full bg-[#f1f5f9] relative">


      <AnimatePresence>
        {showSidebar && (
          <div className="fixed inset-0 z-50 flex">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/40"
              onClick={() => setShowSidebar(false)}
            />

            {/* Sidebar Sliding In */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-64 z-10"
            >
              <Sidebar
                active={active}
                setActive={(val) => {
                  setActive(val);
                  setShowSidebar(false);
                }}
                triggerRefresh={() => setRefresh(prev => !prev)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      <div className="hidden md:block">
        <Sidebar
          active={active}
          setActive={setActive}
          triggerRefresh={() => setRefresh(prev => !prev)}
        />
      </div>


      <div className="flex-1 flex flex-col overflow-hidden relative">

        {!(active === "Inbox" && selectedEmail) && !(active === "Groups" && selectedGroup) && (
          <div className="md:hidden p-3 bg-white shadow flex justify-between items-center z-10">
            <button onClick={() => setShowSidebar(true)}>☰</button>
            <h1 className="font-semibold">{active}</h1>
          </div>
        )}

        <AnimatePresence mode="wait">
          {active === "Groups" ? (
            <motion.div
              key="groups-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-1 overflow-hidden"
            >

              <div className="flex md:hidden flex-1 relative">
                <AnimatePresence mode="wait">
                  {!selectedGroup ? (
                    <motion.div
                      key="group-list"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="w-full h-full bg-gray-100 overflow-y-auto p-3"
                    >
                      <GroupsList
                        onSelect={setSelectedGroup}
                        selectedGroup={selectedGroup}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="group-detail"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col flex-1 h-full bg-white overflow-y-auto"
                    >
                      <div className="p-3 border-b sticky top-0 z-20 bg-white flex items-center justify-between shadow-sm">
                        <button
                          onClick={() => setSelectedGroup(null)}
                          className="flex items-center gap-1 text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
                        >
                          <ArrowLeft size={16} />
                          Back
                        </button>
                        <span className="text-sm font-medium text-gray-800 truncate">
                          Group Details
                        </span>
                      </div>

                      <div className="p-3 border-b">
                        <GroupSummary group={selectedGroup} />
                      </div>

                      <div className="p-3 bg-gray-50 flex-1">
                        <GroupDetails
                          group={selectedGroup}
                          onEmailClick={setSelectedEmail}
                          setActive={setActive}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="hidden md:flex flex-1 overflow-hidden">
                <div className="w-1/2 border-r bg-gray-100 overflow-y-auto p-4">
                  <GroupsList
                    onSelect={setSelectedGroup}
                    selectedGroup={selectedGroup}
                  />
                </div>

                <div className="w-1/4 border-r bg-white overflow-y-auto p-4">
                  <GroupSummary group={selectedGroup} />
                </div>

                <div className="flex-1 bg-gray-50 overflow-y-auto p-4">
                  <GroupDetails
                    group={selectedGroup}
                    onEmailClick={setSelectedEmail}
                    setActive={setActive}
                  />
                </div>
              </div>
            </motion.div>

          ) : active === "Templates" ? (

            <motion.div
              key="templates-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-1 overflow-hidden"
            >
              <Templates />
            </motion.div>

          ) : (

            <motion.div
              key="inbox-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-1 overflow-hidden"
            >

              <div className="flex md:hidden flex-1 relative">
                <AnimatePresence mode="wait">
                  {selectedEmail ? (
                    <motion.div
                      key="email-detail"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col flex-1 h-full bg-white min-h-0"
                    >
                      <div className="flex justify-between p-3 border-b sticky top-0 z-20 bg-white flex items-center gap-3 shadow-sm">
                        <button
                          onClick={() => setSelectedEmail(null)}
                          className="flex items-center gap-1 text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
                        >
                          <ArrowLeft size={16} />
                          Back
                        </button>

                        <span className="text-sm font-medium truncate">
                          Email
                        </span>
                      </div>

                      <div className="flex-1 min-h-0">
                        <EmailView email={selectedEmail} />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="email-list"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="w-full h-full bg-gray-100 overflow-y-auto p-3"
                    >
                      <InboxList
                        onSelect={setSelectedEmail}
                        selectedEmail={selectedEmail}
                        active={active}
                        refresh={refresh}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="hidden md:flex flex-1">
                <div className="w-[350px] border-r bg-gray-100 overflow-y-auto p-3">
                  <InboxList
                    onSelect={setSelectedEmail}
                    selectedEmail={selectedEmail}
                    active={active}
                    refresh={refresh}
                  />
                </div>

                <div className="flex-1 bg-white overflow-y-auto p-4">
                  <EmailView email={selectedEmail} />
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}