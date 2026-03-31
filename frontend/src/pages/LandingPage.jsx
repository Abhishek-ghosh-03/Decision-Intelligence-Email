import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
    Sparkles,
    ArrowRight,
    CheckCircle,
    Brain,
    Star,
    Zap,
    MessageSquare,
    BarChart3,
    Clock,
    Shield,
    Flame,
    ChevronDown,
} from "lucide-react";

export default function LandingPage() {
    const navigate = useNavigate();
    const [openIndex, setOpenIndex] = useState(0);

    const handleGetStarted = async () => {
        try {
            const res = await axios.get("import.meta.env.VITE_API_URL");
            if (res.data.success) {
                navigate("/dashboard");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const features = [
        {
            title: "Smart Grouping",
            desc: "Automatically organize emails by sender, domain, and topic.",
            icon: Zap,
            color: "text-yellow-600",
        },
        {
            title: "AI Insights",
            desc: "Extract decisions, tasks, and risks with advanced AI.",
            icon: Brain,
            color: "text-green-600",
        },
        {
            title: "Smart Reply",
            desc: "Get AI-powered response suggestions instantly.",
            icon: MessageSquare,
            color: "text-blue-600",
        },
        {
            title: "Decision Dashboard",
            desc: "Visualize all decisions and deadlines in one place.",
            icon: BarChart3,
            color: "text-purple-600",
        },
        {
            title: "Smart Scheduling",
            desc: "Never miss a follow-up with intelligent scheduling.",
            icon: Clock,
            color: "text-red-600",
        },
        {
            title: "Risk Detection",
            desc: "Identify potential blockers and concerns automatically.",
            icon: Shield,
            color: "text-indigo-600",
        },
    ];

    return (
        <div className="bg-[#0f172a] text-gray-900">
            
            <header className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

            
                    <a href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition">
                            <span className="text-white font-bold text-base">DI</span>
                        </div>

                        <div>
                            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                                Decision Intel
                            </span>
                            <p className="text-xs text-gray-500 -mt-1">
                                AI Email Intelligence
                            </p>
                        </div>
                    </a>

            
                    <div className="hidden md:flex items-center gap-8">
                        {["Features", "How it works", "Pricing"].map((item, i) => (
                            <a
                                key={i}
                                href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
                                className="text-sm text-gray-500 hover:text-black transition relative group"
                            >
                                {item}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 group-hover:w-full transition-all duration-300"></span>
                            </a>
                        ))}
                    </div>
                </div>
            </header>

            
            <section className="relative min-h-screen pt-32 pb-20 px-6 flex items-center overflow-hidden">
                <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">

            
                    <div className="space-y-8">
                        <div className="inline-block">
                            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 border border-blue-300 rounded-full">
                                <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
                                <span className="text-sm font-semibold text-blue-600">
                                    Introducing AI Email Intelligence
                                </span>
                            </div>
                        </div>

                        <h1 className="text-white text-5xl lg:text-7xl font-bold leading-tight">
                            Never Lose
                            <span className="block text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 bg-clip-text animate-pulse">
                                a Decision
                            </span>
                            Again
                        </h1>

                        <p className="text-lg text-gray-500 max-w-xl">
                            Intelligently organize, analyze, and act on your emails.
                            Extract key decisions, tasks, and risks automatically.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={handleGetStarted}
                                className="group px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white rounded-xl font-semibold flex items-center gap-2 hover:scale-105 transition"
                            >
                                Get Started
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                            </button>

                            <button className="px-8 py-4 border-2 rounded-xl hover:bg-gray-100 transition">
                                View Demo
                            </button>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 border-2 border-white" />
                                ))}
                            </div>
                            <p className="text-sm text-gray-500">
                                <span className="font-semibold text-white">Join Now</span> 
                            </p>
                        </div>
                    </div>

            
                    <div className="relative hidden lg:block h-[600px]">

                        <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-cyan-100 blur-3xl rounded-full" />

                        <div className="absolute top-0 right-0 w-80 bg-white/70 backdrop-blur-lg border rounded-2xl p-6 shadow-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <CheckCircle className="text-green-500" />
                                <span className="font-semibold">Decisions Tracked</span>
                            </div>
                            <h2 className="text-4xl font-bold">847</h2>
                        </div>

                        <div className="absolute top-72 -left-10 w-72 bg-white/70 backdrop-blur-lg border rounded-2xl p-6 shadow-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <Brain className="text-blue-500" />
                                <span className="font-semibold">AI Insights</span>
                            </div>
                            <p className="text-sm text-gray-500">Tasks & Risks detected</p>
                        </div>

                        <div className="absolute bottom-20 right-20 w-80 bg-white/70 backdrop-blur-lg border rounded-2xl p-6 shadow-xl">
                            <div className="flex justify-between mb-4">
                                <span className="font-semibold">Processing Speed</span>
                                <span className="text-purple-600 font-bold">99%</span>
                            </div>
                        </div>

                        <Sparkles className="absolute top-20 right-10 text-yellow-400 animate-bounce" />
                        <Star className="absolute bottom-40 left-20 text-blue-400 animate-bounce" />
                    </div>
                </div>
            </section>
            
            <section className="py-20 px-6 bg-[#0f172a]">
                <div className="max-w-5xl mx-auto text-center">

                    <h2 className="text-3xl font-bold text-white mb-6">
                        See It In Action || <span className="text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 bg-clip-text animate-pulse">Play it at 2X</span>
                    </h2>

                    <video
                        className="w-full rounded-xl shadow-2xl"
                        controls
                        autoPlay
                        muted
                        loop
                    >
                        <source src="/video/samplevideo.mp4" type="video/mp4" />
                    </video>
                </div>
            </section>
            
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto">
                <h1 className="text-white text-sm font-bold flex justify-center">__This is the testing phase so only the admin user can access the application.__</h1>
                    <br></br>
                    <h2 className="text-white text-4xl font-bold text-center mb-12 text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 bg-clip-text animate-pulse">
                        Features
                    </h2>

            
                    <div className="space-y-4 md:hidden">
                        {features.map((f, i) => {
                            const Icon = f.icon;
                            const isOpen = openIndex === i;

                            return (
                                <div
                                    key={i}
                                    className={`border rounded-xl transition ${isOpen ? "bg-blue-50" : "bg-white"
                                        }`}
                                >
                                    <button
                                        onClick={() => setOpenIndex(isOpen ? null : i)}
                                        className="w-full flex justify-between items-center p-5"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon className={f.color} />
                                            <span className="font-semibold">{f.title}</span>
                                        </div>

                                        <ChevronDown
                                            className={`transition ${isOpen ? "rotate-180" : ""}`}
                                        />
                                    </button>

                                    <div
                                        className={`px-5 overflow-hidden transition-all duration-300 ${isOpen ? "max-h-40 pb-4 opacity-100" : "max-h-0 opacity-0"
                                            }`}
                                    >
                                        <p className="text-gray-600">{f.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

            
                    <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((f, i) => {
                            const Icon = f.icon;

                            return (
                                <div
                                    key={i}
                                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition hover:-translate-y-1"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <Icon className={`${f.color} w-6 h-6`} />
                                        <h3 className="font-semibold text-lg">{f.title}</h3>
                                    </div>

                                    <p className="text-gray-600 text-sm">
                                        {f.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            
            <section className="relative py-16 md:py-32 px-6">
                <div className="max-w-4xl mx-auto">

                    <div className="relative rounded-3xl border border-blue-300 bg-gradient-to-br from-blue-200/40 via-indigo-100/20 to-cyan-100/10 p-4 md:p-12 text-center overflow-hidden group">

                        <div className="absolute inset-0 opacity-30">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/30 rounded-full blur-3xl animate-pulse"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-500"></div>
                        </div>

                        <div className="relative z-10">

                            <div className="inline-block mb-6 p-3 bg-gradient-to-br from-blue-200 to-indigo-100 rounded-full">
                                <Flame className="w-6 h-6 text-blue-600 animate-bounce" />
                            </div>

                            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                                Ready to Transform Your Email Game?
                            </h2>

                            <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto">
                                Join thousands of professionals who are already using Decision Intel
                            </p>

                            <button
                                onClick={handleGetStarted}
                                className="group relative px-10 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white rounded-xl font-semibold flex items-center gap-2 mx-auto overflow-hidden hover:scale-105 transition"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition"></span>
                                <span className="relative flex items-center gap-2">
                                    Get Started
                                </span>
                            </button>

                        </div>
                    </div>
                </div>
            </section>

            
            <footer className="border-t py-12 px-6 bg-gray-50">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">

                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                            DI
                        </div>
                        <span className="font-bold">Decision Intel</span>
                    </div>

                    <div className="flex gap-8 text-sm text-gray-500">
                        {["Privacy", "Terms", "Contact", "Twitter"].map((item, i) => (
                            <a key={i} href="#" className="hover:text-black transition">
                                {item}
                            </a>
                        ))}
                    </div>

                </div>
            </footer>

        </div>
    );
}