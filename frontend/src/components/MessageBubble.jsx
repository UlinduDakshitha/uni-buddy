import { GraduationCap, User } from "lucide-react";
import { renderMarkdown } from "../lib/markdown";

export default function MessageBubble({ role, text }) {
  const isAssistant = role === "assistant";

  const avatar = (
    <div
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
        isAssistant ? "bg-navy-soft" : "bg-navy"
      }`}
    >
      {isAssistant ? (
        <GraduationCap className="h-4 w-4 text-navy" strokeWidth={2} />
      ) : (
        <User className="h-4 w-4 text-white" strokeWidth={2} />
      )}
    </div>
  );

  const bubble = isAssistant ? (
    <div
      className="max-w-[80%] rounded-2xl rounded-bl-md bg-navy-soft px-4 py-2.5 text-[0.92rem] leading-relaxed text-slate-800 animate-fadeUp"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(text) }}
    />
  ) : (
    <div className="max-w-[80%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-navy px-4 py-2.5 text-[0.92rem] leading-relaxed text-white animate-fadeUp">
      {text}
    </div>
  );

  return (
    <div
      className={`flex items-start gap-2.5 ${
        isAssistant ? "" : "flex-row-reverse"
      }`}
    >
      {avatar}
      {bubble}
    </div>
  );
}
