# Nilesh Kumar Metakota — Portfolio

Personal portfolio website built with **React**, **TypeScript**, **Vite**, and **CSS animations**.  
Designed to be recruiter-friendly, responsive, and easy to deploy on GitHub Pages, Vercel, or Netlify.

**Live site:** [https://nilesh17.vercel.app](https://nilesh17.vercel.app)

---

## Live demo

View the deployed portfolio here:

**[https://nilesh17.vercel.app](https://nilesh17.vercel.app)**

---

## Features

- Cinematic forest-green cover, oversized typography, and photo-free SVG project illustrations
- Fixed navigation, mobile menu, and active section highlighting
- Dark/light theme toggle with saved preference and support for reduced motion
- Sections: Hero, About, Skills, Experience, Projects, Education, Certifications, Achievements, Contact
- Resume download as `Nilesh_Metakota_2026.pdf`
- GitHub & LinkedIn links
- ROS 2 / Nav2 LiDAR navigation project linked to [github.com/nileshmetakota-17/Lidar_navigation](https://github.com/nileshmetakota-17/Lidar_navigation)
- Fitoo project linked to [github.com/nileshmetakota-17/Fitoo-](https://github.com/nileshmetakota-17/Fitoo-)
- SEO metadata in `index.html`

---

## Tech stack

| Tool | Purpose |
|------|---------|
| React 19 | UI |
| TypeScript | Type safety |
| Vite | Dev server & build |
| CSS | Responsive styling and SVG animations |
| Lucide React | Icons |

---

## Prerequisites

Install these before you start:

- [Node.js](https://nodejs.org/) **22.12+**
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Git](https://git-scm.com/) (for GitHub upload)

Check versions:

```bash
node -v
npm -v
git -v
```

---

## Project structure (GitHub-ready)

Upload everything in this folder **except** `node_modules` and `dist` (they are in `.gitignore`).

```
portfolio/
├── public/                          # Static assets (served as-is)
│   ├── favicon.svg
│   ├── Nilesh_Metakota_2026.pdf   # Resume download
│   └── icons.svg
├── src/
│   ├── components/
│   │   ├── NavBar.tsx
│   │   ├── ScrollProgress.tsx
│   │   ├── BackToTop.tsx
│   │   └── common/                  # Reusable UI (Button, cards, etc.)
│   ├── Portfolio.tsx                # Current page and sections
│   ├── portfolio.css                # Current design and responsive styles
│   ├── App.tsx                      # Previous design, retained for reference
│   ├── portfolioData.ts             # ← Edit resume content & links here
│   ├── main.tsx
│   └── index.css
├── index.html                       # SEO & page title
├── package.json
├── package-lock.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── eslint.config.js
├── .gitignore
└── README.md
```

---

## Run locally

### 1. Clone or open the project

If you already have the folder:

```bash
cd portfolio
```

If cloning from GitHub later:

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start development server

```bash
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

### 4. Production build (optional)

```bash
npm run build
```

Output folder: `dist/`

Preview the production build:

```bash
npm run preview
```

### 5. Lint (optional)

```bash
npm run lint
```

---

## Customize content

Edit **`src/portfolioData.ts`** to update:

- Name, title, contact info
- GitHub / LinkedIn URLs
- Experience, projects, education, certifications
- Resume path & download filename

Replace the resume PDF in:

`public/Nilesh_Metakota_2026.pdf`

---

## Upload to GitHub

### Step 1 — Create a new repository on GitHub

1. Go to [github.com/new](https://github.com/new)
2. Repository name example: `portfolio` or `nilesh-metakota-portfolio`
3. Choose **Public** (required for free GitHub Pages)
4. **Do not** add README, `.gitignore`, or license (this project already has them)
5. Click **Create repository**

### Step 2 — Initialize Git in your project folder

From inside the `portfolio` folder:

```bash
cd /path/to/portfolio

git init
git add .
git commit -m "Initial commit: personal portfolio website"
```

### Step 3 — Connect to GitHub and push

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your details:

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### Step 4 — Verify on GitHub

Refresh your repository page. You should see:

- `src/`, `public/`, `package.json`, `README.md`, etc.
- **No** `node_modules/` or `dist/` (ignored by `.gitignore`)

---

## Deploy

### Vercel (recommended)

1. Import the GitHub repo at [vercel.com](https://vercel.com)
2. **Framework preset:** Vite  
3. **Build command:** `npm run build`  
4. **Output directory:** `dist`  
5. Deploy

### Netlify

1. Import repo at [netlify.com](https://netlify.com)
2. **Build command:** `npm run build`  
3. **Publish directory:** `dist`  
4. Deploy

### GitHub Pages

For a project site at `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`:

1. Open `vite.config.ts` and set the base path:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/YOUR_REPO_NAME/', // e.g. '/portfolio/'
  plugins: [react(), tailwindcss()],
})
```

2. Build and deploy with GitHub Actions or push `dist` to the `gh-pages` branch.

**Settings → Pages → Source:** GitHub Actions or `gh-pages` branch.

For a user site (`YOUR_USERNAME.github.io` repo), use `base: '/'`.

---

## Environment notes

- No `.env` file is required for the default setup.
- Contact form uses **mailto** (opens the user’s email client).

---

## Author

**Nilesh Kumar Metakota**  
Junior ML Engineer · Pithapuram, India

- Portfolio: [nilesh17.vercel.app](https://nilesh17.vercel.app)
- GitHub: [@nileshmetakota-17](https://github.com/nileshmetakota-17)
- LinkedIn: [Nilesh_Metakota](https://www.linkedin.com/in/Nilesh_Metakota)
- Email: nilesh.metakota@gmail.com

---

## License

This project is for personal portfolio use. Add a license file if you plan to open-source it publicly.
