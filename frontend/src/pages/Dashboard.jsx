import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
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


      {showSidebar && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-64">
            <Sidebar
              active={active}
              setActive={(val) => {
                setActive(val);
                setShowSidebar(false);
              }}
              triggerRefresh={() => setRefresh(prev => !prev)}
            />
          </div>

          <div
            className="flex-1 bg-black/40"
            onClick={() => setShowSidebar(false)}
          />
        </div>
      )}


      <div className="hidden md:block">
        <Sidebar
          active={active}
          setActive={setActive}
          triggerRefresh={() => setRefresh(prev => !prev)}
        />
      </div>


      <div className="flex-1 flex flex-col overflow-hidden">


        {!(active === "Inbox" && selectedEmail) && !(active === "Groups" && selectedGroup) && (
          <div className="md:hidden p-3 bg-white shadow flex justify-between items-center">
            <button onClick={() => setShowSidebar(true)}>☰</button>
            <h1 className="font-semibold">{active}</h1>
          </div>
        )}


        {active === "Groups" ? (
          <div className="flex flex-1 overflow-hidden">


            <div className="flex md:hidden flex-1">
              {!selectedGroup ? (
                <div className="w-full bg-gray-100 overflow-y-auto p-3">
                  <GroupsList
                    onSelect={setSelectedGroup}
                    selectedGroup={selectedGroup}
                  />
                </div>
              ) : (
                <div className="flex flex-col flex-1 bg-white overflow-y-auto">
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

                  <div className="p-3 bg-gray-50">
                    <GroupDetails
                      group={selectedGroup}
                      onEmailClick={setSelectedEmail}
                      setActive={setActive}
                    />
                  </div>
                </div>
              )}
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
          </div>

        ) : active === "Templates" ? (


          <div className="flex flex-1 overflow-hidden">
            <Templates />
          </div>

        ) : (


          <div className="flex flex-1 overflow-hidden">


            <div className="flex md:hidden flex-1">
              {selectedEmail ? (
                <div className="flex flex-col flex-1 bg-white min-h-0">


                  <div className="flex justify-between p-3 border-b sticky top-0 z-20 bg-white flex items-center gap-3">
                    <button
                      onClick={() => setSelectedEmail(null)}
                      className="flex items-center gap-1 text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full text-sm font-medium transition-colors "
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

                </div>
              ) : (
                <div className="w-full bg-gray-100 overflow-y-auto p-3">
                  <InboxList
                    onSelect={setSelectedEmail}
                    selectedEmail={selectedEmail}
                    active={active}
                    refresh={refresh}
                  />
                </div>
              )}
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

          </div>
        )}

      </div>
    </div>
  );
}