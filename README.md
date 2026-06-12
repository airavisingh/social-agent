# Aakash Social Media Agent

A simple, password-protected web tool for your social media team with three features:

1. **Daily trends** — scans Instagram, YouTube, and Twitter/X for trends from the past week and suggests Aakash-specific content angles.
2. **Reel hooks** — generates 5 scroll-stopping opening lines for any topic and format.
3. **Week plan** — builds a ready-to-execute 7-day Instagram content plan.

This app has a small backend (in the `/api` folder) that talks to Claude on your behalf, so your API key is never exposed to your team or visitors.

---

## What you need before you start

- A free [GitHub](https://github.com) account
- A free [Vercel](https://vercel.com) account (you can sign up using your GitHub account)
- An Anthropic API key from [console.anthropic.com](https://console.anthropic.com) (see Part 1 below)

---

## Part 1 — Get your Anthropic API key

1. Go to **console.anthropic.com** and sign in (or create an account).
2. Go to **Settings → Billing** and add a payment method. The API is pay-as-you-go — you won't be charged unless you use it, and you can set a monthly spend limit here.
3. Go to **API Keys** (usually under Settings), click **Create Key**, name it something like `aakash-social-agent`, and **copy the key immediately**. It starts with `sk-ant-...` and is shown only once — save it somewhere safe (like a password manager or a secure note).

---

## Part 2 — Upload this project to GitHub (no coding needed)

1. Go to [github.com](https://github.com) and sign in (create a free account if you don't have one).
2. Click the **+** icon in the top right → **New repository**.
3. Name it `aakash-social-agent`, keep it **Private** (recommended), and click **Create repository**.
4. On the new repo page, click **uploading an existing file**.
5. Drag and drop ALL the files and folders from this project (including the `api` folder with its 3 files, `index.html`, `package.json`, `.gitignore`) into the upload box.
   - Make sure the folder structure is preserved — `api/trends.js`, `api/hooks.js`, and `api/week.js` should stay inside an `api` folder.
6. Scroll down and click **Commit changes**.

---

## Part 3 — Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up / log in using your **GitHub account** (easiest option).
2. Click **Add New... → Project**.
3. Find your `aakash-social-agent` repo in the list and click **Import**.
4. On the configuration screen, leave everything as default (Vercel will auto-detect this as a static project with serverless functions).
5. Before clicking Deploy, expand **Environment Variables** and add these two:

   | Name | Value |
   |------|-------|
   | `ANTHROPIC_API_KEY` | Your `sk-ant-...` key from Part 1 |
   | `APP_PASSWORD` | Any password you want your team to use (e.g. `Aakash2026social`) |

6. Click **Deploy**.
7. Wait ~1 minute. Vercel will give you a live URL like `https://aakash-social-agent.vercel.app` — this is your tool!

---

## Part 4 — Share it with your team

- Send your team the Vercel URL and the password you set as `APP_PASSWORD`.
- They open the link, enter the password once, and can use all three tools.
- The password is checked on every request via a secure backend — your `ANTHROPIC_API_KEY` is never visible to anyone using the tool.

---

## Updating the password or API key later

1. Go to your project on [vercel.com](https://vercel.com).
2. Go to **Settings → Environment Variables**.
3. Edit `APP_PASSWORD` or `ANTHROPIC_API_KEY` as needed.
4. Go to the **Deployments** tab and click **Redeploy** on the latest deployment for the change to take effect.

---

## Costs

This uses Claude Sonnet via the Anthropic API. Each trend scan, hook generation, or week plan typically costs a fraction of a cent to a few cents depending on usage. For a small team using this daily, monthly costs are usually a few dollars at most. You can monitor usage and set spend limits anytime in console.anthropic.com under **Settings → Billing**.

---

## Troubleshooting

- **"Incorrect password" on login** — double-check the `APP_PASSWORD` environment variable in Vercel matches what you're typing, and that you redeployed after setting it.
- **"Anthropic API error (401)"** — your `ANTHROPIC_API_KEY` is missing or incorrect in Vercel's environment variables.
- **"Anthropic API error (402)"** — you need to add a payment method in console.anthropic.com under Billing.
- **Blank page or 404** — make sure `index.html` is in the root of the repo (not inside a subfolder) and the `api` folder structure was preserved when uploading to GitHub.
