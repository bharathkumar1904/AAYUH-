A full-stack, multi-platform health companion: AI-powered symptom checker,
medicine intelligence, medical history tracking, emergency SOS, and doctor
discovery - served as a Progressive Web App **and** an Android app from a
single codebase.

**Live Demo:** http://aayuh.vercel.app/

## Key Highlights
- **AI Healthcare Engine** - Symptom checker, health chatbot and medicine
  explanations powered by Groq (Llama 3.3-70B), run behind a private Node.js
  proxy so API keys stay off the client.
- **Real Drug Data** - Medicine lookups combine the US FDA open drug database
  with AI-generated patient-friendly summaries (usage, dosage, timing,
  side effects).
- **One Codebase, Three Platforms** - Responsive website, installable PWA,
  and a Capacitor-wrapped Android APK (OTA-updatable via Capgo).
- **Complete Auth & Records** - Firebase Auth (persistent sessions) with
  personal medical history, pharmacy, and profile management.
- **Emergency Ready** - SOS emergency page and "find doctors" flow for urgent care.

## Core Features (full list)
| Area | Features |
|------|----------|
| Medicine Intelligence | Search by generic/brand name; AI-generated usage, dosage, timing, side effects, safety instructions |
| AI Symptom Checker | Natural-language symptom description; AI-computed condition analysis sorted by likelihood |
| Health Chatbot | Conversational AI assistant for health questions |
| Medical Records | Digital medical history storage per user |
| Find Care | Doctor search & emergency SOS contact flow |
| Pharmacy & Drugs | Pharmacy page + drug information library |
| Accounts | Email/password auth, profile, settings, persistent sessions |
| Productized Content | Symptoms, diseases, FAQ, blog, terms, disclaimer pages — with medical-education-only disclaimer |

## Tech Stack
| Layer | Technology | Role |
|-------|-----------|------|
| Frontend | HTML5, CSS3, JavaScript (ES6+), Web App Manifest, Service Worker | Responsive multi-page app + offline-capable PWA |
| AI | Groq Cloud (Llama 3.3-70B Versatile) | Symptom analysis, medicine explainers, chatbot |
| Backend Proxy | Node.js + Express (`server.js`), Railway | Hides GROQ_API_KEY, CORS, keep-alive health checks |
| Drug Data | USFDA open.fda.gov drug/label API | Real drug label & interaction data |
| Auth & DB | Firebase Authentication + Firebase Firestore | Users, sessions, medical history storage |
| Mobile | Capacitor 8 (Android), Capgo updater | APK build + over-the-air updates |
| Hosting | Vercel (static), Railway (proxy) | Global CDN + API uptime |

## Architecture
Browser / PWA / Android App (front-end fetches) → Vercel static hosting →
`/chat` → Node.js proxy → Groq LLM  ·  Firebase Auth/Firestore (user data) ·
FDA API (drug data)

## Getting Started
1. `git clone …` ; open the site with any static server (or `python -m http.server`)
2. Backend server: `npm install` in repo root; `server.js` starts with `GROQ_API_KEY` env variable: a private proxy that relays `/chat` requests to Groq.
3. Frontend pages reference Firestore/Auth config in each page where needed — instantiate your Firebase project keys.
4. Android: `npx cap add android` → build APK in Android Studio. (Full setup in docs)

## Project Structure
(simplified tree here)

## Deployment
- Web: **Vercel** (`vercel.json` static build)
- API: **Railway** (`aayuh-production.up.railway.app`) with keep-alive
- Android: Capacitor + Capgo for OTA updates

## Security & Privacy 🚀
- Groq API key never ships to the client (server-only env var)
- Firestore rules recommended: user-scoped read/write
- Health data policy: educational info only, not medical advice (see Disclaimer)

## Roadmap**Planned:
- ** Doctor appointment booking flow
- **Planned:** Medication reminder push notifications (PWA + Android)
- **Planned:** Expanded FDA disease index & multilingual/local-language support

## Contact
Built by Bharat Kumar Peddireddy (bharathkumarnaidu8143@gmail.com,https://github.com/bharathkumar1904/AAYUH-). Report issues via /issues.
