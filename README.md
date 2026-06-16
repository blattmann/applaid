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
packages/
  core/          — shared types, hooks, Supabase client, i18n, config
  web/           — React + Vite web application
    src/
    supabase-schema.sql
    .env.example
  mobile/        — Expo React Native mobile app
    src/
    .env.example
README.md
package.json
```

---

## Requirements

Before running the project, make sure you have:

* Node.js 20+ installed (required for Expo SDK 54)
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

*Note: `npm install` from the root installs the web and core packages only. The mobile app requires a separate installation (see "Run the mobile app" below):*

```bash
cd packages/mobile && npm install --legacy-peer-deps
```

---

### 2. Create the Supabase database

Create a new Supabase project at supabase.com.

Then open the Supabase SQL Editor and run the contents of:

```txt
packages/web/supabase-schema.sql
```

This creates the required tables, relationships, and row-level security policies.

---

### 3. Configure environment variables

Copy the example environment file for the web app:

```bash
cp packages/web/.env.example packages/web/.env.local
```

Then edit `packages/web/.env.local`:

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
npm run web
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
cd packages/web && npm run preview
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

Vercel has known issues injecting VITE_* environment variables into the build for Vite projects, particularly on team accounts.

The reliable workaround is to commit a .env.production file to the repo:

1. Copy packages/web/.env.example to packages/web/.env.production
2. Fill in your real values
3. Remove .env.production from .gitignore in packages/web (it needs to be committed so Vite picks it up at build time)
4. Deploy to Vercel — Vite reads .env.production automatically during vite build

Note: Your publishable key is a public key by design — it is safe to commit. Supabase Row Level Security handles data access control.

Also note: On Vercel Hobby plan, private GitHub repos can only be deployed from a personal account, not a team account. If you hit a "Hobby Plan does not support collaboration" error, either use Netlify instead or deploy from your personal Vercel account.

## Run the mobile app

The mobile app is in packages/mobile and uses Expo with React Navigation.

### Setup

1. Install dependencies:
```bash
cd packages/mobile
npm install --legacy-peer-deps
```

2. Copy the environment file:
```bash
cp .env.example .env
```

3. Fill in packages/mobile/.env:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=your-publishable-key-here
```

4. Start the Expo development server:
```bash
npx expo start
```

5. Scan the QR code with Expo Go on your device (iOS or Android).
   Expo Go must be SDK 54 or later.

### Notes

- The mobile app shares business logic with the web app via packages/core
- Authentication uses the same Supabase project as the web app
- No Apple Developer account or Google Play account required for local development via Expo Go

---

## Configuration

### Resume variant suggestions

Resume variant suggestions are stored in:

```txt
packages/core/src/config.json
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
packages/core/src/i18n/locales/en.json
```

To add another language:

1. Copy `packages/core/src/i18n/locales/en.json`
2. Rename the copy, for example `de.json`
3. Translate the values
4. Keep the keys unchanged
5. Register the locale in `packages/core/src/i18n/index.ts`

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
