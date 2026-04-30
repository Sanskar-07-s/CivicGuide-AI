# 🗳️ CivicGuide AI — Election Literacy Assistant

> **Built for PromptWars Virtual by Hack2Skill**  
> Vertical: Civic Technology & Public Education  
> Builder: Sanskar | India 🇮🇳

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-blue?style=for-the-badge)](https://civic-guide-ai-xi.vercel.app/)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-green?style=for-the-badge)](https://sanskar-07-s.github.io/CivicGuide-AI/)
[![Built with Gemini](https://img.shields.io/badge/Powered%20by-Google%20Gemini-orange?style=for-the-badge)](https://ai.google.dev/)

---

## 📌 Chosen Vertical

**Civic Technology & Public Education**

Voter turnout in India consistently suffers from one root cause:
citizens don't understand the process. Millions of eligible voters —
especially first-timers, rural citizens, and young adults — skip
elections not out of apathy, but out of confusion.

CivicGuide AI directly solves this by making election literacy
interactive, personalized, and accessible to every Indian citizen,
regardless of their background or prior knowledge.

---

## 🧠 Approach & Logic

### The Core Problem
Most election information is:
- Buried in government PDFs
- Written in legal/bureaucratic language
- Not personalized to the user's state or situation
- Available only in English

### The Solution Philosophy
Instead of building another information website, I built a
**conversational AI tutor** that:

1. **Meets users where they are** — first-time voters get simpler
   explanations; experienced voters get technical depth
2. **Knows where you live** — state-specific answers for all
   28 states + 8 UTs of India
3. **Pulls live data** — Google Search Grounding ensures answers
   reflect current ECI announcements, not outdated training data
4. **Makes it a game** — Quiz mode with badges and progress
   tracking turns civic education into an engaging experience
5. **Speaks your language** — English and Hindi support

### Prompt Engineering Strategy
The entire intelligence of this app lives in the system prompt.
Key design decisions:

- **Mode-switching prompts**: The same AI switches between
  Chat, Quiz (returns strict JSON), and Glossary (returns
  definition cards) based on user selection
- **Persona-aware responses**: `userType = "first-time"` triggers
  simpler language and extra encouragement
- **State injection**: `userState` is injected into every API call,
  forcing the AI to reference state-specific CEO websites,
  deadlines, and rules
- **7 Unbreakable Rules**: Hardcoded guardrails prevent
  hallucination, partisan bias, and legal advice
- **Structured output format**: Every chat response follows:
  📌 Direct answer → explanation → tip → source → follow-up

---

## ⚙️ How the Solution Works

### Architecture Overview

```
User Input (Text / Voice)
        ↓
React Frontend (Vite)
        ↓
buildSystemPrompt(country, mode, lang, userState, userType)
        ↓
Google Gemini API (gemini-2.0-flash)
  + Google Search Grounding (live web data)
        ↓
Response Parser
  → Chat: renders markdown-style text + source pills
  → Quiz: parses JSON → renders interactive MCQ UI
  → Glossary: renders definition card
        ↓
UI Updates (Framer Motion animations)
        ↓
localStorage (progress, badges, preferences, theme)
```

### Feature Breakdown

#### 1. 🤖 AI Chat Assistant
- Floating chat window, toggleable from any page
- Dropdowns for Country / Mode / Language in header
- Voice input via Web Speech API (no external library)
- Auto-scrolling, loading indicators, copy-to-clipboard per message
- Follow-up suggestion chips rendered from AI response

#### 2. 🌐 Google Search Grounding (Live Data)
```js
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  tools: [{ googleSearch: {} }],
});
// Sources extracted from groundingMetadata and shown as
// clickable pills below each AI response
```
Ensures answers about voter deadlines, ECI announcements,
and state election dates are always current.

#### 3. 🗺️ State-Specific Intelligence
- Dropdown with all 28 states + 8 Union Territories
- Selecting a state updates the system prompt context
- AI automatically references the correct CEO website,
  local deadlines, and regional election schedules

#### 4. 🧠 Quiz Mode
- AI generates JSON-formatted MCQs on demand
- Custom parser renders interactive answer cards
- Color-coded feedback (green = correct, red = wrong)
- Explanation shown after every answer
- Difficulty varies: easy → medium → hard

#### 5. 📖 Glossary Mode
- User types any election term (EVM, NOTA, MCC, etc.)
- AI returns a structured definition card:
  Definition → Real Example → Why It Matters → Common Misconception
- Suggested term chips for quick lookup

#### 6. 📊 Progress Tracker & Badges
Tracked in localStorage across sessions:
```
totalQuestionsAnswered, correctAnswers,
currentStreak, bestStreak, civicScore, badgesEarned
```
Badge system with 6 unlockable achievements:
🗳️ First Vote | 🔥 On Fire | ⚡ Unstoppable |
💯 Perfect Round | 🤓 Democracy Nerd | 🌍 Global Citizen

#### 7. 📤 Share to LinkedIn / Twitter
Generates a shareable score card with:
- Quiz score and rank title
- Badges earned
- App link and hashtags
- One-click LinkedIn and Twitter/X share

#### 8. 🎓 Onboarding Flow
Multi-step first-visit modal:
1. Welcome screen
2. First-time voter? (personalizes language complexity)
3. Country selector (India 🇮🇳 / USA 🇺🇸)
4. State selector (India users)
5. Language preference (English / Hindi)
6. Confirmation → preferences saved to localStorage

#### 9. 🌙 Dark / Light Mode
- Toggle in top navigation
- CSS variables swap entire theme
- Preference persisted in localStorage
- All glassmorphism panels adapt to both modes

#### 10. ♿ Accessibility
- All interactive elements keyboard accessible
- Escape key closes all modals
- Voice input for users who prefer speaking
- Hindi language support for non-English speakers
- High contrast text on all backgrounds
- Screen reader friendly aria-labels on icon buttons

---

## 📁 Project Structure

```
src/
├── App.jsx                  # Main app, theme provider, onboarding gate
├── main.jsx                 # Entry point
├── index.css                # CSS variables, dark + light themes
├── components/
│   ├── Onboarding.jsx       # Multi-step onboarding modal
│   ├── ChatAssistant.jsx    # Floating chat + voice input + sources
│   ├── QuizMode.jsx         # Quiz UI with stats bar + badges
│   ├── GlossaryMode.jsx     # Glossary lookup card
│   ├── Timeline.jsx         # Election timeline visual
│   ├── ProgressTracker.jsx  # Stats bar, badges, score display
│   ├── ShareCard.jsx        # Share modal + social buttons
│   ├── StateSelector.jsx    # India state/UT dropdown
│   └── ThemeToggle.jsx      # Dark/light toggle
├── hooks/
│   ├── useVoiceInput.js     # Web Speech API hook
│   ├── useQuizStats.js      # localStorage quiz tracking
│   └── useTheme.js          # Theme toggle + persistence
├── utils/
│   ├── systemPrompt.js      # buildSystemPrompt() function
│   ├── shareUtils.js        # Share card text generator
│   └── geminiClient.js      # Gemini SDK + search grounding setup
└── constants/
    ├── states.js            # All 28 states + 8 UTs
    ├── badges.js            # Badge definitions + unlock conditions
    └── topics.js            # Quick topic chips per country/mode
```

---

## 🔧 Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 18 + Vite |
| AI Model | Google Gemini 2.0 Flash |
| Live Data | Google Search Grounding |
| Animations | Framer Motion |
| Styling | Pure CSS (Glassmorphism) |
| Voice Input | Web Speech API (native) |
| Storage | localStorage (no backend needed) |
| Deployment | Vercel + GitHub Pages |

---

## 🔐 Security Implementation

- **API key protection**: `VITE_GEMINI_API_KEY` stored in
  `.env.local`, never committed to repository
- **`.gitignore`**: `.env*` files excluded from all commits
- **No user data stored on servers**: all preferences and progress
  live in the user's own localStorage only
- **Nonpartisan guardrails**: system prompt hardcodes 7 rules
  preventing the AI from making political statements,
  predicting outcomes, or giving legal advice
- **Input sanitization**: user inputs are passed as plain text
  strings to the API, never executed
- **No authentication system**: no passwords, no PII collected,
  no accounts — zero data liability

---

## ⚡ Efficiency Choices

- **Gemini Flash model**: chose `gemini-2.0-flash` over Pro for
  faster response times and lower latency on user interactions
- **Single API call per interaction**: no chained or parallel
  calls — one user message = one Gemini call
- **localStorage over database**: eliminates backend entirely,
  zero server costs, instant read/write
- **CSS variables for theming**: one class toggle on `<html>`
  switches the entire theme with no JS re-renders
- **Lazy modal rendering**: onboarding and share modals only
  mount when needed, not on initial page load
- **Web Speech API**: voice input uses native browser API —
  no external SDK, no network calls for transcription

---

## 🧪 Testing & Validation

### Manual Test Cases Covered

| Feature | Test | Expected | Status |
|---|---|---|---|
| Chat | Send question about EVM | Structured AI response | ✅ |
| Quiz | Click "Start Quiz" | JSON parsed into MCQ UI | ✅ |
| Glossary | Type "NOTA" | Definition card renders | ✅ |
| Voice | Click mic, speak | Text appears in input | ✅ |
| State select | Choose Maharashtra | AI references ceo.maharashtra.gov.in | ✅ |
| Language | Switch to Hindi | AI responds in Devanagari | ✅ |
| Theme | Toggle dark/light | All panels adapt | ✅ |
| Onboarding | Clear localStorage, reload | Onboarding modal appears | ✅ |
| Reset | Click "Change Preferences" | Returns to onboarding | ✅ |
| Badge | Answer 1 question | "First Vote" badge awarded | ✅ |
| Share | Click LinkedIn share | Opens LinkedIn with pre-filled text | ✅ |
| Sources | Any chat response | Live source pills appear | ✅ |

### Edge Cases Handled
- Browser doesn't support Speech API → mic button hidden silently
- Gemini returns malformed quiz JSON → error caught, user prompted to retry
- No grounding sources returned → source section hidden (not empty)
- localStorage unavailable (private browsing) → app works without persistence
- Network failure on API call → friendly error message shown

---

## 📋 Assumptions Made

1. **Target users are Indian citizens** — India mode is the default,
   English is default language, state selector covers Indian states only

2. **Users have basic smartphone/laptop literacy** — the app doesn't
   explain what a browser or chat interface is

3. **Gemini Search Grounding is sufficient for live data** — no
   separate news API or government data scraper was built; we rely
   on Google Search Grounding for current information

4. **localStorage is available** — the app assumes a standard
   browser environment; behavior in highly restricted environments
   (some corporate browsers) may vary

5. **Election information is educational, not legal** — CivicGuide
   provides general civic education. For specific legal eligibility
   questions, users are redirected to ECI or official authorities

6. **Hindi support covers the broadest reach** — Hindi was chosen
   as the second language given it's the most widely spoken Indian
   language; regional language support (Tamil, Telugu, etc.) is
   noted as a future enhancement

---

## 🌍 Google Services Integration

| Google Service | How It's Used | Why It Matters |
|---|---|---|
| **Google Gemini 2.0 Flash** | Core AI engine for all responses | Powers chat, quiz, glossary modes |
| **Google Search Grounding** | Live web data in AI responses | Current ECI data, deadlines, news |
| **Google AI SDK** (`@google/generative-ai`) | API client library | Clean, maintained SDK integration |

Google Search Grounding is the most meaningful integration —
it transforms the AI from a static knowledge base into a
**live civic information system** that reflects today's
actual election landscape.

---

## 🚀 Getting Started (Local Development)

```bash
# Clone the repository
git clone https://github.com/sanskar-07-s/CivicGuide-AI.git
cd CivicGuide-AI

# Install dependencies
npm install

# Add your Gemini API key
echo "VITE_GEMINI_API_KEY=your_key_here" > .env.local

# Start development server
npm run dev

# Build for production
npm run build
```

Get your free Gemini API key at: https://aistudio.google.com/

---

## 🔮 Future Enhancements

- Regional language support (Tamil, Telugu, Bengali, Marathi)
- SMS-based access for users without smartphones
- Offline mode with cached election basics
- Integration with official ECI voter roll lookup API
- Candidate comparison tool (nonpartisan)
- Election day reminders via browser notifications

---

## 👨💻 Built By

**Sanskar** — Built for PromptWars Virtual by Hack2Skill  
Powered by Google Gemini AI + Google Antigravity  

*"Democracy works best when every citizen understands it."*

---

#PromptWars #Hack2Skill #BuildInPublic #GeminiAI #CivicTech
