import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FloatingIconsAnimation from "../components/FloatingIconsAnimation";

export default function AuthSuccess() {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/dashboard");
        }, 3500); // 3.5 seconds of animation before navigating to dashboard

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-900 pointer-events-none overflow-hidden">
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <FloatingIconsAnimation className="h-full w-full min-h-screen" />
            </div>
            
            <div className="absolute bottom-20 flex flex-col items-center z-20">
                <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-2 shadow-sm animate-pulse">
                    Preparing Your Workspace
                </h1>
                <p className="text-gray-500 text-sm">
                    Syncing emails and gathering intelligence
                </p>
            </div>
        </div>
    );
}
