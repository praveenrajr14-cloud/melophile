# 🎹 Melophile Music Academy

> **"The sound of love"** • Parassala | TVM  
> Instructor: **Praveen Raj R** (10+ Years Experience) • 150+ Students Mentored

A modern, high-performance web platform for **Melophile Music Academy**, featuring an interactive virtual piano synthesizer, 24-key triad chord library, interactive Circle of Fifths, structured curriculum courses, trial booking workflow, and 1-click WhatsApp & Instagram integrations.

---

## ✨ Features

- **Cinematic Animated Logo Intro:**
  - Staggered piano key strike cascade with Web Audio API sound synthesis (C4, E4, G4, B4).
  - High-definition charcoal badge with smooth letter-by-letter reveal and golden subtitle expansion.
  - Interactive ripple on hover across all logo placements throughout the site.
  - Replay button & skip controls.

- **Interactive 88-Key Virtual Piano Studio:**
  - Polyphonic Web Audio API synthesis with realistic acoustic envelope.
  - Computer keyboard bindings, touch/mouse support, and octave shifting.

- **Chord Library & Circle of Fifths:**
  - Full catalog of all **24 Major and Minor Triads** with instant audio playback and sheet notation info.
  - Interactive **Circle of Fifths** wheel with key signature breakdowns, relative minors, and harmonic navigation.
  - Progression basics to advanced theory guides + Trinity Grade subscription tiers.

- **Curriculum & Mentorship:**
  - Piano & Keyboard, Western Classical & Contemporary, Trinity College London Exam syllabus (Coming Soon), Music Theory & Ear Training.
  - Instructor profile: Praveen Raj R (10+ years teaching experience, 150+ students).

- **Direct Communication & Enrollment:**
  - Direct WhatsApp chat integration: [`+91 7356146076`](https://wa.me/917356146076)
  - Official Instagram profile: [`@melophileacademy_`](https://www.instagram.com/melophileacademy_)
  - Floating 1-click WhatsApp widget.
  - Trial class booking modal with instant confirmation.

---

## 🚀 Tech Stack

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite
- **Styling:** Tailwind CSS + Lucide Icons
- **Audio Engine:** Web Audio API (Synthesizer & Envelope)
- **Deployment:** Render Static Site (`render.yaml` pre-configured)

---

## 🛠️ Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```
Production assets are generated in `./dist`.

---

## 🌐 Deploy to Render

This repository includes a pre-configured `render.yaml` blueprint.

### Option 1: Automatic Blueprint (Recommended)
1. Push this repository to GitHub.
2. Log into [Render Dashboard](https://dashboard.render.com/).
3. Click **New +** -> **Blueprint**.
4. Select your `melophile` repository. Render will automatically detect `render.yaml` and configure:
   - **Type:** Static Site
   - **Build Command:** `npm run build`
   - **Publish Directory:** `./dist`
   - **Rewrite Rules:** `/*` -> `/index.html` (SPA routing)
5. Click **Apply** to deploy.

### Option 2: Manual Static Site on Render
1. In Render, select **New +** -> **Static Site**.
2. Connect your GitHub repository.
3. Set the following build settings:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
4. Under **Redirects/Rewrites**, add:
   - **Source:** `/*`
   - **Destination:** `/index.html`
   - **Action:** `Rewrite`
5. Click **Create Static Site**.

---

## 📍 Location & Contact

- **Studio:** Melophile Music Academy, Parassala, Thiruvananthapuram, Kerala, India
- **WhatsApp:** [+91 7356146076](https://wa.me/917356146076)
- **Instagram:** [@melophileacademy_](https://www.instagram.com/melophileacademy_?utm_source=qr&stkn=MWw5eXZxY2pqNzIwZQ==)
