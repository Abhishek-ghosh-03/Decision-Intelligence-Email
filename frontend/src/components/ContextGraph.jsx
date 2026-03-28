import React, { useEffect, useState } from "react";
import ReactFlow, {
    Background,
    Controls,
} from "reactflow";
import "reactflow/dist/style.css";
import API from "../services/api";
import { X } from "lucide-react";

export default function ContextGraph({ email, onClose }) {
    const [elements, setElements] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await API.get(`/email/insight/${email._id}`);
            const data = res.data;

            const nodes = [
                {
                    id: "email",
                    data: { label: "📧 Email" },
                    position: { x: 250, y: 0 },
                    style: { background: "#e0f2fe", padding: 10 },
                },

                {
                    id: "people",
                    data: { label: `👤 ${data.people?.[0]?.name || "N/A"}` },
                    position: { x: 50, y: 120 },
                },

                {
                    id: "tasks",
                    data: { label: `📌 ${data.tasks?.[0]?.text || "No task"}` },
                    position: { x: 250, y: 120 },
                },

                {
                    id: "deadline",
                    data: { label: `⏳ ${data.deadline || "No deadline"}` },
                    position: { x: 450, y: 120 },
                },

                {
                    id: "risk",
                    data: { label: `⚠️ ${data.risk?.text || "No risk"}` },
                    position: { x: 150, y: 260 },
                    style: { background: "#fee2e2" },
                },

                {
                    id: "urgency",
                    data: { label: `🔥 ${data.urgency || "Medium"}` },
                    position: { x: 350, y: 260 },
                    style: { background: "#fef3c7" },
                },

                {
                    id: "actions",
                    data: {
                        label:
                            "💡 " +
                            (data.suggestions?.[0] || "No suggestion"),
                    },
                    position: { x: 250, y: 400 },
                    style: { background: "#dcfce7" },
                },
            ];

            const edges = [
                { id: "e1", source: "email", target: "people" },
                { id: "e2", source: "email", target: "tasks" },
                { id: "e3", source: "email", target: "deadline" },

                { id: "e4", source: "people", target: "risk" },
                { id: "e5", source: "tasks", target: "risk" },
                { id: "e6", source: "deadline", target: "urgency" },

                { id: "e7", source: "risk", target: "actions" },
                { id: "e8", source: "urgency", target: "actions" },
            ];

            setElements([...nodes, ...edges]);
        };

        fetchData();
    }, [email]);

    return (
        <div className="fixed inset-0 bg-black/10 z-50 flex justify-end p-5">

            <div className="w-[500px] bg-white h-full shadow-xl p-4
    transform transition-transform duration-200 ease-out
    translate-x-0 animate-slide-in rounded">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-3">
                    <h2 className="font-semibold">✨ AI Intelligence</h2>
                    <button onClick={onClose}>
                        <X />
                    </button>
                </div>

                {/* GRAPH */}
                <div style={{ height: "90%" }}>
                    <ReactFlow nodes={elements.filter(e => e.position)} edges={elements.filter(e => !e.position)}>
                        <Background />
                        <Controls />
                    </ReactFlow>
                </div>
            </div>
        </div>
    );
}