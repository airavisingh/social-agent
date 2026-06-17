# Aakash Social Media Command Centre — V2 Deploy Guide

## What changed from V1

V2 is a single HTML file with NO backend required.
The Anthropic API key is entered directly on the login screen by your team.
This means:

- No Vercel environment variables needed
- No server-side code
- No API folder
- Just upload one file and you're live

## How login works in V2

Instead of a shared team password, each team member enters their own Anthropic API key on the login screen.
The key is stored in browser session storage and used directly to call the Claude API.
This means each person uses their own API key and their own billing.

## Deploy to Vercel (2 minutes)

1. Go to vercel.com and log in with GitHub
2. Click Add New → Project
3. Instead of importing a repo, click "Deploy from template" or use the Vercel CLI
   OR — simplest option:
   - Create a new GitHub repo (call it aakash-command-centre-v2)
   - Upload just the single index.html file
   - Import that repo in Vercel
   - Click Deploy — no environment variables needed
4. Your live URL is ready

## Modules included

M1  Morning Brief — daily AI-generated agenda with priority scores
M1b Executive Dashboard — opportunities, events, content inventory
M2  Content Calendar Engine — weekly plans with pillars, hooks, formats
M3  Trends & News Intelligence — live scan with NTA updates
M4  Content Opportunity Engine — convert trends into Reel+Carousel+Static
M5  Reel Hook Generator — 8 hooks per topic (Curiosity/Emotional/Hinglish etc.)
M6  Carousel Generator — 6-slide structure with copy, design notes, save hooks
M7  Competitor Intelligence — Allen, PW, Unacademy, Vedantu analysis
M8  Analytics & Reporting — insights + agent recommendations
M9  Content Idea Vault — 30 ready-to-use ideas, refreshable

## System prompt baked in

Every Claude call includes this context:
- Aakash Institute is India's leading JEE/NEET coaching brand
- Think as: Social Media Manager + Content Strategist + Trend Analyst + Creative Director
- Primary goal: "What should Aakash post next and why?"
- Content pillars, brand voice, and avoid-list are all pre-loaded
