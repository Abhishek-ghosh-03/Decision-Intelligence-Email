import { useState, useEffect } from "react";
import API from "../services/api";
import { createPortal } from "react-dom";

export default function ReplyAssistant({ email }) {
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedReply, setSelectedReply] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  // ✅ Reset when email changes
  useEffect(() => {
    setReplies([]);
    setSelectedReply("");
    setShowModal(false);
  }, [email?._id]);

  useEffect(() => {
    const fetchTemplates = async () => {
      const res = await API.get("/template");
      setTemplates(res.data);
    };

    fetchTemplates();
  }, []);

  // ✅ Generate replies
  const generateReplies = async () => {
    setLoading(true);
    try {
      const res = await API.post(`/ai/reply/${email._id}`);
      setReplies(res.data.replies || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // ✅ Send email
  const sendReply = async () => {
    try {
      await API.post("/email/send-reply", {
        to: email.sender,
        subject: email.subject,
        message: selectedReply,
        emailId: email._id,
      });

      alert("✅ Email sent!");
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to send email");
    }
  };
  console.log("MODAL STATE:", showModal);
  return (
    <div className="mt-6 relative z-10">

      {/* GENERATE BUTTON */}
      <button
        onClick={generateReplies}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
      >
        ✨ Generate AI Replies
      </button>

      {loading && <p className="mt-3">Generating...</p>}

      {/* REPLIES LIST */}
      {replies.length > 0 && (
        <div className="mt-4 space-y-3">
          {replies.map((r, i) => (
            <div
              key={i}
              onClick={() => {
                console.log("CLICK WORKING"); // debug
                setSelectedReply(r.text);
                setShowModal(true);
              }}
              className="p-3 border border-gray-200 shadow rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition-all duration-3 opacity-0 animate-fadeIn"
              style={{ animationDelay: `${i * 0.1}s`, animationFillMode: "forwards" }}
            >
              <p className="text-sm font-semibold capitalize">{r.type}</p>
              <p className="text-sm mt-1">{r.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* {showModal &&
        createPortal(
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
            <div className="bg-white p-6 rounded-xl w-[500px] shadow-lg">
              <h3 className="font-semibold mb-3">✏️ Edit Reply</h3>

              <textarea
                value={selectedReply}
                onChange={(e) => setSelectedReply(e.target.value)}
                className="w-full h-40 border rounded p-2"
              />

              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setShowModal(false)}>
                  Cancel
                </button>

                <button onClick={sendReply}>
                  Send
                </button>
              </div>
            </div>
          </div>,
          document.body
        )} */}
      {showModal &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.7)",
              zIndex: 99999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                background: "white",
                padding: "20px",
                width: "400px",
                borderRadius: "10px",
              }}
            >
              <h3 className="font-semibold mb-3">✏️ Edit Reply</h3>

              <textarea
                value={selectedReply}
                onChange={(e) => setSelectedReply(e.target.value)}
                style={{ width: "100%", height: "120px" }}
              />

              <button onClick={sendReply}>
                Send
              </button>
              <button onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <select
                onChange={(e) => {
                  const template = templates.find(t => t._id === e.target.value);
                  setSelectedTemplate(template);

                  if (template) {
                    setSelectedReply(
                      `${template.greeting}\n\n${selectedReply}\n\n${template.closing}\n${template.signature}`
                    );
                  }
                }}
                className="border p-2 rounded w-full mb-2"
              >
                <option>Select Template</option>
                {templates.map(t => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}