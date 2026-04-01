import React, { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Zap, MessageSquare, BarChart3, Clock, Shield, ChevronDown } from "lucide-react";

export default function FeaturesSection() {
    const [openIndex, setOpenIndex] = useState(0);

    const features = [
        {
            title: "Smart Grouping",
            desc: "Automatically organize emails by sender, domain, and topic. Keep your inbox ruthlessly organized without ever lifting a finger.",
            icon: Zap,
            color: "text-amber-400",
            video: "/video/samplevideo.mp4",
            className: "md:col-span-2 lg:col-span-2 lg:row-span-2",
            layout: "large"
        },
        {
            title: "Decision Dashboard",
            desc: "Visualize all decisions and deadlines in one command center.",
            icon: BarChart3,
            color: "text-fuchsia-400",
            video: "/video/samplevideo.mp4",
            className: "md:col-span-1 lg:col-span-1",
            layout: "small"
        },
        {
            title: "Smart Reply",
            desc: "Get intelligent AI-powered response suggestions instantly.",
            icon: MessageSquare,
            color: "text-sky-400",
            video: "/video/samplevideo.mp4",
            className: "md:col-span-1 lg:col-span-1",
            layout: "small"
        },
        {
            title: "AI Insights",
            desc: "Extract decisions, tasks, and risks with advanced AI models scanning context.",
            icon: Brain,
            color: "text-emerald-400",
            video: "/video/samplevideo.mp4",
            className: "md:col-span-2 lg:col-span-2",
            layout: "wide"
        },
        {
            title: "Smart Scheduling",
            desc: "Never miss a follow-up with intelligent calendar events.",
            icon: Clock,
            color: "text-rose-400",
            video: "/video/samplevideo.mp4",
            className: "md:col-span-1 lg:col-span-1",
            layout: "small"
        },
        {
            title: "Risk Detection",
            desc: "Identify potential blockers and concerns automatically across all your active threads.",
            icon: Shield,
            color: "text-indigo-400",
            video: "/video/samplevideo.mp4",
            className: "md:col-span-2 lg:col-span-3",
            layout: "wide"
        },
    ];

    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1
            }
        }
    };

    return (
        <section id="features" className="py-24 px-6 relative z-10 border-t border-slate-200">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="text-center mb-16 relative"
                >
                    <motion.div variants={fadeUp} className="inline-block mb-4 px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full">
                        <h1 className="text-rose-400 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                            <Shield className="w-3 h-3" /> Early Access
                        </h1>
                    </motion.div>
                    <motion.h2 variants={fadeUp} className="text-slate-500 text-sm font-medium mb-4">__This is the testing phase so only the admin user can access the application.__</motion.h2>
                    <motion.h2 variants={fadeUp} className="text-4xl lg:text-5xl font-black text-slate-900 drop-shadow-sm">
                        Powerful <span className="text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text">Features</span>
                    </motion.h2>
                </motion.div>

                {/* Responsive Bento Grid Layout */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 relative"
                >
                    {/* Pulsing light behind the grid */}
                    <div className="absolute inset-0 bg-cyan-500/5 blur-[120px] rounded-[50%] pointer-events-none -z-10" />

                    {/* Elegant SVG Curved Connection Line */}
                    <div className="absolute inset-0 z-0 pointer-events-none hidden lg:block">
                        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full absolute inset-0" style={{ filter: 'drop-shadow(0 0 10px rgba(56,189,248,0.5))' }}>
                            <defs>
                                <linearGradient id="curveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
                                    <stop offset="25%" stopColor="#818cf8" stopOpacity="1" />
                                    <stop offset="75%" stopColor="#c084fc" stopOpacity="1" />
                                    <stop offset="100%" stopColor="#e879f9" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path 
                                d="M 33.3 25 Q 60 15, 83.3 12.5 Q 90 25, 83.3 37.5 Q 60 50, 33.3 62.5 Q 60 62.5, 83.3 62.5 C 75 80, 70 87.5, 50 87.5"
                                fill="none"
                                stroke="rgba(255,255,255,0.05)"
                                strokeWidth="2"
                                strokeDasharray="4 6"
                                vectorEffect="non-scaling-stroke"
                            />
                            <motion.path 
                                d="M 33.3 25 Q 60 15, 83.3 12.5 Q 90 25, 83.3 37.5 Q 60 50, 33.3 62.5 Q 60 62.5, 83.3 62.5 C 75 80, 70 87.5, 50 87.5"
                                fill="none"
                                stroke="url(#curveGrad)"
                                strokeWidth="3"
                                strokeLinecap="round"
                                vectorEffect="non-scaling-stroke"
                                initial={{ pathLength: 0, pathOffset: 0 }}
                                animate={{ pathLength: [0, 0.4, 0.4, 0], pathOffset: [0, 0, 1, 1] }}
                                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </svg>
                    </div>

                    {features.map((f, i) => {
                        const Icon = f.icon;
                        const isWide = f.layout === "wide" || f.layout === "epic";
                        const isLarge = f.layout === "large";

                        return (
                            <motion.div
                                key={i}
                                variants={fadeUp}
                                whileHover={{ y: -5, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                                className={`group flex relative bg-white backdrop-blur-xl border border-slate-200 rounded-2xl hover:bg-gray-50 hover:border-slate-300 transition-all duration-500 overflow-hidden z-10 shadow-sm hover:shadow-lg ${f.className || ""} ${
                                    isWide ? "flex-col md:flex-row" : "flex-col"
                                }`}
                            >
                                {/* Hover Glow Effect hiding in background */}
                                <div className={`absolute top-0 ${isWide ? 'left-0' : 'right-0'} w-48 h-48 blur-[60px] opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-full pointer-events-none z-0`} style={{ backgroundColor: 'currentColor', color: 'gray' }} />

                                {/* Video Highlight Container */}
                                <div className={`relative overflow-hidden shrink-0 bg-slate-50 z-10 ${
                                    isWide ? "w-full md:w-[40%] lg:w-[45%] min-h-[160px] border-b md:border-b-0 md:border-r border-slate-200" : 
                                    isLarge ? "w-full h-48 border-b border-slate-200" :
                                    "w-full h-32 md:h-36 border-b border-slate-200"
                                }`}>
                                    <video 
                                        src={`${f.video}?v=1`} 
                                        autoPlay 
                                        loop 
                                        muted 
                                        playsInline 
                                        crossOrigin="anonymous"
                                        type="video/mp4"
                                        className="w-full h-full object-cover opacity-50 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 pointer-events-none"
                                    />
                                    {/* Subtle Gradient Overlays */}
                                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white/80 to-transparent pointer-events-none" />
                                    {isWide && <div className="hidden md:block absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white/80 to-transparent pointer-events-none" />}
                                </div>

                                <div className={`relative z-20 flex-1 flex flex-col justify-center ${isLarge ? 'p-6' : 'p-5'}`}>
                                    <div className="flex items-center gap-3 mb-3 relative z-10">
                                        <div className={`relative p-2 rounded-xl bg-gray-50 border border-slate-200 group-hover:scale-110 transition-transform duration-500 shadow-sm overflow-hidden shrink-0`}>
                                            <div className={`absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500 blur-md`} style={{ backgroundColor: 'currentColor', color: 'gray' }}></div>
                                            <Icon className={`${f.color} w-5 h-5 relative z-10 filter drop-shadow-[0_0_8px_currentColor]`} />
                                        </div>
                                        <h3 className={`font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight ${isLarge ? 'text-2xl tracking-tight' : 'text-lg'}`}>
                                            {f.title}
                                        </h3>
                                    </div>

                                    <p className={`text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors relative z-10 ml-0 ${isLarge ? 'text-base font-medium' : 'text-sm'}`}>
                                        {f.desc}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}

