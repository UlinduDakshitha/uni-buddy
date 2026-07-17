import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Allow the deployed frontend origin (set FRONTEND_URL in .env for production).
// In development, allow all origins so the Vite dev server can call freely.
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
app.use(express.json());

const PORT = process.env.PORT || 3000;

/**
 * PROVIDER CONFIG
 * -----------------------------------------------------------------------
 * Supports swapping between free AI providers via .env without touching
 * code, since both expose an OpenAI-compatible chat/completions endpoint.
 *   PROVIDER=groq   -> Groq (Llama models, api.groq.com)
 *   PROVIDER=gemini -> Google Gemini free tier (OpenAI-compatible endpoint)
 */
const PROVIDER = process.env.PROVIDER || "gemini";

const PROVIDERS = {
  groq: {
    url: "https://api.groq.com/openai/v1/chat/completions",
    apiKey: process.env.GROQ_API_KEY,
    model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
  },
  gemini: {
    url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    apiKey: process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
  },
};

const API_URL = PROVIDERS[PROVIDER].url;
const API_KEY = PROVIDERS[PROVIDER].apiKey;
const MODEL = PROVIDERS[PROVIDER].model;

/**
 * CONFIGURABLE KNOWLEDGE BASE
 * -----------------------------------------------------------------------
 * The "configurable knowledge / instructions" requirement: each topic
 * (registration, hostel, wifi, fees, ...) lives in its own JSON file under
 * /knowledge. Anyone can edit or add a topic file with zero code changes.
 * On every request we combine all topic files into one text block and
 * inject it into the system prompt — a lightweight form of
 * Retrieval-Augmented Generation (RAG). Since the whole knowledge base is
 * small enough to fit comfortably in the context window, we skip a vector
 * database entirely; for a much larger knowledge base you'd swap this for
 * embedding-based retrieval (noted as a future improvement in the README).
 */
const KNOWLEDGE_DIR = path.join(__dirname, "knowledge");
const UNIVERSITY_NAME = "Greenfield University";
const ASSISTANT_NAME = "Uni Buddy";

function loadKnowledgeBase() {
  const files = fs
    .readdirSync(KNOWLEDGE_DIR)
    .filter((f) => f.endsWith(".json"));

  let text = "";
  const topics = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(KNOWLEDGE_DIR, file), "utf-8");
    const data = JSON.parse(raw);
    topics.push({ id: path.basename(file, ".json"), category: data.category });

    text += `## ${data.category}\n`;
    for (const item of data.items) {
      text += `Q: ${item.q}\nA: ${item.a}\n`;
    }
    text += "\n";
  }

  return { text, topics };
}

function buildSystemPrompt() {
  const { text } = loadKnowledgeBase();
  return `You are "${ASSISTANT_NAME}", a friendly AI onboarding assistant for new students at ${UNIVERSITY_NAME}.

Your job is to help new students get settled in: orientation, course registration, hostel, IT/Wi-Fi, student ID, library, fees, clubs, campus navigation, and who to contact for help.

Answer ONLY using the knowledge base below. If the answer isn't in the knowledge base, politely say you don't have that information yet and suggest the student contact the Student Affairs Office. Never invent policies, numbers, or contacts that aren't in the knowledge base.
Keep answers short, warm, and easy to follow for a first-year student. Use "- " bullet points for multi-step instructions.

--- KNOWLEDGE BASE ---
${text}--- END KNOWLEDGE BASE ---`;
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", provider: PROVIDER, model: MODEL });
});

// List available knowledge topics (used by the frontend, and useful for debugging)
app.get("/api/topics", (req, res) => {
  const { topics } = loadKnowledgeBase();
  res.json({ topics });
});

// Main chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    if (!API_KEY) {
      return res.status(500).json({
        error: `API key missing for provider "${PROVIDER}". Copy .env.example to .env and set ${
          PROVIDER === "gemini"
            ? "GEMINI_API_KEY (get one free at aistudio.google.com/apikey)"
            : "GROQ_API_KEY (get one free at console.groq.com/keys)"
        }`,
      });
    }

    const { messages } = req.body;
    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: "messages array is required" });
    }

    const systemPrompt = buildSystemPrompt();

    const apiResponse = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        temperature: 0.4,
        max_tokens: 500,
      }),
    });

    if (!apiResponse.ok) {
      const errText = await apiResponse.text();
      console.error(`${PROVIDER} API error:`, errText);
      return res
        .status(apiResponse.status)
        .json({ error: `${PROVIDER} API error`, details: errText });
    }

    const data = await apiResponse.json();
    const reply = data.choices?.[0]?.message?.content ?? "";
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(
    `Uni Buddy backend running on http://localhost:${PORT} (provider: ${PROVIDER}, model: ${MODEL})`
  );
});
