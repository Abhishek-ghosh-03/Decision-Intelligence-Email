import API from "../services/api";
import IntelligencePanel from "./IntelligencePanel";
import ReplyAssistant from "./ReplyAssistant";
import ContextGraph from "./ContextGraph";
import { useEffect, useState, useRef } from "react";


function highlightContent(body, tasks = []) {
  if (!body) return "";

  let updated = body;

  tasks.forEach((task) => {
    const text = task?.title;
    if (!text) return;

    if (updated.toLowerCase().includes(text.toLowerCase())) {
      updated = updated.replace(
        text,
        `<span class="bg-yellow-200 px-1 rounded">${text}</span>`
      );
    }
  });

  return updated;
}


function MobileReplyActions({ email }) {
  const replyRef = useRef();

  return (
    <div className="space-y-4">

      {/* BUTTONS */}
      <div className="flex gap-3">

        <button
          onClick={() => replyRef.current?.openReply()}
          className="flex-1 bg-blue-600 text-white py-3 rounded-full font-medium"
        >
          Reply
        </button>

        <button
          onClick={() => replyRef.current?.openForward()}
          className="flex-1 bg-gray-200 py-3 rounded-full font-medium"
        >
          Forward
        </button>

      </div>

      
      <div className="hidden">
        <ReplyAssistant ref={replyRef} email={email} />
      </div>

    </div>
  );
}




function MobileTabs({ email }) {
  const [activeTab, setActiveTab] = useState("ai");

  return (
    <div className="mt-4">

      <div className="flex bg-gray-100 rounded-full p-1 mb-4">
        <button
          onClick={() => setActiveTab("ai")}
          className={`flex-1 py-2 text-sm rounded-full ${
            activeTab === "ai"
              ? "bg-white shadow font-medium"
              : "text-gray-500"
          }`}
        >
          ✨AI
        </button>

        <button
          onClick={() => setActiveTab("reply")}
          className={`flex-1 py-2 text-sm rounded-full ${
            activeTab === "reply"
              ? "bg-white shadow font-medium"
              : "text-gray-500"
          }`}
        >
          Reply
        </button>
      </div>

      {activeTab === "ai" && (
        <IntelligencePanel emailId={email._id} />
      )}

      {activeTab === "reply" && (
        <MobileReplyActions email={email} />
      )}
    </div>
  );
}


export default function EmailView({ email }) {
  const [tasks, setTasks] = useState([]);
  const [showGraph, setShowGraph] = useState(false);

  useEffect(() => {
    if (!email?._id) return;

    const fetchData = async () => {
      try {
        const t = await API.get(`/email/tasks/${email._id}`);
        setTasks(t.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [email]);

  if (!email) return <p className="p-4">Select an email</p>;

  const highlightedBody = highlightContent(email.body, tasks);

  return (
    <div className="flex flex-col h-full min-h-0">


      <div className="md:hidden sticky top-0 z-10 bg-white border-b px-4 py-3">
        <div className="flex justify-between">
          <h1 className="text-lg font-semibold">{email.subject}</h1>
        </div>

        <div className="text-xs text-gray-500 mt-1 flex justify-between">
          <span>{email.sender}</span>
          <span>{new Date(email.createdAt).toLocaleDateString()}</span>
        </div>
      </div>


      <div className="hidden md:block">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">{email.subject}</h1>
          <button
            onClick={() => setShowGraph(true)}
            className="mb-3 px-3 py-1 bg-blue-600 text-white rounded-full"
          >
            +
          </button>
        </div>

        <div className="flex justify-between border-b pb-2">
          <p>{email.sender}</p>
          <p>{new Date(email.createdAt).toLocaleDateString()}</p>
        </div>
      </div>


      <div className="flex-1 overflow-y-auto p-4 space-y-6 min-h-0">


        <div>
          {email.body?.includes("<") ? (
            <div dangerouslySetInnerHTML={{ __html: highlightedBody }} />
          ) : (
            <pre className="whitespace-pre-wrap break-words text-sm leading-relaxed">
              {highlightedBody}
            </pre>
          )}
        </div>


        <div className="md:hidden mt-6">
          <MobileTabs email={email} />
        </div>


        <div className="hidden md:block space-y-6">
          <IntelligencePanel emailId={email._id} />
          <ReplyAssistant email={email} />
        </div>

      </div>


      <button
        onClick={() => setShowGraph(true)}
        className="md:hidden fixed bottom-5 right-5 bg-blue-600 text-white w-12 h-12 rounded-full"
      >
        +
      </button>

      {showGraph && (
        <ContextGraph
          email={email}
          onClose={() => setShowGraph(false)}
        />
      )}
    </div>
  );
}