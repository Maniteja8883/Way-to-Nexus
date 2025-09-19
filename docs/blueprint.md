# **App Name**: Way To Nexus

## Core Features:

- Secure User Authentication: Implements email/password and Google Sign-in with Firebase Auth, incorporating App Check and fallback CAPTCHA for security. Stores session tokens securely with server-side refresh and 7-day expiration.
- AI-Powered Career Chatbot: Chatbot UI powered by Gemini, utilizing Cloud Functions for server-side calls to answer career-related questions based on a selected persona. Uses the tool 'function calling' for precise JSON output and integration of external APIs, with rate-limiting to avoid over-use.  Optionally falls back to a mock LLM or low-cost open model if Gemini fails (USE_MOCK_LLM=true).
- Interactive Mindmap Generation: Generates interactive mind maps (nodes + edges) for each chat thread, powered by Gemini and cached in Firestore for revisits. Uses function calling to produce strict JSON mindmap schema. If Gemini returns malformed JSON, retry up to 2 times with stricter parsing instructions; if still failing, return an explainable fallback message and a pre-baked sample mindmap (demo mode).  Users can click nodes to auto-populate chat input with prompts. Exports mindmap as PNG/SVG using cytoscape.js export helper.
- Personalized Persona Creation: Allows users to create and save multiple personas, influencing the chatbot's advice. Requires a mandatory checkbox at persona creation: 'I consent to storing my persona for personalized recommendations.' Links to a short privacy stub. Stores only necessary fields for personalization (e.g., age instead of DOB). Personas are displayed as floating cards with key details and quick access to exploration.
- AI-Curated News Feed: Delivers a news feed that uses AI to summarize new and emerging job roles, linking to trusted sources for more details. Every summary includes: (1) 2–3 line AI summary, (2) link to source, (3) tags (job role, industry, date), (4) confidence score (low/medium/high) about novelty.  Caches news for 12 hours.
- Feedback-Driven Adaptation: Collects user feedback after each chat thread and adapts future responses based on stored feedback per persona.
- Minimalist User Interface: Features a mobile-first, responsive UI. On widths < 768px stack mindmap above chat; on desktop show split layout with mindmap left, chat right.  Includes a launch animation, floating persona cards, and subtle 3D elements using Three.js and Framer Motion.

## Style Guidelines:

- Primary color: Saturated violet (#9400D3), reminiscent of academic robes and conveying a sense of purpose and importance, suits the app's subject matter.
- Background color: Light desaturated violet (#F1E5F9), same hue as the primary, but with brightness appropriate for a light color scheme.
- Accent color: Bright, contrasting pink (#FF69B4), analogous to the primary, adding vibrancy for CTAs and interactive elements.
- Body: 'PT Sans', sans-serif for body text, providing a modern and slightly warm feel.
- Headline: 'Inter', modern sans-serif, suitable for headlines to highlight key information.
- Code font: 'Source Code Pro' for displaying code snippets or technical instructions, maintaining readability and clarity.
- Utilize clean and consistent icons from Heroicons (heroicons/react) that align with the app's navigational structure. Aim for simple glyphs with rounded edges to compliment overall aesthetic.
- Employ a modern, card-based layout with ample spacing and subtle shadows to create depth and visual interest. Floating persona cards will populate the Persona dashboard.
- Incorporate subtle micro-interactions using Framer Motion to enhance user experience. This includes gentle transitions, hover effects, and animated loading states.