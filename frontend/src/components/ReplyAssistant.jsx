import { useState, useEffect } from "react";
import API from "../services/api";
import { createPortal } from "react-dom";
import { Reply, Forward, Send, Paperclip, Smile } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { forwardRef, useImperativeHandle } from "react";

const ReplyAssistant = forwardRef(({ email }, ref) => {
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedReply, setSelectedReply] = useState("");
  const [showModal, setShowModal] = useState(false);
  useImperativeHandle(ref, () => ({
    openReply: () => {
      setMode("reply");
      setTo(email.sender);
      setSubject(
        email.subject.startsWith("Re:")
          ? email.subject
          : `Re: ${email.subject}`
      );
      setSelectedReply("");
      setShowModal(true);
    },

    openForward: () => {
      setMode("forward");
      setTo("");
      setSubject(
        email.subject.startsWith("Fwd:")
          ? email.subject
          : `Fwd: ${email.subject}`
      );
      setSelectedReply(
        `---------- Forwarded message ----------\nFrom: ${email.sender}\nSubject: ${email.subject}\n\n${email.body}`
      );
      setShowModal(true);
    },
  }));
  const [mode, setMode] = useState("reply");

  const [to, setTo] = useState("");
  const [showCC, setShowCC] = useState(false);
  const [showBCC, setShowBCC] = useState(false);
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [subject, setSubject] = useState("");

  const [templates, setTemplates] = useState([]);
  const [attachments, setAttachments] = useState([]);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showEmoji, setShowEmoji] = useState(false);

    useEffect(() => {
    setReplies([]);
    setSelectedReply("");
    setShowModal(false);
  }, [email?._id]);

  
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await API.get("/template"); 
        setTemplates(res.data);
        console.log(res.data);
      } catch (err) {
        console.error("Template fetch error:", err);
      }
    };

    fetchTemplates();
  }, []);

  
  const handleMouseDown = (e) => {
    const startX = e.clientX - position.x;
    const startY = e.clientY - position.y;

    const handleMouseMove = (e) => {
      setPosition({
        x: e.clientX - startX,
        y: e.clientY - startY,
      });
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  
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
  const MAX_SIZE = 5 * 1024 * 1024;
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    for (let file of files) {
      if (file.size > MAX_SIZE) {
        alert("File too large (max 5MB)");
        return;
      }
    }
    const converted = await Promise.all(
      files.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve({
              name: file.name,
              type: file.type,
              data: reader.result.split(",")[1],
            });
          };
          reader.readAsDataURL(file);
        });
      })
    );

    setAttachments((prev) => [...prev, ...converted]);
  };
  
  const sendReply = async () => {
    try {
      console.log("SENDING:", {
        to,
        subject,
        message: selectedReply,
      });

      await API.post("/email/send-reply", {
        to,
        cc,
        bcc,
        subject,
        message: selectedReply,
        emailId: email._id,
        attachments
      });

      alert("✅ Email sent!");
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to send email");
    }
  };

  const handleEmojiClick = (emojiData) => {
    setSelectedReply((prev) => prev + emojiData.emoji);
  };
  return (
    <div className="mt-6">

  
      <div className="flex items-center gap-3 py-5">

        <button
          onClick={generateReplies}
          className="w-[200px] h-[42px] bg-blue-600 text-white px-4 rounded-full font-bold shadow-md flex items-center justify-center"
        >
          ✨AI Reply
        </button>

        <button
          onClick={() => {
            setMode("reply");
            setTo(email.sender);
            setSubject(email.subject.startsWith("Re:")
              ? email.subject
              : `Re: ${email.subject}`);
            setSelectedReply("");
            setShowModal(true);
          }}
          className="w-[100px] h-[42px] bg-gray-200 rounded-full font-bold shadow-md flex items-center justify-center gap-2 px-2"
        >
          <Reply size={16} />
          <span>Reply</span>
        </button>

        <button
          onClick={() => {
            setMode("forward");
            setTo("");
            setSubject(email.subject.startsWith("Fwd:")
              ? email.subject
              : `Fwd: ${email.subject}`);
            setSelectedReply(
              `---------- Forwarded message ----------\nFrom: ${email.sender}\nSubject: ${email.subject}\n\n${email.body}`
            );
            setShowModal(true);
          }}
          className="w-[600px] h-[42px] bg-gray-200 rounded-full font-bold shadow-md flex items-center justify-center gap-2"
        >
          <Forward size={16} />
          <span>Forward</span>
        </button>

      </div>

  
      {loading && (
        <div className="mt-3 space-y-2">
          <div className="h-3 w-3/4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse"></div>
        </div>
      )}

  
      {replies.map((r, i) => (
        <div
          key={i}
          onClick={() => {
            setSelectedReply(r.text);
            setTo(email.sender);
            setSubject(`Re: ${email.subject}`);
            setMode("reply");
            setShowModal(true);
          }}
          className="mt-3 p-3 shadow-md rounded cursor-pointer bg-gray-50"
        >
          <p className="font-semibold">{r.type}</p>
          <p>{r.text}</p>
        </div>
      ))}

  
      {showModal &&
        createPortal(
          <div className="fixed inset-0 z-[9999] bg-black/10 backdrop-blur-sm flex items-center justify-center">

            <div
              style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
              className="w-[520px] bg-white rounded-3xl shadow-xl border border-gray-200 p-2"
            >

  
              <div
                onMouseDown={handleMouseDown}
                className="flex justify-between items-center px-4 py-3 cursor-move rounded-3xl"
              >
                <div>
                  <h2 className="text-sm font-semibold">
                    {mode === "forward" ? "Forward Email" : "New Message"}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {mode === "forward" ? "Forwarding:" : "Re:"} {email.subject}
                  </p>
                </div>

                <button onClick={() => setShowModal(false)}>✕</button>
              </div>

  
              <div className="px-4 py-2 border-b border-gray-200 space-y-2">

  
                <div className="flex gap-2 items-center">
                  <input
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="To"
                    className="w-full text-sm outline-none bg-gray-100 rounded-md px-3 py-2"
                  />

                  <button
                    onClick={() => setShowCC(!showCC)}
                    className="text-xs text-blue-500"
                  >
                    Cc
                  </button>

                  <button
                    onClick={() => setShowBCC(!showBCC)}
                    className="text-xs text-blue-500"
                  >
                    Bcc
                  </button>
                </div>

  
                {showCC && (
                  <input
                    value={cc}
                    onChange={(e) => setCc(e.target.value)}
                    placeholder="Cc"
                    className="w-full text-sm bg-gray-100 rounded-md px-3 py-2"
                  />
                )}

  
                {showBCC && (
                  <input
                    value={bcc}
                    onChange={(e) => setBcc(e.target.value)}
                    placeholder="Bcc"
                    className="w-full text-sm bg-gray-100 rounded-md px-3 py-2"
                  />
                )}

              </div>

  
              <div className="px-4 py-2 border-b border-gray-200">
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject"
                  className="w-full text-sm outline-none"
                />
              </div>

  


  
              <div className="px-4 py-3">
                <div className="border border-gray-200 rounded-lg p-2 bg-gray-50">
                  <textarea
                    value={selectedReply}
                    onChange={(e) => setSelectedReply(e.target.value)}
                    placeholder="Write your message..."
                    className="w-full min-h-[140px] resize-none outline-none bg-transparent text-sm"
                  />
                </div>
              </div>

              <div className="px-4 py-3 border-t border-gray-200">


                <label className="cursor-pointer flex items-center gap-2 text-sm text-gray-600 hover:text-black">
                  <Paperclip size={16} />
                  <span>Add Attachment</span>

                  <input
                    type="file"
                    multiple
                    hidden
                    onChange={handleFileUpload}
                  />
                </label>


                {attachments.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">

                    {attachments.map((file, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full text-xs shadow-sm"
                      >

                        <span><Paperclip size={12} /></span>


                        <span className="max-w-[120px] truncate">
                          {file.name}
                        </span>


                        <button
                          onClick={() =>
                            setAttachments((prev) =>
                              prev.filter((_, idx) => idx !== i)
                            )
                          }
                          className="text-gray-400 hover:text-red-500"
                        >
                          ✕
                        </button>
                      </div>
                    ))}

                  </div>
                )}
              </div>


              <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200">

                <div className="px-4 pt-3">
                  <select
                    onChange={(e) => {
                      const template = templates.find(
                        (t) => String(t._id) === e.target.value
                      );

                      if (template) {
                        setSelectedReply(
                          `${template.greeting || ""}\n\n${template.tone || ""}\n\n${template.closing || ""}\n${template.signature || ""}`
                        );
                      }
                    }}
                    className="w-full text-sm border border-gray-200 rounded-2xl px-3 py-2 mb-2 bg-white"
                  >
                    <option value="">Select Template</option>
                    {templates.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 items-center">
                  <button onClick={() => setShowEmoji(!showEmoji)}><Smile size={16} /></button>

                  {showEmoji && (
                    <div className="absolute bottom-20 right-10 z-50">
                      <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </div>
                  )}
                  <button onClick={() => setShowModal(false)}>
                    Cancel
                  </button>

                  <button
                    onClick={sendReply}
                    className="h-[42px] bg-blue-600 text-white px-4 rounded-full text-sm hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    <Send size={16} />
                    <span>Send</span>
                  </button>
                </div>

              </div>

            </div>

          </div>,
          document.body
        )
      }
    </div>
  );
})

export default ReplyAssistant;