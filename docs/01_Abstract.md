# AAYUH  AI-Assisted Health Information Platform

## Abstract

**Problem Statement**
Health information available online is fragmented. Official drug data, symptom assessment, emergency helpline numbers, and personal medical records are not available together in a single, accessible platform. Most existing health apps address only one of these needs, rely on exposing API keys in client code, and lack a unified presence across web, PWA, and mobile.

**Objectives**
1. To develop an integrated platform that provides symptom assessment, verified drug information, personal medical history, doctor discovery, and emergency contacts in one application.
2. To source medicine information from an official regulatory database (US FDA openFDA) instead of unverified content.
3. To keep third-party API credentials (Groq API key) off the client by routing AI requests through a secure proxy server.
4. To deliver the same interface as a responsive website, an installable offline-capable PWA, and an Android application from a single codebase.
5. To store each user's medical records under their authenticated identity using secure, user-scoped access.

**System Description**
AAYUH is a multi-page web application developed using HTML5, CSS3, and JavaScript. It is extended into an installable Progressive Web App using a Web App Manifest and Service Worker for asset caching and update prompts. User authentication is handled by Firebase Authentication with local session persistence, and per-user data is stored in Cloud Firestore under collections such as `medical_history` and `emergencyContacts`, with queries restricted to the authenticated user's email and UID.

The platform implements three AI-assisted features: a symptom checker, a conversational health chatbot, and a medicine information module. All AI requests are sent to a Node.js/Express proxy server that accepts only POST `/chat`, reads the `GROQ_API_KEY` from environment variables, and forwards requests to the Groq Cloud API using the `llama-3.3-70b-versatile` model (temperature 0.4, max_tokens 1200), ensuring no API key is exposed in client-side code. The medicine information module queries the openFDA drug label API for the official label of a searched generic name using an AbortController for timeout handling, and combines this with an AI-generated, patient-friendly summary.

Additional modules include doctor discovery using OpenStreetMap Nominatim for geocoding and reverse geocoding, pharmacy location detection via IP geolocation, PDF parsing in the chatbot, and an Emergency module with direct dialling for ambulance and hospital helpline numbers (108, 112, 1066). The same codebase is packaged as an Android application using Capacitor 8, with over-the-air updates via the Capgo updater plugin. The web version is statically hosted on Vercel with a custom domain (`aayuh.co.in`), and the proxy is deployed on Render.

**Outcome**
The system successfully integrates AI-assisted symptom checking, FDA-verified medicine information, user-scoped medical history, doctor discovery, emergency contact management, and chatbot support into a single, cross-platform solution accessible via web, PWA, and Android.

**Keywords:** Progressive Web Application (PWA), Firebase Authentication, Cloud Firestore, Large Language Model (LLM), API Proxy, Groq, openFDA, Capacitor, Service Worker, Cross-platform Healthcare Application
