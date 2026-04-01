import { useEffect, useState } from "react";
import API from "../services/api";
import { Trash2, ArrowLeft } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function Templates() {
  const [templates, setTemplates] = useState([]);
  const [selected, setSelected] = useState(null);

  
  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await API.get("/api/template");
      setTemplates(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  
  const handleNew = () => {
    setSelected({
      _id: null,
      name: "My Template",
      greeting: "Hi [Name],",
      tone: "",
      closing: "Best regards,",
      signature: "[Your Name]",
    });
  };

  
  const handleSave = async () => {
    try {
      if (selected._id) {
        await API.put(`/template/${selected._id}`, selected);
      } else {
        await API.post("/template", selected);
      }
      alert("Saved!");
      fetchTemplates();
    } catch (err) {
      console.error(err);
    }
  };

  
  const handleDelete = async () => {
    if (!selected?._id) return;

    if (!confirm("Delete this template?")) return;

    try {
      await API.delete(`/template/${selected._id}`);
      setSelected(null);
      fetchTemplates();
      alert("Deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  
  const generatePreview = () => {
    if (!selected) return "";

    const name = "John";

    return `
      <p>${(selected.greeting || "").replace("[Name]", name)}</p>

      <p style="margin-top:10px;">
        ${selected.tone || "Your message will appear here..."}
      </p>

      <p style="margin-top:10px;">
        ${selected.closing || ""}
      </p>

      <p>${selected.signature || ""}</p>
    `;
  };

  return (
    <div className="flex flex-1 min-h-0">

      
      <div className="flex md:hidden flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {!selected ? (
            <motion.div
              key="template-list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col w-full h-full bg-gray-50 p-4 absolute inset-0 overflow-y-auto"
            >

              <h2 className="text-lg font-semibold mb-4 shrink-0">Templates</h2>

              <div className="flex-1 space-y-2">
                {templates.map((t) => (
                  <div
                    key={t._id}
                    onClick={() => setSelected(t)}
                    className="p-3 rounded-lg border cursor-pointer hover:bg-gray-100 bg-white shadow-sm"
                  >
                    <p className="font-medium">{t.name}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {t.tone || "Custom template"}
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={handleNew}
                className="mt-4 bg-blue-600 text-white py-2 rounded-lg shrink-0 font-medium"
              >
                + New Template
              </button>

            </motion.div>
          ) : (
            <motion.div
              key="template-detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col flex-1 h-full bg-white absolute inset-0"
            >


              <div className="flex justify-between p-3 border-b sticky top-0 z-20 bg-white items-center gap-3 shadow-sm shrink-0">
                <button
                  onClick={() => setSelected(null)}
                  className="flex items-center gap-1 text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
                >
                  <ArrowLeft size={16} />
                  Back
                </button>
                <span className="text-sm font-medium truncate">
                  Edit Template
                </span>
              </div>


              <div className="flex-1 overflow-y-auto p-4 space-y-4">

                <input
                  className="w-full p-2 text-lg font-semibold rounded shadow border border-gray-100 placeholder-gray-400 focus:outline-blue-500"
                  value={selected.name}
                  placeholder="Template Name"
                  onChange={(e) =>
                    setSelected({ ...selected, name: e.target.value })
                  }
                />

                <input
                  className="w-full p-2 rounded shadow border border-gray-100 placeholder-gray-400 focus:outline-blue-500"
                  value={selected.greeting}
                  placeholder="Greeting (e.g. Hi [Name],)"
                  onChange={(e) =>
                    setSelected({ ...selected, greeting: e.target.value })
                  }
                />

                <textarea
                  className="w-full p-3 rounded h-24 shadow border border-gray-100 placeholder-gray-400 focus:outline-blue-500 resize-none"
                  value={selected.tone}
                  placeholder="Body content..."
                  onChange={(e) =>
                    setSelected({ ...selected, tone: e.target.value })
                  }
                />

                <input
                  className="w-full p-2 rounded shadow border border-gray-100 placeholder-gray-400 focus:outline-blue-500"
                  value={selected.closing}
                  placeholder="Closing (e.g. Best,)"
                  onChange={(e) =>
                    setSelected({ ...selected, closing: e.target.value })
                  }
                />

                <input
                  className="w-full p-2 rounded shadow border border-gray-100 placeholder-gray-400 focus:outline-blue-500"
                  value={selected.signature}
                  placeholder="Signature (e.g. Mark)"
                  onChange={(e) =>
                    setSelected({ ...selected, signature: e.target.value })
                  }
                />

                <div className="flex justify-between items-center pt-2">
                  <button onClick={handleDelete} className="text-red-500 bg-red-50 p-2 rounded-lg hover:bg-red-100">
                    <Trash2 size={18} />
                  </button>

                  <button
                    onClick={handleSave}
                    className="bg-blue-600 font-medium text-white px-6 py-2 rounded-lg hover:bg-blue-700 shadow-md"
                  >
                    Save
                  </button>
                </div>


                <div className="pt-4 border-t mt-6">
                  <h3 className="font-semibold text-gray-700 mb-3">📧 Preview</h3>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: generatePreview(),
                      }}
                    />
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      
      <div className="hidden md:flex w-full">

        
        <div className="w-[380px] bg-gray-50 p-4 flex flex-col shadow-lg">

          <h2 className="text-lg font-semibold mb-4">Your Templates</h2>

          <div className="space-y-2 flex-1 overflow-y-auto">
            {templates.map((t) => (
              <div
                key={t._id}
                onClick={() => setSelected(t)}
                className={`p-3 rounded-lg border cursor-pointer transition ${
                  selected?._id === t._id
                    ? "bg-blue-100 border-blue-300"
                    : "hover:bg-gray-100"
                }`}
              >
                <p className="font-medium">{t.name}</p>
                <p className="text-xs text-gray-500 truncate">
                  {t.tone || "Custom template"}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={handleNew}
            className="mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            + New Template
          </button>

        </div>

        
        <div className="flex-1 p-6 overflow-y-auto shadow-lg flex gap-6 ">

          {!selected ? (
            <p className="text-gray-500">Select a template</p>
          ) : (
            <>
        
              <div className="w-1/2 border border-gray-200 p-6 rounded-lg">
                <div className="max-w-xl ">

                  <div className="flex justify-between items-center mb-4 ">
                    <h2 className="text-xl font-semibold">
                      Edit Template
                    </h2>

                    <button
                      onClick={handleDelete}
                      className="p-2 rounded hover:bg-red-100 text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <input
                    className="w-full p-2 mb-4 text-lg font-semibold rounded shadow"
                    value={selected.name}
                    onChange={(e) =>
                      setSelected({ ...selected, name: e.target.value })
                    }
                  />

                  <label className="text-sm text-gray-500">Greeting</label>
                  <input
                    className="w-full p-2 mb-4 rounded shadow"
                    value={selected.greeting}
                    onChange={(e) =>
                      setSelected({ ...selected, greeting: e.target.value })
                    }
                  />

                  <label className="text-sm text-gray-500">Tone & Style</label>
                  <textarea
                    className="w-full p-3 mb-4 rounded h-24 shadow"
                    value={selected.tone}
                    onChange={(e) =>
                      setSelected({ ...selected, tone: e.target.value })
                    }
                  />

                  <label className="text-sm text-gray-500">Closing</label>
                  <input
                    className="w-full p-2 mb-4 rounded shadow"
                    value={selected.closing}
                    onChange={(e) =>
                      setSelected({ ...selected, closing: e.target.value })
                    }
                  />

                  <label className="text-sm text-gray-500">Signature</label>
                  <input
                    className="w-full p-2 mb-6 rounded shadow"
                    value={selected.signature}
                    onChange={(e) =>
                      setSelected({ ...selected, signature: e.target.value })
                    }
                  />

                  <div className="flex justify-end">
                    <button
                      onClick={handleSave}
                      className="bg-blue-600 text-white px-5 py-2 rounded-lg"
                    >
                      Save Changes
                    </button>
                  </div>

                </div>
              </div>

        
              <div className="w-1/2 rounded-xl p-4 bg-gray-50 shadow-lg">

                <h3 className="text-lg font-semibold mb-4">
                  📧 Live Preview
                </h3>

                <div className="bg-white border rounded-lg p-5 shadow-md">

                  <div className="mb-4 border-b pb-2">
                    <p className="text-sm text-gray-500">
                      To: john@example.com
                    </p>
                    <p className="text-sm text-gray-500">
                      Subject: Sample Email
                    </p>
                  </div>

                  <div
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: generatePreview(),
                    }}
                  />

                </div>
              </div>
            </>
          )}

        </div>

      </div>

    </div>
  );
}