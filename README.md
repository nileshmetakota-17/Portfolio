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

- Graphite and orange robotics portfolio with an interactive navigation study and custom SVG project illustrations
- Sticky navigation, mobile menu, and active section highlighting
- Dark/light theme toggle with saved preference and support for reduced motion
- Filterable project showcase, robotics expertise, experience, about, education, certifications, contact, and email-only resume delivery
- Email-only resume delivery with PDF attachment, delivery status, and owner notifications
- GitHub & LinkedIn links
- ROS 2 / Nav2 LiDAR navigation project linked to [github.com/nileshmetakota-17/Lidar_navigation](https://github.com/nileshmetakota-17/Lidar_navigation)
- Fitoo project linked to [github.com/nileshmetakota-17/Fitoo-](https://github.com/nileshmetakota-17/Fitoo-)
- VIO offline visual place recognition prototype linked to [github.com/nileshmetakota-17/VIO](https://github.com/nileshmetakota-17/VIO)
- Email contact with copy-to-clipboard and mailto form
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
- Resume request button labels

Replace the resume PDF in:

`private/Nilesh_Metakota_2026.pdf`

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

## Resume email setup

The PDF is stored at `private/Nilesh_Metakota_2026.pdf`, bundled only with the request API, and excluded from the public/static build. All resume links open the email form. Deploy the changes to remove previously published website downloads. Git history may still contain older copies.

### Gmail mode: no custom domain required

1. Enable Google 2-Step Verification for the sender account, then create a Google [App Password](https://myaccount.google.com/apppasswords) named `Portfolio Resume`. Use the App Password, never the regular Google password.
2. Set these server variables in `.env.local` and in Vercel's **Production** environment:

```env
RESUME_EMAIL_PROVIDER=gmail
GMAIL_USER=nilesh.metakota@gmail.com
GMAIL_APP_PASSWORD=YOUR_GOOGLE_APP_PASSWORD
RESUME_OWNER_EMAIL=nilesh.metakota@gmail.com
UPSTASH_REDIS_REST_URL=YOUR_UPSTASH_REST_URL
UPSTASH_REDIS_REST_TOKEN=YOUR_UPSTASH_REST_TOKEN
```

3. Keep the existing Upstash database and regular REST token. It supplies shared request limits and status storage.
4. Push the code and redeploy Vercel after saving environment changes. Restart `npm run dev` after local changes. Resend API keys, sender domains, and webhook secrets are not required in Gmail mode; an old Resend webhook is ignored.
5. Test with a different inbox you control, checking both inbox and spam. Gmail sends to addresses outside the sender account, subject to Google's sending limits and anti-abuse checks. Google may reject SMTP sign-ins based on account settings or server location; check Vercel's server logs for the coarse error class, without publishing credentials.

Gmail SMTP acceptance means the message was accepted for sending, **not confirmed delivered to the recipient's inbox**. The UI says sent, never delivered. The owner notification retains the visitor email and IST date/time, but accurately states `Resume accepted for sending by Gmail. Inbox delivery is not confirmed.` Gmail does not provide the Resend delivery webhook. A mailbox rejected immediately with SMTP code `5.1.1` produces a nonexistent-address error; a later Gmail bounce may arrive in the sender inbox and cannot automatically update this website. Do not treat acceptance as proof that a mailbox exists.

After Gmail accepts the PDF, the visitor receives a sent response immediately. Status persistence and the owner notification run as background work using Vercel `waitUntil`, bounded by the function timeout; they do not keep the form loading. Gmail success is final in the browser and is not overwritten by notification/status timeouts. The background task retries a failed owner notification once. If both attempts fail, a pending notification is retained for 24 hours; status API requests can retry it in the background, but the browser does not automatically poll after Gmail success. A Redis lock avoids concurrent sends, but SMTP has no provider idempotency guarantee; a failure after SMTP acceptance can still cause a duplicate notification on retry. Retries are not a background delivery worker.

### Optional Resend mode

The original confirmed-delivery workflow is retained. Set `RESUME_EMAIL_PROVIDER=resend`, `RESEND_API_KEY`, `RESUME_FROM_EMAIL`, `RESEND_WEBHOOK_SECRET`, and the two Upstash variables. Owner notifications default to `RESUME_OWNER_EMAIL`. For unrestricted recipients, verify a domain you own in Resend and use an address on that domain. The test sender `onboarding@resend.dev` can only send to the Resend account email.

Register `https://YOUR_PORTFOLIO_HOST/api/resume-delivered` in Resend for `email.delivered`, `email.bounced`, `email.failed`, and `email.suppressed`. Only signed, confirmed resume delivery events trigger the successful-delivery owner notification. Notification retries use provider idempotency and a permanent Redis email-ID marker. Resend delivery means acceptance by the recipient mail server, not a read receipt. Local Resend webhooks require a public HTTPS tunnel; Gmail mode does not need a webhook or tunnel.

### Validation and operation

The server validates email syntax and DNS mail routing before sending. Domain existence cannot prove mailbox existence. Temporary DNS errors produce a retry message, and full inboxes/policy failures are not labelled nonexistent. Rate limits are 10 per recipient and 20 per IP per 10 minutes, plus 100 overall per hour; counters begin with the first request. The v2 rate-key namespace replaces the previous one-hour visitor counters on deployment. IP and email rate keys are hashed. Status tokens are unguessable and expire after 24 hours. Pending Gmail notification records contain the recipient email and submission timestamp until success or expiry; protect Redis credentials accordingly.

Run `npm test` and `npm run build`. Tests use mock email providers; they never send real email. `npm run dev` includes the API locally; `npm run preview` is static-only. Serverless hosting is required for email sending. Keep credentials in `.env.local` or hosting environment settings, never in `.env.example` or `VITE_` variables.

Provider references: [Google App Passwords](https://support.google.com/accounts/answer/185833), [Nodemailer SMTP](https://nodemailer.com/smtp), [Resend delivery events](https://resend.com/docs/webhooks/emails/delivered), [Vercel file bundling](https://vercel.com/kb/guide/how-can-i-use-files-in-serverless-functions).

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
