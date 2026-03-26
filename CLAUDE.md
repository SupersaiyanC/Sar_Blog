# Sar_Blog — Claude Code Context

## Project Overview
A travel and lifestyle blog built for Sarita. She is a non-technical user who manages all content through the CMS admin panel. The site is owned and maintained by Rayaan.

**Live site:** https://fastidious-pudding-f14aa7.netlify.app  
**Admin panel:** https://fastidious-pudding-f14aa7.netlify.app/admin  
**GitHub repo:** https://github.com/SupersaiyanC/Sar_Blog

---

## How to Respond
Always explain like you're talking to someone with no coding background. For every response, include:
- **What I just did** — plain English, no jargon
- **What you need to do** — step by step, assume they've never done this before
- **Why** — one sentence explaining what it does or why it matters
- **Next step** — one clear action
- **Errors** — if something went wrong, explain it simply and say exactly how to fix it

When a task involves external tools (Netlify, GitHub, localhost:3000, etc.), walk through exactly where to find what's needed. Be concise — less is more.

---

## Before Writing Any Code
1. Read `CLAUDE.md` (this file) and `project_specs.md` before taking any action
2. If `project_specs.md` doesn't exist, create it first
3. Update `project_specs.md` to note what changed and why

**Then just do it.** No approval needed — start coding immediately after reading the files.

Use your best judgment. If something looks broken, fix it. If something could be improved as part of the task, do it. You don't need to ask — just make the call and explain what you did afterward.

---

## Design Rules
You are a senior UI designer and frontend developer. When making any visual changes:
- Match the existing warm, lifestyle aesthetic of the blog — do not introduce dark themes, heavy gradients, or corporate-looking layouts
- Use proper spacing and visual hierarchy
- No emoji used as icons
- No inline styles — use Tailwind classes only
- No generic gradients or default framework styling
- Mobile-first — every UI change must look good on a phone
- Prefer subtle, clean improvements over flashy redesigns
- If changing the color palette or layout, use your best judgment to stay true to the blog's warm lifestyle vibe

---

## Tech Stack
- **Framework:** Next.js (static export)
- **CMS:** Decap CMS (Git-based, content stored as Markdown files)
- **Styling:** Tailwind CSS
- **Hosting:** Netlify (free tier)
- **Auth:** Netlify Identity (invite-only)
- **Git Gateway:** Enabled (required for CMS to commit to GitHub)

---

## Local Development
```bash
cd /Users/rayaancheema/Desktop/Sar_Blog
npm install       # first time only
npm run dev       # starts dev server at http://localhost:3000
```

Build for production:
```bash
npm run build
```

---

## Deployment
- Deploys automatically via Netlify when commits are pushed to `main`
- **Each production deploy costs 15 Netlify credits** — avoid unnecessary deploys
- Build settings: `npm run build` / output dir: `out`

### ⚠️ Critical — Netlify Build Credits
The free tier has a limited monthly credit budget. To avoid burning credits:
- **Do not push trivial commits to main**
- Use the **Decap CMS editorial workflow** (draft → review → ready → publish)
- Drafts are saved as Git branches and do NOT trigger production deploys
- Only publishing (merging to main) triggers a build

---

## CMS Configuration
- Config file: `public/admin/config.yml`
- Editorial workflow is enabled: `publish_mode: editorial_workflow`
- Content is stored as Markdown in the `content/posts/` directory (or equivalent)
- Images are uploaded through the admin panel

---

## Key Constraints
- **Sarita is the sole content editor** — she has no technical knowledge, so any CMS-facing changes must remain simple and user-friendly
- **Do not break the admin login flow** — Netlify Identity widget must remain functional at `/admin`
- **Mobile responsiveness is important** — Sarita may post from her phone
- **Keep deploys minimal** — Always prefer draft workflows over direct commits when writing content

---

## Known Issues / History
- Early versions had no draft/save feature — every CMS save triggered a production deploy, draining credits fast. This was fixed by enabling the Decap CMS editorial workflow.
- Netlify Identity login was broken at one point (no forgot password link, no proper modal). Fixed by updating `public/admin/index.html` and `app/layout.tsx` to properly load the Identity widget.

---

## Users
- **Sarita** — content editor (Netlify Identity invite, no GitHub access needed)
- **Rayaan** — site owner/admin (GitHub access, Netlify dashboard access)