import { useNavigate } from "react-router-dom";
import { GraduationCap, MessageCircle, ArrowRight } from "lucide-react";
import { TOPICS } from "../lib/topics.jsx";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-dvh flex-col items-center bg-gradient-to-b from-navy to-navy-light px-5 py-10 text-white sm:py-16">
      <div className="w-full max-w-2xl">
        {/* Hero */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
            <GraduationCap className="h-9 w-9 text-gold" strokeWidth={2} />
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-wide sm:text-4xl">
            Uni Buddy
          </h1>
          <p className="mt-2 text-sm uppercase tracking-[0.2em] text-gold">
            AI Student Onboarding Assistant
          </p>
          <p className="mt-5 max-w-md text-balance text-white/70">
            New to Greenfield University? I'm here to help with orientation,
            course registration, hostel, Wi-Fi setup, fees, and everything
            else you need to get settled in.
          </p>

          <button
            onClick={() => navigate("/chat")}
            className="mt-8 flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-medium text-white shadow-lg shadow-gold/20 transition-transform hover:scale-105 active:scale-95"
          >
            <MessageCircle className="h-4 w-4" strokeWidth={2.2} />
            Start Chatting
          </button>
        </div>

        {/* Popular topics */}
        <div className="mt-14">
          <p className="mb-4 text-center text-xs font-medium uppercase tracking-widest text-white/50">
            Popular topics
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {TOPICS.map((t) => (
              <button
                key={t.id}
                onClick={() => navigate("/chat", { state: { question: t.question } })}
                className="group flex flex-col items-start gap-2 rounded-xl border border-white/10 bg-white/5 p-4 text-left transition-colors hover:border-gold/50 hover:bg-white/10"
              >
                <t.icon className="h-5 w-5 text-gold" strokeWidth={2} />
                <span className="text-sm font-medium">{t.label}</span>
                <ArrowRight className="h-3.5 w-3.5 text-white/30 transition-transform group-hover:translate-x-1 group-hover:text-gold" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-12 text-center text-xs text-white/30">
        Built for the Artin Solutions AI Product Prototype Challenge
      </p>
    </div>
  );
}
