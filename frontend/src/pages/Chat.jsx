import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { SendHorizonal } from "lucide-react";
import Header from "../components/Header";
import MessageBubble from "../components/MessageBubble";
import TypingIndicator from "../components/TypingIndicator";
import QuickTopics from "../components/QuickTopics";
import { TOPICS } from "../lib/topics.jsx";
import { sendChatMessage } from "../lib/api";

const WELCOME =
  "Hey! I'm Uni Buddy 👋 I can help you with orientation, course registration, hostel, Wi-Fi/IT setup, fees, and more. What would you like to know?";

export default function Chat() {
  const location = useLocation();
  const [messages, setMessages] = useState([
    { role: "assistant", content: WELCOME },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const startedFromHome = useRef(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // If the user arrived from the Home page with a pre-picked question, send it once.
  useEffect(() => {
    const presetQuestion = location.state?.question;
    if (presetQuestion && !startedFromHome.current) {
      startedFromHome.current = true;
      handleSend(presetQuestion);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  async function handleSend(text) {
    const trimmed = (text ?? input).trim();
    if (!trimmed || isTyping) return;

    const nextMessages = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setIsTyping(true);

    try {
      const reply = await sendChatMessage(
        nextMessages.map(({ role, content }) => ({ role, content }))
      );
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      const serverMsg = err.response?.data?.error;
      setError(serverMsg || "Couldn't reach the server. Is the backend running?");
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  }

  return (
    <div className="mx-auto flex h-dvh w-full max-w-2xl flex-col bg-white shadow-xl sm:my-6 sm:h-[85vh] sm:rounded-2xl sm:overflow-hidden">
      <Header />

      <main className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
        {messages.map((m, i) => (
          <MessageBubble key={i} role={m.role} text={m.content} />
        ))}
        {isTyping && <TypingIndicator />}
        {error && (
          <div className="flex items-start gap-2.5">
            <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-red-50 px-4 py-2.5 text-sm text-red-700">
              ⚠️ {error}
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </main>

      <QuickTopics topics={TOPICS} onSelect={(q) => handleSend(q)} />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2.5 border-t border-slate-100 px-4 py-4"
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about registration, hostel, Wi-Fi, fees..."
          autoComplete="off"
          disabled={isTyping}
          className="flex-1 rounded-full border border-slate-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-gold disabled:bg-slate-50"
        />
        <button
          type="submit"
          disabled={isTyping || !input.trim()}
          aria-label="Send"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold text-white transition-transform hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
        >
          <SendHorizonal className="h-4 w-4" strokeWidth={2.2} />
        </button>
      </form>
    </div>
  );
}
