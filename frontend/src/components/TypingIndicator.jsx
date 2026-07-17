import { GraduationCap } from "lucide-react";

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-2.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-soft">
        <GraduationCap className="h-4 w-4 text-navy" strokeWidth={2} />
      </div>
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-navy-soft px-4 py-3.5">
        <span className="h-1.5 w-1.5 animate-bounce1 rounded-full bg-slate-400" />
        <span
          className="h-1.5 w-1.5 animate-bounce1 rounded-full bg-slate-400"
          style={{ animationDelay: "0.15s" }}
        />
        <span
          className="h-1.5 w-1.5 animate-bounce1 rounded-full bg-slate-400"
          style={{ animationDelay: "0.3s" }}
        />
      </div>
    </div>
  );
}
