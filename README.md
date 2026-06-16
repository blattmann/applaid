# ApplAId

A self-hosted job application lifecycle tracker built with React, Vite, TypeScript, and Supabase.

ApplAId helps you track every application from the first click to the final decision. It keeps applications, timeline events, recruiter notes, rejection details, resume variants, compensation expectations, and offer information in one place.

The app is multi-user and uses Supabase Auth plus row-level security, so every user only sees their own data. Your data lives in your own Supabase project.

---

## What this app does

ApplAId is designed for people who want a structured overview of their job search instead of scattered notes, spreadsheets, and email threads.

You can track:

* Applications from applied to final decision
* Screening calls, interviews, offers, and rejections
* Timeline events per application
* Rejection reasons and rejection categories
* Resume variants used for each application
* Application sources such as LinkedIn, direct, referral, or recruiter
* Salary and compensation expectations
* Offer details
* Dashboard statistics
* Active, rejected, and completed applications

---

## Tech stack

* React 18
* Vite 7
* TypeScript
* React Router v6
* react-i18next
* Supabase Auth
* Supabase Postgres
* Supabase Row Level Security
* date-fns
* Netlify, Vercel, or any static hosting provider

---

## Project structure

```txt
.
├── public/
├── src/
│   ├── components/
│   ├── config.json
│   ├── i18n/
│   │   └── locales/
│   │       └── en.json
│   ├── pages/
│   ├── services/
│   └── main.tsx
├── supabase-schema.sql
├── .env.example
├── package.json
└── README.md
```

---

## Requirements

Before running the project, make sure you have:

* Node.js installed
* npm installed
* A Supabase project
* The Supabase project URL
* The Supabase publishable key

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/blattmann/applaid.git
cd applaid
npm install
```

---

### 2. Create the Supabase database

Create a new Supabase project at supabase.com.

Then open the Supabase SQL Editor and run the contents of:

```txt
supabase-schema.sql
```

This creates the required tables, relationships, and row-level security policies.

---

### 3. Configure environment variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Then edit `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key-here
```

You can find both values in Supabase under:

```txt
Project Settings → API
```

---

## Run the web app locally

Start the local development server:

```bash
npm run dev
```

Vite will print the local URL in the terminal, usually:

```txt
http://localhost:5173
```

Open that URL in your browser.

---

## Build the app

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## Supabase Auth setup

In Supabase, go to:

```txt
Authentication → URL Configuration
```

Set the site URL to your deployed app URL, for example:

```txt
https://your-app.netlify.app
```

Add redirect URLs for local development and production:

```txt
http://localhost:5173/**
https://your-app.netlify.app/**
```

For personal use, you can optionally disable email confirmation:

```txt
Authentication → Email → Confirm email → Off
```

If you want to keep the app private, create your own account first and then disable public signups:

```txt
Authentication → Providers → Email → Enable Sign Ups → Off
```

---

## Deploy the web app

### Netlify

Recommended settings:

```txt
Build command: npm run build
Publish directory: dist
```

Add these environment variables in Netlify:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key-here
```

---

### Vercel

Recommended settings:

```txt
Framework preset: Vite
Build command: npm run build
Output directory: dist
```

Add the same environment variables in Vercel before deploying:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key-here
```

---

## Configuration

### Resume variant suggestions

Resume variant suggestions are stored in:

```txt
src/config.json
```

Example:

```json
{
  "resumeVariants": [
    "Senior Frontend Engineer",
    "Staff Frontend Engineer",
    "Engineering Manager"
  ]
}
```

These values are suggestions only. You can still enter a custom resume variant in the application form.

---

## Internationalization

All user-facing strings are stored in:

```txt
src/i18n/locales/en.json
```

To add another language:

1. Copy `src/i18n/locales/en.json`
2. Rename the copy, for example `de.json`
3. Translate the values
4. Keep the keys unchanged
5. Register the locale in `src/i18n/index.ts`

---

## Data ownership

ApplAId is designed to run against your own Supabase project.

That means:

* You own the database
* You control authentication
* You control deployment
* You control access
* No third-party job tracking service owns your data

---

## License

MIT
