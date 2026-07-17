import axios from "axios";

// In dev, Vite proxies /api -> http://localhost:3000 (see vite.config.js).
// In production, set VITE_API_URL to the deployed backend URL (Render).
const baseURL = import.meta.env.VITE_API_URL || "";

export const api = axios.create({ baseURL });

/**
 * Send the full conversation history to the backend and get the assistant's
 * next reply. The backend injects the knowledge base + system prompt and
 * forwards to the configured AI provider (Groq or Gemini).
 */
export async function sendChatMessage(messages) {
  const { data } = await api.post("/api/chat", { messages });
  return data.reply;
}

export async function getTopics() {
  const { data } = await api.get("/api/topics");
  return data.topics;
}
