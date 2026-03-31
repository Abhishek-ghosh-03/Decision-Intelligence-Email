import { useEffect, useState } from "react";
import API from "../services/api";
import { Trash2 } from "lucide-react";

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

      
      <div className="flex md:hidden flex-1">

        {!selected ? (
          <div className="flex flex-col w-full bg-gray-50 p-4">

            <h2 className="text-lg font-semibold mb-4">Templates</h2>

            <div className="flex-1 overflow-y-auto space-y-2">
              {templates.map((t) => (
                <div
                  key={t._id}
                  onClick={() => setSelected(t)}
                  className="p-3 rounded-lg border cursor-pointer hover:bg-gray-100"
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
              className="mt-4 bg-blue-600 text-white py-2 rounded-lg"
            >
              + New Template
            </button>

          </div>
        ) : (
          <div className="flex flex-col flex-1 bg-white overflow-hidden">

            
            <div className="p-3 border-b sticky top-0 bg-white z-10">
              <button
                onClick={() => setSelected(null)}
                className="text-blue-600 text-sm"
              >
                Back
              </button>
            </div>

            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">

              <input
                className="w-full p-2 text-lg font-semibold rounded shadow"
                value={selected.name}
                onChange={(e) =>
                  setSelected({ ...selected, name: e.target.value })
                }
              />

              <input
                className="w-full p-2 rounded shadow"
                value={selected.greeting}
                onChange={(e) =>
                  setSelected({ ...selected, greeting: e.target.value })
                }
              />

              <textarea
                className="w-full p-3 rounded h-24 shadow"
                value={selected.tone}
                onChange={(e) =>
                  setSelected({ ...selected, tone: e.target.value })
                }
              />

              <input
                className="w-full p-2 rounded shadow"
                value={selected.closing}
                onChange={(e) =>
                  setSelected({ ...selected, closing: e.target.value })
                }
              />

              <input
                className="w-full p-2 rounded shadow"
                value={selected.signature}
                onChange={(e) =>
                  setSelected({ ...selected, signature: e.target.value })
                }
              />

              <div className="flex justify-between">
                <button onClick={handleDelete} className="text-red-500">
                  <Trash2 size={18} />
                </button>

                <button
                  onClick={handleSave}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Save
                </button>
              </div>

              
              <div>
                <h3 className="font-semibold mb-2">📧 Preview</h3>

                <div className="bg-gray-50 border rounded-lg p-4">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: generatePreview(),
                    }}
                  />
                </div>
              </div>

            </div>
          </div>
        )}

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