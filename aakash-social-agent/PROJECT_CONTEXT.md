# Aakash Social Media Agent — Project Context & Setup Guide

This document is a self-contained summary of the entire project. Keep it with the
project files — everything you need to pick this up later (on any account, any
computer) is here.

---

## 1. What this project is

A password-protected web tool for the Aakash Institute social media team with
three features:

1. **Daily trends** — scans Instagram, YouTube, and Twitter/X for trends from the
   past 7 days and suggests Aakash-specific (JEE/NEET) content angles for each.
2. **Reel hooks** — given any topic + format (Reel / Carousel / Static), generates
   5 scroll-stopping opening lines in different styles (Hinglish, curiosity gap,
   bold stat, relatable scenario, question).
3. **Week plan** — given a weekly focus (e.g. "exam result week", "counselling
   week"), generates a ready-to-execute 7-day Instagram content plan with post
   titles, captions, formats, and category tags.

The app has a small backend (`/api` folder) that calls the Anthropic API on your
behalf. Your API key lives only on the server (Vercel environment variables) —
never exposed to your team or end users. Access is gated by a single shared
password.

---

## 2. Background context (why this exists)

Ravinder works in social media marketing / ORM at Aakash Education Services Ltd.
(Aakash Institute), India's major JEE/NEET coaching brand. The goal: stay ahead
of social media trends and produce timely, relevant content (Reels, carousels,
captions) for Instagram, tied to the JEE/NEET academic calendar.

### Key exam-calendar context (as of June 2026)
- **JEE Advanced 2026 result** was announced June 1, 2026 — topper/rank-reveal
  content is highly relevant right after this.
- **JoSAA counselling** for JEE began June 2, 2026 onwards — counselling-guidance
  content (how it works, what to expect) is valuable during this window.
- **Re-NEET 2026** (re-conducted NEET exam) was scheduled for **June 21, 2026** —
  this created a distinct content arc: pre-exam revision tips → exam-day
  messaging → post-exam paper analysis. This week needed an empathetic,
  non-promotional tone given the cancelled-original-exam context.
- **NEET 2026 result** was expected within roughly a month of the (re-)exam —
  result-day content (rank reveals, counselling guidance) should be planned as
  reactive/flexible since the exact date can shift.

### Content strategy principles established in this project
- Deliver copy in clearly separated, ready-to-use sections (caption / hooks /
  hashtags etc.)
- Favor multiple variants over single suggestions
- Authentic, relatable tone over polished promo language — especially for
  student stories (Hinglish is welcome and often preferred)
- Be sensitive around exam-result weeks and the Re-NEET situation — empathetic
  tone, not promotional, during high-anxiety windows
- Content mix for the monthly calendar: student success stories / rank reveals,
  exam tips & study hacks, motivational/aspirational posts, faculty/expert
  content, and product/course promotions — rotated through the week.

A full 30-day Instagram content calendar (June 10 – July 10, 2026) was built
around this logic, organized into 5 weekly themes:
1. JEE Advanced aftermath + Re-NEET countdown
2. Re-NEET exam week (empathetic tone)
3. Post-NEET + JEE next cycle
4. NEET result build-up + topper content
5. Wrap-up + enrolment push

The "Week plan" tool in this app is designed to regenerate plans like this on
demand for any future week/theme.

---

## 3. Project files

```
aakash-social-agent/
├── index.html        ← Frontend (login screen + 3 tools, all UI/JS)
├── package.json       ← Project metadata (no dependencies needed)
├── .gitignore
├── README.md           ← Deployment instructions (condensed version)
└── api/
    ├── trends.js       ← Backend: scans social trends, returns content ideas
    ├── hooks.js         ← Backend: generates reel/post hooks
    └── week.js          ← Backend: generates 7-day content plans
```

All backend files call `https://api.anthropic.com/v1/messages` using
`model: "claude-sonnet-4-6"`, authenticated via the `ANTHROPIC_API_KEY`
environment variable. Every endpoint checks a shared password sent in the
`x-app-password` header against the `APP_PASSWORD` environment variable.

---

## 4. Full setup steps (start to finish)

### Step A — Get an Anthropic API key (use ANY email — personal is fine)

> **Important:** console.anthropic.com (the API/developer platform) is a
> completely separate system from claude.ai (this chat). Signing up there with
> your personal Gmail has zero effect on any other Claude account or
> conversation. Nothing needs to be migrated.

1. Go to **console.anthropic.com** and sign up (personal Gmail is fine).
2. Go to **Settings → Billing**, add a payment method (pay-as-you-go, no
   subscription). Optionally set a monthly spend limit.
3. Go to **API Keys**, click **Create Key**, name it e.g. `aakash-social-agent`.
4. **Copy the key immediately** (starts with `sk-ant-...`) — it's shown only
   once. Save it in a password manager or secure note.

### Step B — Put the project on GitHub

1. Go to **github.com**, sign up/log in (any email).
2. Click **+ → New repository** → name it `aakash-social-agent` → set to
   **Private** → **Create repository**.
3. Click **uploading an existing file**, then drag in ALL files/folders from
   this project — make sure `api/trends.js`, `api/hooks.js`, `api/week.js` stay
   inside an `api` folder.
4. Click **Commit changes**.

### Step C — Deploy on Vercel

1. Go to **vercel.com**, sign up/log in with GitHub (easiest).
2. **Add New → Project** → import `aakash-social-agent`.
3. Leave build settings as default.
4. Before deploying, add **Environment Variables**:
   | Name | Value |
   |---|---|
   | `ANTHROPIC_API_KEY` | your `sk-ant-...` key from Step A |
   | `APP_PASSWORD` | a password for your team, e.g. `Aakash2026social` |
5. Click **Deploy**. You'll get a live URL like
   `https://aakash-social-agent.vercel.app`.

### Step D — Use it

- Share the URL + `APP_PASSWORD` with your team.
- Open the URL, enter the password once, and use all three tabs.

### Updating later
Vercel → your project → **Settings → Environment Variables** → edit values →
go to **Deployments** → **Redeploy**.

---

## 5. Costs

Uses Claude Sonnet 4.6 via API. Each scan/hook/plan generation typically costs
a fraction of a cent to a few cents. For daily use by a small team, expect a few
dollars per month total. Monitor and cap spend in console.anthropic.com →
Settings → Billing.

---

## 6. Troubleshooting

- **"Incorrect password"** — check `APP_PASSWORD` in Vercel matches what's
  typed, and redeploy after any change.
- **401 error** — `ANTHROPIC_API_KEY` missing/incorrect in Vercel.
- **402 error** — add a payment method in console.anthropic.com → Billing.
- **Blank page / 404** — confirm `index.html` is at the repo root and the `api`
  folder structure was preserved on GitHub.

---

## 7. Possible future additions (not built yet)

- Saving generated content (trends, hooks, plans) to a history/log
- Exporting week plans as CSV or Google Sheets
- Adding more platforms (LinkedIn, Twitter ad copy)
- Multi-user accounts instead of one shared password
