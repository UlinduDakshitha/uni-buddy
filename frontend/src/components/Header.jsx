import { GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header({ status = "online" }) {
  return (
    <header className="flex items-center gap-3 bg-navy px-5 py-4 text-white shadow-sm">
      <Link to="/" className="flex items-center gap-3 min-w-0">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
          <GraduationCap className="h-6 w-6 text-gold" strokeWidth={2} />
        </div>
        <div className="min-w-0">
          <h1 className="truncate font-display text-lg font-semibold tracking-wide">
            Uni Buddy
          </h1>
          <p className="truncate text-xs text-white/60">
            Greenfield University · Student Onboarding Assistant
          </p>
        </div>
      </Link>
      <span
        className="ml-auto h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_0_3px_rgba(52,211,153,0.25)]"
        title={status}
      />
    </header>
  );
}
