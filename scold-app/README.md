# Scold 🔥 — Your Safe Space to Let It Out

> An AI-powered emotional support & venting app. Scold anyone safely — your boss, colleague, or even a stranger — with an AI best friend who listens, doesn't judge, and helps you process.

![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20iOS%20%7C%20Android-10B981?style=for-the-badge)
![Built with](https://img.shields.io/badge/Built%20with-Expo%20%7C%20React%20Native-06B6D4?style=for-the-badge)
![AI](https://img.shields.io/badge/AI-Google%20Gemini%202.5%20Flash-F59E0B?style=for-the-badge)

## ✨ Features

- **🤖 AI Best Friend** — Not a therapist, not a chatbot. A genuine friend who listens, validates, and helps you process emotions
- **👤 Person Management** — Add people you want to vent about (Boss, Manager, Colleague, Family, Friend, etc.)
- **🕵️ Stranger Mode** — Had a run-in with someone you'll never see again? Scold them anonymously
- **⚖️ Legal Awareness** — AI-powered guidance on workplace rights, POSH Act, harassment laws
- **🔄 Pattern Analysis** — The AI detects recurring themes and gently helps you identify patterns
- **🔒 Private & Secure** — All conversations stored locally on your device
- **🌙 Premium Dark Mode** — ChatGPT-inspired UI with beautiful dark theme
- **📱 Cross-Platform** — One codebase, runs on Web, iOS, and Android

## 🚀 Quick Start

### Prerequisites

- Node.js v18+ 
- npm or yarn
- Expo CLI (installed automatically via npx)
- A Google Gemini API key ([Get one free](https://aistudio.google.com))

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/scold-app.git
cd scold-app

# 2. Install dependencies
npm install

# 3. Configure your Gemini API key
# Edit .env and replace 'your_gemini_api_key_here' with your actual key
echo "EXPO_PUBLIC_GEMINI_API_KEY=your_actual_api_key" > .env

# 4. Start the app
npm run web      # For web browser
npm run ios      # For iOS Simulator
npm run android  # For Android Emulator
```

## 🏗️ Architecture

### Tech Stack

| Layer | Technology |
|---|---|
| Framework | Expo (React Native) SDK 57 |
| Navigation | Expo Router v5 (file-based) |
| AI Engine | Google Gemini 2.5 Flash |
| State Management | Zustand v5 |
| Auth | AsyncStorage-based (extendable to Firebase) |
| Styling | React Native StyleSheet |
| Animations | React Native Animated API |

### Project Structure

```
scold-app/
├── src/
│   ├── app/                    # Expo Router screens
│   │   ├── _layout.tsx         # Root layout
│   │   ├── (auth)/             # Auth screens (login, signup)
│   │   └── (app)/              # App screens (home, chat, settings)
│   ├── components/             # Reusable UI components
│   │   ├── chat/               # Chat bubbles, input, typing indicator
│   │   ├── common/             # Button, Input, Avatar, Spinner
│   │   └── persons/            # Person cards, add form
│   ├── services/               # Business logic
│   │   ├── gemini/             # Gemini AI client, prompts, analyzer
│   │   ├── legal/              # Legal context for AI prompts
│   │   └── auth.ts             # Authentication service
│   ├── store/                  # Zustand state stores
│   ├── theme/                  # Design system (colors, typography)
│   ├── types/                  # TypeScript interfaces
│   ├── hooks/                  # Custom React hooks
│   └── utils/                  # Helper functions
├── assets/                     # Images, icons
├── app.json                    # Expo configuration
└── package.json                # Dependencies
```

### AI System Prompt Architecture

The AI uses a **5-layer system prompt** — zero hardcoded responses:

1. **Core Persona** — Warm, non-judgmental best friend personality
2. **Safety Rails** — Never suggests violence, harm, or illegal actions
3. **Contextual Behavior** — Adapts based on relationship type (Boss vs Friend vs Stranger)
4. **Legal Awareness** — POSH Act, workplace harassment, employee rights
5. **Pattern Recognition** — Detects recurring themes and emotional trajectories

## 📱 Screens

| Screen | Description |
|---|---|
| Login / Signup | Secure authentication with email/password |
| Home | Greeting, quick-start cards, recent conversations |
| Chat | Full ChatGPT-style interface with streaming AI responses |
| People | Manage persons you want to vent about |
| Settings | Profile, theme, location, sign out |
| Legal Info | POSH Act, employee rights, helpline numbers |

## 🔑 Getting Your Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com)
2. Sign in with your Google account
3. Click **"Get API key"** in the sidebar
4. Click **"Create API key"**
5. Copy the key and paste it in your `.env` file

> The free tier includes generous rate limits for personal use.

## 🛡️ Safety & Ethics

Scold is built with strong safety guardrails:

- ❌ Never suggests violence or illegal retaliation
- ❌ Never encourages self-harm (provides crisis helplines if detected)
- ❌ Never generates content for harassment or stalking
- ✅ Redirects destructive impulses toward constructive processing
- ✅ Provides legal awareness and actionable steps
- ✅ All conversations stay on-device (privacy-first)

## 📄 License

MIT License — build, modify, and share freely.

---

**Built with ❤️ and a healthy dose of catharsis.**
