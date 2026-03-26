# Sorry Semi ❤️

A personalized, interactive, and animated apology web application built with React, Vite, Framer Motion, and a Node.js backend for persistence.

## ✨ Features

- **🌸 Premium Pink Theme**: A soft, glassmorphism-styled interface designed to be visually stunning.
- **🐷 Stationary Rotating Pigs**: 15 cute pig illustrations scattered across the screen, rotating in place at varying speeds.
- **💖 High-Performance Heart Shower**: A custom Canvas-based particle system that triggers an explosion of 1000+ hearts from the sides upon forgiveness.
- **🎻 Automatic WhatsApp Redirect**: Automatically opens a WhatsApp chat window with a romantic pre-filled message 3 seconds after forgiveness.
- **🎵 Music Integration**: Built-in audio player for romantic background music (Recommended: "Perfect" by Ed Sheeran).
- **🕵️ Secret Love Tracker**: A hidden dashboard to monitor all forgiveness events, stored persistently in a JSON file.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Framer Motion, Lucide Icons, Tailwind CSS.
- **Backend**: Node.js, Express, CORS.
- **Storage**: Local JSON file (`forgiveness.json`).

## 🚀 Deployment to Vercel

This project is optimized for deployment as a single Vercel project.

### 1. Persistent Storage (Vercel KV)

Since Vercel is stateless, your `forgiveness.json` history will reset on every deploy. To keep it forever:

1. Go to your Vercel Dashboard.
2. Select your project and go to **Storage**.
3. Create a **KV (Redis)** database.
4. Connect it to your project. Vercel will automatically add the necessary environment variables (`KV_REST_API_URL`, etc.).

### 2. Manual Setup

If you're not using Vercel's Git integration:

```bash
npm install -g vercel
vercel
```

## 🛠️ Tech Stack Expansion

- **Persistence Layer**: Vercel KV (Redis) for production.
- **Serverless**: Vercel Functions (`api/` directory).

---
Made with ❤️ for Semi.
