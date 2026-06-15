# jobtracker

Open source job application lifecycle tracker. Built with React, Vite, TypeScript, and Supabase.

Track every application from first click to final decision — timeline events, rejection details, resume variants, compensation data, and offer tracking. Multi-user with Supabase auth. Your data lives in your own Supabase instance.

---

## Features

- Full application lifecycle: applied → screens → interviews → offer / rejection
- Per-application timeline with dated stage events and notes
- Rejection tracking: stage, category, reason (paste the email directly)
- Resume variant tracking (which version you sent for each role)
- Source tracking (LinkedIn, direct, referral, recruiter, etc.)
- Salary / comp expectation fields per application
- Offer details: amount, date, notes
- Dashboard stats: total, active, rejected, offers, rejection stage breakdown
- Search and filter by status
- Multi-user — each user sees only their own data (Supabase RLS)
- Sign up / sign in via email + password
- i18n ready — all UI strings in `src/i18n/locales/en.json`
- User-configurable resume variant suggestions via `src/config.json`

---

## Tech stack

- **React 18** + **Vite 7** + **TypeScript**
- **React Router v6**
- **react-i18next** — internationalization
- **Supabase** — auth + Postgres + row level security
- **date-fns** — date formatting
- **Netlify / Vercel / any static host** — deployment

---

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/your-username/jobtracker.git
cd jobtracker
npm install
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project (free tier works fine)
2. In the SQL Editor, run the contents of `supabase-schema.sql`
3. In Project Settings → API, copy your **Project URL** and **publishable key**

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key-here
```

### 4. Run locally

```bash
npm run dev
```

### 5. Deploy

**Netlify (recommended):**
Connect your GitHub repo in the Netlify dashboard. Build command: `npm run build`. Publish directory: `dist`. Add the two env vars under Site Settings → Environment Variables.

**Vercel:**
Add env vars in Project Settings → Environment Variables before deploying. Note: private repos require a Pro plan on team accounts — use a personal Vercel account or Netlify instead.

---

## Supabase auth setup

In your Supabase project → Authentication → URL Configuration:

- **Site URL:** your deployed app URL (e.g. `https://jobtracker-private.netlify.app`)
- **Redirect URLs:** add `https://your-app.netlify.app/**` and `http://localhost:5173/**`

Optional:
- Disable email confirmation for personal use: Authentication → Email → Confirm email → off
- Restrict signups to yourself: disable "Enable Sign Ups" after creating your account

---

## Customization

### Resume variant suggestions
Edit `src/config.json` to set your own resume variant suggestions. These populate the datalist in the application form — you can always type a custom value not in the list.

```json
{
  "resumeVariants": [
    "Staff Frontend Engineer",
    "Head of Front-End Engineering",
    "Engineering Manager"
  ]
}
```

### Translations / i18n
All user-facing strings live in `src/i18n/locales/en.json`. To add a new language:
1. Copy `en.json` to `src/i18n/locales/de.json` (or your locale)
2. Translate the values, keep the keys identical
3. Register the new locale in `src/i18n/index.ts`

---

## License

MIT — do whatever you want with it.