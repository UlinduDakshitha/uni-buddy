# Uni Buddy — AI Student Onboarding Assistant

A production-style AI virtual assistant that helps new university students get
settled in — answering questions about orientation, course registration,
hostel, IT/Wi-Fi setup, student ID, library, fees, and campus navigation.
Built for the Artin Solutions AI Product Prototype Challenge.

**Live demo:** _add your deployed Vercel URL here after deployment_
**Backend API:** _add your deployed Render URL here after deployment_

---

## 1. Research Process & Findings

**Problem chosen:** New students are flooded with scattered information
(emails, PDFs, notice boards) during onboarding. A conversational assistant
that answers questions instantly, in plain language, reduces load on the
Student Affairs Office and helps students settle in faster.

**AI provider research:**

| Option | Notes | Decision |
|---|---|---|
| **Google Gemini free tier** (`gemini-2.0-flash`) | Free, no credit card, generous limits, OpenAI-compatible endpoint | ✅ Default provider |
| **Groq API** (Llama 3.3 70B) | Free, no credit card, very fast (LPU hardware), OpenAI-compatible API | ✅ Supported alternative (`PROVIDER=groq`) |
| OpenAI API | Requires paid credits | ❌ Rejected — challenge asks to avoid paid APIs |
| Local LLM (Ollama) | Fully free but needs a capable local GPU to be fast/reliable | Rejected for reliability within the time budget |
| Rule-based bot (no LLM) | Free, simple | Rejected — doesn't satisfy "natural AI-powered conversation" requirement |

**Why the backend supports two providers:** during development the original
Groq account/organization was restricted by Groq ("Restricted access — your
organization has been restricted due to violating our terms of service") with
no clear cause given. Rather than block the whole project on a support
appeal, the backend was designed provider-agnostic from the start — both
Groq and Gemini expose an OpenAI-compatible `chat/completions` API, so
switching is a single `PROVIDER` value in `.env`. Documented here
deliberately: adapting to a real API/access issue under a deadline is part
of the engineering process the challenge asks to demonstrate.

**Frontend stack research:** the first draft of this project used a single
vanilla HTML/CSS/JS page. It worked, but felt closer to a demo than a
product. For this revision the frontend was rebuilt with **React + Vite +
Tailwind CSS**, which gives:
- A real component structure (Header, MessageBubble, TypingIndicator, QuickTopics)
- Two proper "screens" (Home hero page and the Chat page) via React Router
- Consistent styling via a small design-token setup in `tailwind.config.js`
- A fast, modern build pipeline that deploys cleanly to Vercel

**Avatar research:** the challenge accepts a chat interface as a fallback
when a 3D avatar isn't feasible in the time budget. Rigging a 3D avatar
(e.g. Ready Player Me + Three.js) well within ~8 hours realistically trades
off against making the AI conversation and knowledge base actually good, so
effort went into the latter, with a polished, branded chat UI instead of a
shallow 3D integration.

---

## 2. Design & Architecture

```
┌──────────────────────┐        POST /api/chat        ┌──────────────────────┐
│   React Frontend       │ ────────────────────────────▶│   Express Backend     │
│  (Vite + Tailwind)      │                              │    (server.js)        │
│  Home page / Chat page  │◀──────────────────────────── │                       │
└──────────────────────┘        { reply: "..." }         └──────────┬───────────┘
                                                                     │
                                                     loads & combines │
                                                                     ▼
                                                   ┌────────────────────────────┐
                                                   │  /knowledge/*.json           │
                                                   │  (9 topic files, configurable)│
                                                   └────────────────────────────┘
                                                                     │
                                                     system prompt + history
                                                                     ▼
                                                   ┌────────────────────────────┐
                                                   │  Groq or Gemini API          │
                                                   │  (chosen via PROVIDER env)   │
                                                   └────────────────────────────┘
```

**Frontend (`/frontend`):**
- `src/pages/Home.jsx` — hero section, welcome copy, "Start Chatting" CTA, popular-topics grid
- `src/pages/Chat.jsx` — chat screen: message list, typing indicator, quick-topic chips, composer
- `src/components/` — `Header`, `MessageBubble`, `TypingIndicator`, `QuickTopics` (all reusable, presentational)
- `src/lib/api.js` — thin Axios wrapper around the backend `/api/chat` and `/api/topics` endpoints
- `src/lib/markdown.js` — small, safe markdown renderer (bold + bullet lists) so multi-step answers render as real lists, not literal `*` characters
- `src/lib/topics.jsx` — single source of truth for the 9 knowledge topics + icons, shared by both pages

**Backend (`/backend`):**
- `server.js` — Express app, one `/api/chat` endpoint (+ `/api/health`, `/api/topics`)
- `knowledge/*.json` — one file per topic (registration, hostel, wifi, student-id, fees, orientation, library, contacts, campus-map); combined into the system prompt on every request

---

## 3. Design Decisions

- **Prompt-injection instead of a vector database (RAG-lite):** all 9 topic
  files together are small enough to fit comfortably in the LLM's context
  window, so the whole knowledge base is injected into the system prompt
  rather than using embeddings + a vector store. Keeps the project fully
  free and simple, at the cost of not scaling to a very large knowledge
  base — a documented trade-off, not an oversight.
- **One JSON file per topic, not one big file:** matches how a real
  university would maintain this content (different offices own different
  topics) and makes the "configurable knowledge" requirement obvious and
  easy to extend — adding a new topic is just adding a new `.json` file.
- **Provider-agnostic backend:** see the research section above — this
  wasn't just a nice-to-have, it's what kept the project moving when Groq
  access was interrupted.
- **React + Vite + Tailwind over vanilla JS:** a component-based frontend
  scales better, is easier to keep consistent, and matches the "professional
  level" bar for this revision, at the cost of a slightly heavier build step.
- **Client-held conversation history:** the browser keeps the messages array
  in React state and resends it each turn; no server-side session storage,
  which keeps the backend stateless and simple to deploy/scale.
- **Markdown rendering is intentionally minimal:** only bold text and bullet
  lists are supported — enough for step-by-step onboarding instructions,
  without pulling in a full markdown library for a small chat assistant.

---

## 4. Implementation Process

1. Scaffolded the React app with Vite (`create-vite`), added Tailwind CSS,
   `lucide-react` for icons, `axios` for HTTP, and `react-router-dom` for
   the Home/Chat screens.
2. Split the knowledge base into 9 topic-specific JSON files and wrote the
   backend loader that combines them into one system-prompt block.
3. Built the Express backend with a provider-agnostic `/api/chat` endpoint,
   verified with `curl` against both `/api/health` and `/api/topics`.
4. Built the Home page (hero, CTA, popular topics grid) and Chat page
   (message list, typing indicator, quick-topic chips, composer) as
   separate routes.
5. Wired the frontend to the backend via a Vite dev proxy (`/api` →
   `localhost:3000`) so no CORS config is needed locally.
6. Verified `npm run build` produces a clean production bundle.
7. Documented deployment steps for Vercel (frontend) and Render (backend).

---

## 5. Technologies & Platforms Used

| Part | Technology |
|---|---|
| Frontend framework | React 19 + Vite |
| Styling | Tailwind CSS 3 |
| Icons | lucide-react |
| Routing | react-router-dom |
| HTTP client | Axios |
| Backend | Node.js + Express |
| AI model/service | Google Gemini (`gemini-2.0-flash`, free tier) — or Groq (`llama-3.3-70b-versatile`, free tier) |
| Knowledge base | Plain JSON files (one per topic) |
| Deployment (recommended) | Vercel (frontend) + Render (backend), both free tiers |

---

## 6. Working Prototype

Run locally with the setup instructions below (takes about 5 minutes), or
deploy for free following the deployment guide in section 10 and link the
live URL at the top of this file.

---

## 7. Source Code Structure

```
uni-buddy/
├── frontend/
│   ├── src/
│   │   ├── pages/          (Home.jsx, Chat.jsx)
│   │   ├── components/     (Header, MessageBubble, TypingIndicator, QuickTopics)
│   │   ├── lib/             (api.js, markdown.js, topics.jsx)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── .env.example
│   └── package.json
├── backend/
│   ├── server.js
│   ├── knowledge/            (9 topic JSON files)
│   ├── .env.example
│   └── package.json
├── .gitignore
└── README.md
```

---

## 8. Setup Instructions (Local Development)

**Prerequisites:** Node.js 18+.

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Open .env and either:
#  - paste GEMINI_API_KEY (get a free one at https://aistudio.google.com/apikey), or
#  - set PROVIDER=groq and paste GROQ_API_KEY (get one free at https://console.groq.com/keys)
npm start
```

Backend runs at `http://localhost:3000`. Confirm it's up:
```bash
curl http://localhost:3000/api/health
```

### Frontend

In a second terminal:
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173` and proxies API calls to the
backend automatically (see `vite.config.js`) — no extra config needed for
local development.

---

## 9. Deployment Guide (Free Tier)

### Backend → Render

1. Push this project to a GitHub repo.
2. On [render.com](https://render.com), create a **New Web Service** from
   your repo.
3. Set **Root Directory** to `backend`.
4. Build command: `npm install` · Start command: `npm start`.
5. Add environment variables from `backend/.env.example` (at least
   `PROVIDER` and the matching API key). Add `FRONTEND_URL` once you know
   your Vercel URL, to restrict CORS to just your frontend.
6. Deploy — Render gives you a URL like `https://uni-buddy-backend.onrender.com`.

### Frontend → Vercel

1. On [vercel.com](https://vercel.com), import the same GitHub repo.
2. Set **Root Directory** to `frontend` (Vercel auto-detects the Vite preset).
3. Add environment variable `VITE_API_URL` = your Render backend URL from above.
4. Deploy — Vercel gives you a URL like `https://uni-buddy.vercel.app`.
5. Paste both URLs at the top of this README.

*(Render's free tier spins down after inactivity, so the first request after
idle time can take ~30 seconds to wake up — normal for free-tier hosting.)*

---

## 10. Screenshots

Screenshots aren't included in this ZIP/repo — generating them requires an
actual running browser session, so please capture your own once you have it
running locally or deployed:
1. Home page (hero + popular topics)
2. Chat page with a sample conversation (e.g. asking about hostel or Wi-Fi)
3. Mobile view (browser dev tools responsive mode, or an actual phone)

Save them into a `/screenshots` folder before zipping your final submission.

---

## 11. Other Notes / Limitations / Future Improvements

**Limitations:**
- Knowledge base is for a placeholder institution ("Greenfield University") —
  in a real deployment this would be populated per-institution.
- No persistent chat history across page reloads or multiple users/sessions.
- No authentication — anyone with the link can chat.
- Prompt-injection works well for 9 small topic files but would need
  embedding-based retrieval if scaled to full handbooks/PDFs per topic.
- Render's free tier cold-starts after inactivity (see deployment note above).

**Future improvements given more time:**
- Lightweight vector search so the knowledge base can grow without hitting
  context limits.
- A simple admin UI to edit topic JSON files without touching raw JSON.
- Persist chat history (e.g. localStorage or a lightweight DB) across reloads.
- Add a simple animated 2D avatar (Lottie) for personality without full 3D complexity.
- Voice input/output via the free Web Speech API for a voice-assistant mode.
