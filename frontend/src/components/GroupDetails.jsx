import { motion } from "framer-motion";

export default function GroupDetails({ group, onEmailClick, setActive }) {
  if (!group) return <p className="p-4">Select a group</p>;

  return (
    <motion.div 
      key={group._id} 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="p-3 md:p-5 space-y-6"
    >
      <div>
        <h1 className="text-xl md:text-2xl font-bold">{group.title}</h1>
        <p className="text-sm text-gray-500">{group.domain}</p>
      </div>

      <div className="border rounded-xl p-3 bg-blue-50 text-sm text-blue-700 shadow-sm">
        Why grouped: Same domain + similar topic
      </div>

      <div className="rounded-xl p-4 bg-white shadow-md border border-gray-100">
        <p className="font-semibold mb-3 text-sm md:text-base">
          📊 Context Flow
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-xs">
          <Stat label="📧" value={group.emailCount} />
          <Stat label="👥" value={group.participants?.length || 0} />
          <Stat label="📌" value={group.taskCount} />
          <Stat label="⚠️" value={group.riskCount} />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="font-semibold text-sm md:text-base">
          🧠 Combined Insights
        </h2>

        <Insight color="green" text={`✅ ${group.decisionCount} Decisions`} />
        <Insight color="blue" text={`📌 ${group.taskCount} Tasks`} />
        <Insight color="red" text={`⚠️ ${group.riskCount} Risks`} />
      </div>

      <div>
        <h2 className="font-semibold mb-2 text-sm md:text-base">
          🧵 Email Timeline
        </h2>

        <div className="space-y-2">
          {group.emails.map((email, index) => (
            <motion.div
              key={email._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => {
                onEmailClick(email);
                setActive("Inbox");
              }}
              className="p-3 bg-white shadow-md rounded-lg border border-gray-100 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <p className="font-medium text-sm md:text-base text-gray-800">
                {email.subject}
              </p>
              <p className="text-xs md:text-sm text-gray-500 mt-1">
                {email.sender}
              </p>
              <p className="text-[10px] md:text-xs text-gray-400 mt-2 font-medium">
                {email.Date || "recent"}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}


function Stat({ label, value }) {
  return (
    <div className="bg-white rounded-lg p-2 shadow">
      {label} <br /> {value}
    </div>
  );
}

function Insight({ color, text }) {
  const map = {
    green: "bg-green-50 text-green-700",
    blue: "bg-blue-50 text-blue-700",
    red: "bg-red-50 text-red-700",
  };

  return (
    <div className={`p-3 rounded-lg text-sm ${map[color]}`}>
      {text}
    </div>
  );
}