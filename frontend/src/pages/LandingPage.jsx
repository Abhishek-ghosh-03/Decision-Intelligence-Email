import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
    Sparkles,
    ArrowRight,
    CheckCircle,
    Brain,
    Zap,
    MessageSquare,
    BarChart3,
    Clock,
    Shield,
    Flame,
    ChevronDown,
    Plus,
    Minus,
} from "lucide-react";
import FloatingIconsAnimation from "../components/FloatingIconsAnimation";
import FeaturesSection from "../components/FeaturesSection";

export default function LandingPage() {
    const navigate = useNavigate();
    const [faqOpenIndex, setFaqOpenIndex] = useState(null);
    const [activeSlide, setActiveSlide] = useState(0);

    const faqs = [
        { question: "How does Decision Intel extract decisions?", answer: "We use advanced AI models to scan your emails contextually, identifying language patterns that typically represent decisions." },
        { question: "Is my data secure?", answer: "Absolutely. We employ bank-level encryption and strictly do not train public AI models on your private communications." },
        { question: "Can I try it with my team?", answer: "Yes! Decision Intel is designed for collaboration. You can create groups and assign follow-ups seamlessly." },
        { question: "Does it integrate with Gmail / Outlook?", answer: "Currently, we fully support Gmail and Google Workspace, with Outlook integration coming very soon." },
    ];

    // Scroll-based parallax for hero section
    const { scrollY } = useScroll();
    const heroY = useTransform(scrollY, [0, 500], [0, 150]);
    const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

    const handleGetStarted = async () => {
        try {
            const res = await API.get("/start");
            if (res.data.success) {
                navigate("/dashboard");
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Animation Variants (Superhuman-esque)
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
        <div className="bg-slate-950 text-slate-200 min-h-screen font-sans overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
            {/* Background Orbs */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="fixed top-[-100px] left-[-100px] w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
                className="fixed bottom-[-100px] right-[-100px] w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none"
            />

            {/* Header */}
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
                className="fixed top-0 left-0 w-full z-50 bg-slate-950/60 backdrop-blur-xl border-b border-white/5"
            >
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <a href="/" className="flex items-center gap-4 group">
                        <div className="relative w-12 h-12 flex items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl blur-lg opacity-50 group-hover:opacity-100 transition duration-500"></div>
                            <div className="relative w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-xl flex items-center justify-center shadow-xl z-10 transition-transform group-hover:scale-[1.05]">
                                <span className="text-white font-black tracking-wider text-sm bg-gradient-to-br from-cyan-400 to-blue-500 bg-clip-text text-transparent">DI</span>
                            </div>
                        </div>
                        <div>
                            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent drop-shadow-sm">
                                Decision Intel
                            </span>
                            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mt-0.5">
                                AI Email Intelligence
                            </p>
                        </div>
                    </a>

                    <div className="hidden md:flex items-center gap-10">
                        {["Features", "How it works", "Pricing"].map((item, i) => (
                            <a
                                key={i}
                                href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
                                className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-300 relative group"
                            >
                                {item}
                                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300 rounded-full"></span>
                            </a>
                        ))}
                    </div>
                </div>
            </motion.header>

            {/* Hero Section */}
            <section className="relative min-h-[100svh] pt-32 pb-20 px-6 flex items-center overflow-hidden">
                {/* Mobile Only Background Icons Animation */}
                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none lg:hidden flex items-center justify-center scale-[0.85] blur-[2px] mt-10">
                    <FloatingIconsAnimation />
                </div>

                <motion.div
                    style={{ y: heroY, opacity: heroOpacity }}
                    className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center z-10"
                >
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="space-y-10 relative"
                    >
                        {/* Decorative glow behind text */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/10 blur-[100px] rounded-full -z-10" />

                        <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/50 backdrop-blur-md border border-cyan-500/30 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                            <span className="text-xs font-bold tracking-wide text-cyan-400 uppercase">
                                Next-Gen Email Intelligence
                            </span>
                        </motion.div>

                        <motion.h1 variants={fadeUp} className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight text-white drop-shadow-sm">
                            Never Lose
                            <span className="block mt-2 text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text filter drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                                a Decision
                            </span>
                            Again.
                        </motion.h1>

                        <motion.p variants={fadeUp} className="text-lg lg:text-xl text-slate-400 max-w-lg leading-relaxed font-light">
                            Intelligently organize, analyze, and act on your emails.
                            Extract key decisions, tasks, and risks automatically with advanced AI.
                        </motion.p>

                        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-5">
                            <button
                                onClick={handleGetStarted}
                                className="group relative px-8 py-4 bg-transparent rounded-xl font-bold flex items-center justify-center gap-3 overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-95"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 transition-opacity duration-300"></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <span className="relative text-white z-10 flex items-center gap-2">
                                    Get Started
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>

                            <button className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white rounded-xl font-semibold backdrop-blur-sm transition-all duration-300 flex items-center justify-center focus:ring-2 focus:ring-white/20">
                                View Demo
                            </button>
                        </motion.div>

                        <motion.div variants={fadeUp} className="flex items-center gap-4 pt-4 border-t border-white/5">
                            <div className="flex -space-x-3">
                                {[
                                    "https://i.pravatar.cc/100?img=11",
                                    "https://i.pravatar.cc/100?img=12",
                                    "https://i.pravatar.cc/100?img=13",
                                    "https://i.pravatar.cc/100?img=14"
                                ].map((src, i) => (
                                    <img key={i} src={src} alt="User" className="w-10 h-10 rounded-full border-2 border-slate-900 shadow-sm" />
                                ))}
                            </div>
                            <div className="text-sm font-medium">
                                <span className="text-white block">Trusted by 2,000+</span>
                                <span className="text-slate-500">professionals worldwide</span>
                            </div>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotateX: 10, rotateY: -10 }}
                        animate={{ opacity: 1, scale: 1, rotateX: 0, rotateY: 0 }}
                        transition={{ type: "spring", stiffness: 60, damping: 20, delay: 0.3 }}
                        className="relative hidden lg:block h-[600px] w-full perspective-1000"
                    >
                        {/* 3D Floating Elements Container */}
                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-0 preserve-3d transition-transform duration-700 ease-out hover:rotate-y-[-5deg] hover:rotate-x-[2deg]"
                        >
                            {/* Main Display Mockup */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-slate-900 border border-slate-700/50 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
                                <div className="w-full h-8 bg-slate-800 border-b border-slate-700 flex items-center px-4 gap-2">
                                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                </div>
                                <div className="p-6 h-[calc(100%-2rem)] flex flex-col gap-4">
                                    <div className="w-full h-10 bg-slate-800 rounded-lg animate-pulse"></div>
                                    <div className="flex-1 w-full bg-slate-800/50 rounded-lg border border-slate-700/50 p-5">
                                        <div className="w-3/4 h-5 bg-slate-700 rounded mb-5"></div>
                                        <div className="w-1/2 h-5 bg-slate-700 rounded mb-5"></div>
                                        <div className="flex gap-3">
                                            <div className="w-24 h-8 bg-cyan-500/20 rounded-full"></div>
                                            <div className="w-28 h-8 bg-purple-500/20 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Stats Card 1 */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute top-10 left-0 w-64 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <span className="text-sm font-semibold text-slate-300">Decisions Tracked</span>
                                </div>
                                <h2 className="text-3xl font-black text-white">8,472</h2>
                                <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">+12% this week</p>
                            </motion.div>

                            {/* Floating Stats Card 2 */}
                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                className="absolute bottom-10 right-0 w-72 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-purple-500/20 rounded-lg">
                                        <Brain className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <span className="text-sm font-semibold text-slate-300">AI Insights Synthesized</span>
                                </div>
                                <div className="w-full bg-slate-800 rounded-full h-2 mt-4">
                                    <div className="bg-gradient-to-r from-purple-500 to-cyan-500 w-[99%] h-full rounded-full relative">
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_10px_#fff]"></div>
                                    </div>
                                </div>
                                <div className="flex justify-between mt-2 text-xs font-bold text-slate-400">
                                    <span>Processing Speed</span>
                                    <span className="text-cyan-400">99.9%</span>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </section>

            {/* Video Section */}
            <section className="py-24 px-6 relative z-10 bg-slate-900/30">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="max-w-6xl mx-auto text-center"
                >
                    <motion.h2 variants={fadeUp} className="text-3xl lg:text-5xl font-black text-white mb-4">
                        See It In <span className="text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text">Action</span>
                    </motion.h2>
                    <motion.p variants={fadeUp} className="text-slate-400 mb-12 max-w-2xl mx-auto">Experience how Decision Intel transforms your chaotic inbox into a structured command center.</motion.p>

                    <div className="relative z-20 w-full max-w-5xl mx-auto flex justify-center">
                        <motion.div variants={fadeUp} className="relative rounded-3xl p-1 bg-gradient-to-b from-slate-700/50 to-slate-900/50 transform transition hover:scale-[1.01] duration-500 z-20 w-fit">
                            <div className="absolute inset-0 bg-white/15 blur-[80px] scale-95 -z-10 rounded-3xl"></div>

                            {/* Floating Application Screenshots */}
                            <motion.img
                                src="/ss.png"
                                alt="App Screenshot Left"
                                animate={{ y: [0, -20, 0], x: [0, 10, 0], rotate: [-6, -2, -6] }}
                                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -left-20 sm:-left-40 top-16 w-48 sm:w-80 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.7)] border border-white/10 hidden lg:block opacity-90 hover:opacity-100 transition-opacity z-[-1]"
                            />

                            <motion.img
                                src="/ss.png"
                                alt="App Screenshot Right"
                                animate={{ y: [0, 25, 0], x: [0, -15, 0], rotate: [6, 2, 6] }}
                                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute -right-20 sm:-right-40 bottom-16 w-48 sm:w-80 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.7)] border border-white/10 hidden lg:block opacity-90 hover:opacity-100 transition-opacity z-30"
                            />

                            <video
                                className="relative z-10 w-full max-w-3xl rounded-[20px] shadow-2xl bg-black border border-white/5"
                                controls
                                autoPlay
                                muted
                                loop
                            >
                                <source src="/video/samplevideo.mp4" type="video/mp4" />
                            </video>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            <FeaturesSection />

            {/* Interface Showcase Section */}
            <section className="py-24 relative z-10 bg-slate-900/30 border-t border-white/5 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="text-center mb-16"
                    >
                        <motion.div variants={fadeUp} className="inline-block mb-4 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
                            <h1 className="text-cyan-400 text-xs font-bold uppercase tracking-widest">
                                Seamless Experience
                            </h1>
                        </motion.div>
                        <motion.h2 variants={fadeUp} className="text-4xl lg:text-5xl font-black text-white drop-shadow-sm mb-4">
                            Beautiful on <span className="text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text">Any Device</span>
                        </motion.h2>
                        <motion.p variants={fadeUp} className="text-slate-400 max-w-2xl mx-auto">
                            Swipe through our meticulously designed interfaces. Whether you are at your desk or on the go, Decision Intel keeps your workflow perfectly synced.
                        </motion.p>
                    </motion.div>
                </div>

                {/* Carousel Container */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative w-full h-[600px] md:h-[700px] flex flex-col items-center justify-center overflow-hidden pb-20"
                >
                    <div className="relative w-full max-w-7xl h-full flex items-center justify-center perspective-1000">
                        {/* The Slides */}
                        {[
                            { title: "Command Center", desc: "Your intelligent overview" },
                            { title: "Automated Insights", desc: "Decisions extracted instantly" },
                            { title: "Smart Action Items", desc: "Never miss a follow-up" }
                        ].map((page, idx) => {
                            const isActive = idx === activeSlide;
                            const isPrev = idx === (activeSlide - 1 + 3) % 3;
                            const isNext = idx === (activeSlide + 1) % 3;

                            // Default for hidden/other slides
                            let xOffset = 0;
                            let zIndex = 0;
                            let scale = 0.7;
                            let blur = "blur(12px)";
                            let opacity = 0;
                            let rotateY = 0;

                            if (isActive) {
                                xOffset = 0; zIndex = 30; scale = 1; blur = "blur(0px)"; opacity = 1; rotateY = 0;
                            } else if (isPrev) {
                                xOffset = -60; zIndex = 20; scale = 0.8; blur = "blur(6px)"; opacity = 0.5; rotateY = 10;
                            } else if (isNext) {
                                xOffset = 60; zIndex = 20; scale = 0.8; blur = "blur(6px)"; opacity = 0.5; rotateY = -10;
                            }

                            return (
                                <motion.div
                                    key={idx}
                                    animate={{
                                        x: `${xOffset}%`,
                                        scale,
                                        opacity,
                                        filter: blur,
                                        rotateY: rotateY,
                                        zIndex
                                    }}
                                    transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                                    className="absolute inset-y-0 my-auto h-fit w-[80vw] md:w-full max-w-4xl px-4 flex flex-col md:flex-row items-center justify-center gap-8 cursor-pointer group"
                                    onClick={() => setActiveSlide(idx)}
                                >
                                    {/* Desktop Mockup Area with integrated Text Overlay */}
                                    <div className="w-full md:w-[75%] relative pt-24 md:pt-28 pb-4 pointer-events-none">
                                        {/* Text Content Overlay */}
                                        <motion.div
                                            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 15 }}
                                            transition={{ duration: 0.4, delay: 0.1 }}
                                            className="absolute top-4 md:top-8 left-0 z-30 px-4 md:px-0"
                                        >
                                            <h3 className="text-xl sm:text-2xl md:text-4xl font-extrabold text-white shadow-black/50 drop-shadow-lg tracking-tight mb-2 md:mb-3">
                                                {page.title}
                                            </h3>
                                            <span className="text-[10px] sm:text-xs md:text-lg text-cyan-400 font-semibold drop-shadow-lg px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 backdrop-blur-md inline-block max-w-[95%] sm:max-w-[80%] md:max-w-none shadow-xl">
                                                {page.desc}
                                            </span>
                                        </motion.div>

                                        {/* Desktop Monitor Box */}
                                        <div className="relative pointer-events-none w-full">
                                            <motion.div animate={{ opacity: isActive ? 1 : 0.2 }} className="absolute inset-0 bg-cyan-500/10 blur-xl rounded-2xl transition duration-500" />
                                            <div className="relative rounded-xl md:rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-slate-900">
                                                <div className="h-6 md:h-8 bg-slate-800 border-b border-white/5 flex items-center px-3 md:px-4 gap-1.5 md:gap-2">
                                                    <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-rose-500/80"></div>
                                                    <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-amber-500/80"></div>
                                                    <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-emerald-500/80"></div>
                                                </div>
                                                <div className="relative aspect-video">
                                                    <img src="/ss.png" alt={`${page.title} Desktop`} className="w-full h-full object-cover opacity-90 object-top" />
                                                    <div className="absolute inset-0 border border-white/5 pointer-events-none"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mobile Mockup */}
                                    <div className={`w-24 md:w-56 shrink-0 relative -mt-16 md:-ml-24 md:mt-16 z-10 ml-auto mr-4 md:mr-0 pointer-events-none transition-transform duration-500 ${isActive ? 'translate-y-0' : 'translate-y-8'}`}>
                                        <motion.div animate={{ opacity: isActive ? 1 : 0.2 }} className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-[2rem] md:rounded-[2.5rem] transition duration-500" />
                                        <div className="relative rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border-[2px] md:border-[4px] border-slate-800 shadow-[0_20px_40px_rgba(0,0,0,0.6)] bg-slate-900 aspect-[9/19]">
                                            {/* Dynamic Island / Notch */}
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-3 md:h-5 bg-slate-800 rounded-b-xl md:rounded-b-2xl z-20"></div>
                                            <img src="/ss.png" alt={`${page.title} Mobile`} className="w-full h-full object-cover opacity-90 scale-[1.02] object-left-top" />
                                            {/* Reflection Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none"></div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Navigation Controls */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 z-40">
                        <button
                            onClick={() => setActiveSlide((prev) => (prev - 1 + 3) % 3)}
                            className="p-3 rounded-full bg-slate-800/80 hover:bg-slate-700/80 hover:scale-110 active:scale-95 backdrop-blur-md border border-white/10 text-white transition-all shadow-lg"
                        >
                            <ArrowRight className="w-5 h-5 rotate-180 text-cyan-400" />
                        </button>

                        <div className="flex gap-3">
                            {[0, 1, 2].map((dot) => (
                                <button
                                    key={dot}
                                    onClick={() => setActiveSlide(dot)}
                                    className={`h-2 rounded-full transition-all duration-300 ${activeSlide === dot ? 'w-8 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'w-2 bg-slate-600 hover:bg-slate-500'}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={() => setActiveSlide((prev) => (prev + 1) % 3)}
                            className="p-3 rounded-full bg-slate-800/80 hover:bg-slate-700/80 hover:scale-110 active:scale-95 backdrop-blur-md border border-white/10 text-white transition-all shadow-lg"
                        >
                            <ArrowRight className="w-5 h-5 text-cyan-400" />
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 px-6 relative z-10">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={staggerContainer}
                        className="text-center mb-16"
                    >
                        <motion.h2 variants={fadeUp} className="text-4xl lg:text-5xl font-black text-white drop-shadow-sm mb-4">
                            Frequently Asked <span className="text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text">Questions</span>
                        </motion.h2>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={staggerContainer}
                        className="space-y-4"
                    >
                        {faqs.map((faq, i) => {
                            const isOpen = faqOpenIndex === i;
                            return (
                                <motion.div
                                    key={i}
                                    variants={fadeUp}
                                    className={`border rounded-2xl transition-all duration-300 overflow-hidden ${isOpen ? "bg-slate-800/80 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)]" : "bg-slate-900/50 border-white/5"}`}
                                >
                                    <button
                                        onClick={() => setFaqOpenIndex(isOpen ? null : i)}
                                        className="w-full flex justify-between items-center p-6 focus:outline-none"
                                    >
                                        <span className="font-bold text-lg text-slate-200 text-left">{faq.question}</span>
                                        <div className={`p-2 rounded-full transition-colors ${isOpen ? "bg-cyan-500/20 text-cyan-400" : "bg-white/5 text-slate-400 group-hover:bg-white/10"}`}>
                                            {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                        </div>
                                    </button>
                                    <div className={`px-6 transition-all duration-300 ease-in-out ${isOpen ? "max-h-40 pb-6 opacity-100" : "max-h-0 opacity-0"}`}>
                                        <p className="text-slate-400 leading-relaxed">{faq.answer}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* Floating Features Animation Section */}
            <section className="py-12 px-6 relative z-10 w-full overflow-hidden">
                <div className="max-w-7xl mx-auto text-center mb-4 relative z-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-2xl lg:text-3xl font-bold text-slate-300"
                    >
                        Everything revolves around <span className="text-transparent bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text">Decision Intel</span>
                    </motion.h2>
                </div>

                <FloatingIconsAnimation />
            </section>

            {/* CTA Section */}
            <section className="relative py-24 md:py-40 px-6 z-10 text-center">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="max-w-4xl mx-auto"
                >
                    <motion.div
                        variants={fadeUp}
                        className="relative rounded-[2rem] border border-cyan-500/20 bg-gradient-to-br from-slate-900/80 to-slate-950/90 backdrop-blur-xl p-3 md:p-16 overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.1)] group"
                    >
                        {/* Dynamic Background */}
                        <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none">
                            <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-600/30 rounded-full blur-[80px] group-hover:scale-110 transition-transform duration-1000"></div>
                            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-600/30 rounded-full blur-[80px] group-hover:scale-110 transition-transform duration-1000 delay-100"></div>
                        </div>

                        <div className="relative z-10 flex flex-col items-center">
                            <motion.div
                                animate={{ rotate: [0, 5, -5, 0] }}
                                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                className="block mb-8 p-4 bg-slate-900 border border-slate-700/50 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                            >
                                <Flame className="w-8 h-8 text-amber-500 animate-pulse drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
                            </motion.div>

                            <h2 className="text-4xl lg:text-5xl font-black mb-6 text-white tracking-tight">
                                Ready to Transform Your <br className="hidden md:block" />
                                <span className="text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text">Email Game?</span>
                            </h2>

                            <p className="text-lg text-slate-400 mb-10 max-w-xl">
                                Join elite professionals using Decision Intel to regain control over their time and decisions.
                            </p>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleGetStarted}
                                className="group relative px-6 py-3 bg-transparent rounded-2xl font-bold flex items-center gap-3 overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 rounded-2xl"></span>
                                <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl"></span>
                                <span className="relative flex items-center gap-2 text-white text-lg drop-shadow-md">
                                    Get Started
                                    <Zap className="w-5 h-5 text-yellow-300 group-hover:rotate-12 transition-transform" />
                                </span>
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* Footer */}
            <motion.footer
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="border-t border-white/5 py-12 px-6 bg-slate-950 relative z-10"
            >
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg border border-white/10 group hover:scale-110 transition-transform">
                            <span className="text-white font-black text-sm">DI</span>
                        </div>
                        <span className="font-bold text-white tracking-wide">Decision Intel</span>
                    </div>

                    <div className="flex gap-8 text-sm font-medium text-slate-500">
                        {["Privacy", "Terms", "Contact", "Twitter"].map((item, i) => (
                            <a key={i} href="#" className="hover:text-cyan-400 transition-colors" onClick={(e) => e.preventDefault()}>
                                {item}
                            </a>
                        ))}
                    </div>
                </div>
            </motion.footer>
        </div>
    );
}