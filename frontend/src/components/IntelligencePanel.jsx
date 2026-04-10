import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../services/api";

export default function IntelligencePanel({ emailId }) {
  const [decisions, setDecisions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [risks, setRisks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    if (!emailId) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [dRes, tRes, rRes] = await Promise.all([
          API.get(`/api/email/decisions/${emailId}`),
          API.get(`/api/email/tasks/${emailId}`),
          API.get(`/api/email/risks/${emailId}`),
        ]);

        setDecisions(dRes.data || []);
        setTasks(tRes.data || []);
        setRisks(rRes.data || []);
      } catch (err) {
        console.error("Error fetching intelligence:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [emailId]);

  const getConfidence = (value, fallback) => {
    if (value === undefined || value === null) return fallback;
    return value <= 1 ? Math.round(value * 100) : Math.round(value);
  };

  return (
    <div className="bg-gray-50 p-4 md:p-6 rounded-xl border border-gray-200 shadow space-y-4 md:space-y-6">

      <h3 className="font-semibold text-lg flex items-center gap-2">
        <span className="animate-pulse">💡</span> AI Intelligence
      </h3>

      {isLoading ? (
        <div className="space-y-4">
          <div className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-24 bg-gray-200 rounded-lg animate-pulse delay-75"></div>
          <div className="h-24 bg-gray-200 rounded-lg animate-pulse delay-150"></div>
        </div>
      ) : (
        <>
          <div className="md:hidden space-y-3">

            <MobileSection
              title="✔ Decisions"
              color="green"
              data={decisions}
              field="text"
              active={activeSection === "decisions"}
              onToggle={() =>
                setActiveSection(activeSection === "decisions" ? null : "decisions")
              }
              getConfidence={getConfidence}
            />

            <MobileSection
              title="📌 Tasks"
              color="blue"
              data={tasks}
              field="title"
              active={activeSection === "tasks"}
              onToggle={() =>
                setActiveSection(activeSection === "tasks" ? null : "tasks")
              }
              getConfidence={getConfidence}
            />

            <MobileSection
              title="⚠ Risks"
              color="red"
              data={risks}
              field="text"
              active={activeSection === "risks"}
              onToggle={() =>
                setActiveSection(activeSection === "risks" ? null : "risks")
              }
              getConfidence={getConfidence}
            />

          </div>

          <motion.div 
            initial="hidden" animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
            className="hidden md:block space-y-6"
          >

            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
              <Section
                title="✔ Decisions"
                color="green"
                data={decisions}
                field="text"
                fallback={0}
                getConfidence={getConfidence}
              />
            </motion.div>

            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
              <Section
                title="📌 Tasks"
                color="blue"
                data={tasks}
                field="title"
                fallback={0}
                getConfidence={getConfidence}
              />
            </motion.div>

            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
              <Section
                title="⚠ Risks"
                color="red"
                data={risks}
                field="text"
                fallback={0}
                getConfidence={getConfidence}
              />
            </motion.div>

          </motion.div>
        </>
      )}

    </div>
  );
}


function MobileSection({ title, color, data, field, active, onToggle, getConfidence }) {
  const colorMap = {
    green: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-700",
    red: "bg-red-100 text-red-700",
  };

  return (
    <div className="rounded-lg overflow-hidden">


      <div
        onClick={onToggle}
        className={`p-3 flex justify-between items-center cursor-pointer ${colorMap[color]}`}
      >
        <span className="font-medium">{title}</span>
        <span>{active ? "−" : "+"}</span>
      </div>


      {active && (
        <div className="p-3 space-y-3 bg-white">

          {data.length === 0 ? (
            <p className="text-sm text-gray-500">No data found</p>
          ) : (
            data.map((item) => {
              const confidence = getConfidence(item.confidence, 0);

              return (
                <div key={item._id}>
                  <p className="text-sm mb-1">{item[field]}</p>

                  <div className="w-full bg-gray-200 h-2 rounded">
                    <div
                      className="bg-black h-2 rounded"
                      style={{ width: `${confidence}%` }}
                    />
                  </div>

                  <p className="text-xs text-right text-gray-500 mt-1">
                    {confidence}% confidence
                  </p>
                </div>
              );
            })
          )}

        </div>
      )}
    </div>
  );
}


function Section({ title, color, data, field, fallback, getConfidence }) {
  const colorMap = {
    green: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
      barBg: "bg-green-200",
      bar: "bg-green-500",
    },
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
      barBg: "bg-blue-200",
      bar: "bg-blue-500",
    },
    red: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      barBg: "bg-red-200",
      bar: "bg-red-500",
    },
  };

  const c = colorMap[color];

  return (
    <div className={`${c.bg} ${c.border} border p-4 rounded-lg`}>
      <h4 className={`${c.text} font-semibold mb-3`}>
        {title}
      </h4>

      {data.length === 0 ? (
        <p className="text-sm text-gray-500">No data found</p>
      ) : (
        data.map((item) => {
          const confidence = getConfidence(item.confidence, fallback);

          return (
            <div key={item._id} className="mb-4">
              <p className="mb-1">{item[field]}</p>

              <div className={`w-full ${c.barBg} h-2 rounded`}>
                <div
                  className={`${c.bar} h-2 rounded transition-all`}
                  style={{ width: `${confidence}%` }}
                />
              </div>

              <p className="text-xs text-right text-gray-500 mt-1">
                {confidence}% confidence
              </p>
            </div>
          );
        })
      )}
    </div>
  );
}