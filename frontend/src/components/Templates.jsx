import { useEffect, useState } from "react";
import API from "../services/api";
import { Trash2 } from "lucide-react";

export default function Templates() {
  const [templates, setTemplates] = useState([]);
  const [selected, setSelected] = useState(null);

  // 🔥 FETCH TEMPLATES
  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await API.get("/template");
      setTemplates(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 NEW TEMPLATE
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

  // 🔥 SAVE TEMPLATE
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

  // 🔥 DELETE TEMPLATE
  const handleDelete = async () => {
    if (!selected?._id) return;

    const confirmDelete = confirm("Delete this template?");
    if (!confirmDelete) return;

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

  // 🔥 LIVE PREVIEW GENERATOR
  const generatePreview = () => {
    if (!selected) return "";

    const name = "John"; // sample name

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
    <div className="flex h-full">

      {/* LEFT PANEL */}
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

      {/* RIGHT PANEL */}
      <div className="flex-1 p-6 overflow-y-auto shadow-lg flex gap-6 ">

        {!selected ? (
          <p className="text-gray-500">Select a template</p>
        ) : (
          <>
            {/* EDITOR */}
            <div className="w-1/2 border border-gray-200 p-6 rounded-lg">
              <div className="max-w-xl ">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-4 ">
                  <h2 className="text-xl font-semibold">
                    Edit Template
                  </h2>

                  <button
                    onClick={handleDelete}
                    className="p-2 rounded hover:bg-red-100 text-red-500"
                    title="Delete Template"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* NAME */}
                <input
                  className="w-full p-2 mb-4 text-lg font-semibold rounded shadow"
                  value={selected.name}
                  onChange={(e) =>
                    setSelected({ ...selected, name: e.target.value })
                  }
                />

                {/* GREETING */}
                <label className="text-sm text-gray-500">Greeting</label>
                <input
                  className="w-full p-2 mb-4 rounded shadow"
                  value={selected.greeting}
                  onChange={(e) =>
                    setSelected({ ...selected, greeting: e.target.value })
                  }
                />

                {/* TONE */}
                <label className="text-sm text-gray-500">Tone & Style</label>
                <textarea
                  className="w-full p-3 mb-4 rounded h-24 shadow"
                  value={selected.tone}
                  onChange={(e) =>
                    setSelected({ ...selected, tone: e.target.value })
                  }
                />

                {/* CLOSING */}
                <label className="text-sm text-gray-500">Closing</label>
                <input
                  className="w-full p-2 mb-4 rounded shadow"
                  value={selected.closing}
                  onChange={(e) =>
                    setSelected({ ...selected, closing: e.target.value })
                  }
                />

                {/* SIGNATURE */}
                <label className="text-sm text-gray-500">Signature</label>
                <input
                  className="w-full p-2 mb-6 rounded shadow"
                  value={selected.signature}
                  onChange={(e) =>
                    setSelected({ ...selected, signature: e.target.value })
                  }
                />

                {/* SAVE BUTTON */}
                <div className="flex justify-end">
                  <button
                    onClick={handleSave}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>

              </div>
            </div>

            {/* PREVIEW PANEL */}
            <div className="w-1/2 rounded-xl p-4 bg-gray-50 shadow-lg">

              <h3 className="text-lg font-semibold mb-4">
                📧 Live Preview
              </h3>

              <div className="bg-white border rounded-lg p-5 shadow-md">

                {/* HEADER */}
                <div className="mb-4 border-b pb-2">
                  <p className="text-sm text-gray-500">
                    To: john@example.com
                  </p>
                  <p className="text-sm text-gray-500">
                    Subject: Sample Email
                  </p>
                </div>

                {/* BODY */}
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
  );
}