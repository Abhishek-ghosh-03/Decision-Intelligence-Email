import React from 'react';
import { motion } from 'framer-motion';
import { 
    CheckCircle, 
    ListTodo, 
    ShieldAlert, 
    FolderKanban, 
    ListOrdered, 
    Clock 
} from 'lucide-react';

export default function FloatingIconsAnimation({ className = "h-[500px]" }) {
    const floatingVariant = (duration) => ({
        animate: {
            y: [0, -20, 0],
            transition: {
                duration: duration,
                repeat: Infinity,
                ease: "easeInOut",
            }
        }
    });

    const icons = [
        { Icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/20", label: "Decisions" },
        { Icon: ListTodo, color: "text-blue-400", bg: "bg-blue-500/20", label: "Tasks" },
        { Icon: ShieldAlert, color: "text-rose-400", bg: "bg-rose-500/20", label: "Risks" },
        { Icon: FolderKanban, color: "text-amber-400", bg: "bg-amber-500/20", label: "Groups" },
        { Icon: ListOrdered, color: "text-purple-400", bg: "bg-purple-500/20", label: "Priority List" },
        { Icon: Clock, color: "text-cyan-400", bg: "bg-cyan-500/20", label: "Follow-ups" },
    ];

    return (
        <section className={`relative w-full max-w-5xl mx-auto flex items-center justify-center overflow-hidden z-10 py-10 ${className}`}>
            {/* Central DI Icon & Glowing Rings */}
            <motion.div 
                variants={floatingVariant(4)}
                animate="animate"
                className="relative flex items-center justify-center z-10"
            >
                {/* Clockwise Ring */}
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute w-64 h-64 border border-cyan-500/20 rounded-full z-0 flex items-center justify-center"
                >
                    <div className="absolute top-0 w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_15px_#22d3ee]"></div>
                </motion.div>

                {/* Counter-Clockwise Ring */}
                <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute w-80 h-80 border border-indigo-500/20 border-dashed rounded-full z-0 flex items-center justify-center"
                >
                    <div className="absolute bottom-0 w-2 h-2 bg-indigo-400 rounded-full shadow-[0_0_10px_#818cf8]"></div>
                    <div className="absolute right-0 w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_10px_#60a5fa]"></div>
                </motion.div>

                {/* Central Logo */}
                <div className="relative z-10 w-28 h-28 bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-[0_0_60px_rgba(6,182,212,0.4)]">
                    <div className="absolute inset-0 bg-white/20 rounded-3xl blur-md"></div>
                    <span className="relative text-white font-black text-4xl tracking-wider drop-shadow-md">DI</span>
                </div>
            </motion.div>

            {/* Orbiting / Floating Orbit Icons */}
            {icons.map((item, index) => {
                const angle = (index / icons.length) * Math.PI * 2;
                const radiusX = 180; // horizontal spread
                const radiusY = 120;  // vertical spread
                const x = Math.cos(angle) * radiusX;
                const y = Math.sin(angle) * radiusY;

                return (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1, x, y }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 60, damping: 20, delay: index * 0.15 }}
                        className="absolute flex items-center justify-center"
                    >
                        <motion.div
                            animate={{ 
                                y: [0, index % 2 === 0 ? -50 : 50, 0], 
                                x: [0, index % 2 === 0 ? 45 : -45, 0],
                                rotate: [0, index % 2 === 0 ? 15 : -15, 0]
                            }}
                            transition={{ duration: 4 + (index % 3), repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
                            className="flex flex-col items-center gap-3 group translate-y-[-50%] translate-x-[-50%]"
                        >
                            <div className={`p-4 rounded-full ${item.bg} backdrop-blur-md transform transition-transform group-hover:scale-110 flex items-center justify-center shadow-[0_0_30px_-5px_currentColor]`}>
                                <item.Icon className={`w-8 h-8 ${item.color} filter drop-shadow-[0_0_8px_currentColor]`} />
                            </div>
                            <span className="text-xs font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 border border-slate-200 px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap">
                                {item.label}
                            </span>
                        </motion.div>
                    </motion.div>
                );
            })}
            
            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
        </section>
    );
}
