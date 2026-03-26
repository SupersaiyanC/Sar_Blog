# Project Specs — Email Newsletter (Brevo) + RSS Feed

## What this change does and why
Adds an email newsletter subscription feature so visitors can subscribe to new post notifications. When a new post is published, Brevo's RSS campaign automation picks it up from `/feed.xml` and sends an email to all subscribers automatically. No spam — only new post notifications.

**Service:** Brevo free tier (300 emails/day, unlimited contacts, no credit card)
**Brevo contact list:** List ID 2
**RSS feed:** `/feed.xml` (generated at build time)
**Subscribe endpoint:** `/api/subscribe` → redirects to Netlify Function `netlify/functions/subscribe.js`

## Files added
- `scripts/generate-rss.js` — generates `public/feed.xml` at build time (runs via `npm run prebuild`)
- `netlify/functions/subscribe.js` — serverless function that adds emails to Brevo via the API
- `components/NewsletterSignup.tsx` — client component with two variants: full (homepage) and compact (footer)
- `.env.local` — Brevo API key and list ID (not committed to git — `.env*.local` is gitignored)

## Files changed
- `netlify.toml` — added `[functions]` directory, `[dev]` config for local testing, and `/api/subscribe` redirect
- `app/page.tsx` — added `<NewsletterSignup />` section above the CTA
- `components/Footer.tsx` — added `<NewsletterSignup compact />` above the copyright line
- `package.json` — added `"prebuild": "node scripts/generate-rss.js"` so RSS generates before every build

## Local testing (important)
The subscribe function is a Netlify serverless function, which does NOT run via `npm run dev`. To test the actual email subscription locally:
1. Install Netlify CLI: `npm install -g netlify-cli`
2. Link the site: `netlify link` (one-time)
3. Run: `netlify dev` → opens at **localhost:8888**
4. The form UI is visible at localhost:3000 (npm run dev) but the subscribe button needs localhost:8888 to actually call the function

## Netlify env vars to add before deploying
In Netlify dashboard → Site settings → Environment variables, add:
- `BREVO_API_KEY`
- `BREVO_LIST_ID`

## Brevo RSS campaign automation (set up in Brevo dashboard, not in code)
See setup steps in the conversation. The RSS feed URL to use is:
`https://fastidious-pudding-f14aa7.netlify.app/feed.xml`

---

# Project Specs — Nature-Inspired Color Palette Update

## What this change does and why
Replaces the current warm, earthy palette (sand/terracotta/sage) with a soft, nature-inspired palette that feels like **mist, sea salt, and alpine sage** — muted grays, dusty blues, and muted greens. No layout, spacing, fonts, or structural changes.

**New palette reference colors:**
| Name | Hex | Role |
|---|---|---|
| `mist` | `#C2CAD0` | Replaces `sand` — backgrounds, body text shades |
| `sea-salt` | `#97AFB9` | Replaces `terracotta` — accents, CTAs, category badges, links |
| `alpine-sage` | `#8A9A8E` | Replaces `sage` — footer, secondary buttons |

---

## Files affected

### 1. `tailwind.config.js`
- Add three new color scales: `mist`, `sea-salt`, `alpine-sage`
- Each will have `50`–`900` shades derived from the reference hex so existing shade-based classes (e.g. `-50`, `-800`) continue to work
- The existing `sand`, `terracotta`, `sage` scales remain untouched (no breaking change to any content-editable files)

### 2. `app/globals.css`
Replace all hardcoded hex color values in `.prose-custom` with the new palette equivalents:
| Old value | Was | New value | Is |
|---|---|---|---|
| `#5f462d` | sand-900 | `#293539` | mist-900 |
| `#7d5a39` | sand-800 | `#3e4e54` | mist-800 |
| `#9d7047` | sand-700 | `#536670` | mist-700 |
| `#b95436` | terracotta-700 | `#4d6e7b` | sea-salt-600 |
| `#e9af94` | terracotta-300 | `#c0d3db` | sea-salt-200 |
| `#9a4330` | terracotta-800 | `#3c5764` | sea-salt-700 |
| `#d16943` | terracotta-500 | `#7a98a5` | sea-salt-400 |
| `#dd8865` | terracotta-400 | `#97AFB9` | sea-salt-300 |
| `#b88a5e` | terracotta-300 | `#7a98a5` | sea-salt-400 |

Also update Tailwind `@apply` references:
- `bg-sand-50 text-sand-900` (body) → `bg-mist-50 text-mist-900`
- `bg-terracotta-500` (btn-primary) → `bg-sea-salt-400`
- `bg-sage-500` (btn-secondary) → `bg-alpine-sage-400`

### 3. `components/Header.tsx`
- `bg-white` header → `bg-mist-50`
- `text-terracotta-600` (site title) → `text-sea-salt-600`
- `hover:text-terracotta-*` → `hover:text-sea-salt-*`
- `text-sand-700` (nav links) → `text-mist-700`

### 4. `components/Footer.tsx`
- `bg-sage-800` → `bg-alpine-sage-800`
- `text-sand-50/200/300` → `text-mist-50/200/300`
- `hover:text-terracotta-300` → `hover:text-sea-salt-300`
- `border-sage-700` → `border-alpine-sage-700`

### 5. `components/PostCard.tsx`
- `bg-terracotta-500` (featured category badge) → `bg-sea-salt-400`
- `group-hover:text-terracotta-200` → `group-hover:text-sea-salt-200`
- `bg-sand-200 text-sand-700` (regular category pill) → `bg-mist-200 text-mist-700`
- `text-sand-900` (post title) → `text-mist-900`
- `group-hover:text-terracotta-600` → `group-hover:text-sea-salt-600`
- `text-sand-600` (excerpt) → `text-mist-700`
- `text-sand-500` (date) → `text-mist-500`
- `text-terracotta-600` (Read More) → `text-sea-salt-600`

### 6. `components/Gallery.tsx`
- `hover:text-sand-300` (close button hover) → `hover:text-mist-300`

### 7. `app/page.tsx`
- `from-sand-100 to-white` (hero gradient) → `from-mist-100 to-white`
- `text-sand-900` (hero title, section headings) → `text-mist-900`
- `text-sand-600` (hero subtitle) → `text-mist-700`
- `bg-terracotta-500` (CTA section) → `bg-sea-salt-400`
- `text-terracotta-50` (CTA text) → `text-mist-50`
- `text-terracotta-600` (CTA button text) → `text-sea-salt-700`
- `hover:bg-sand-50` → `hover:bg-mist-50`

### 8. `app/about/page.tsx`
- `text-sand-900` → `text-mist-900`
- `border-sand-200` → `border-mist-200`
- `bg-sand-600 hover:bg-sand-700` (email button) → `bg-mist-600 hover:bg-mist-700`

### 9. `app/category/[category]/page.tsx`
- `text-sand-900` → `text-mist-900`
- `text-sand-600` → `text-mist-700`

### 10. `app/posts/[slug]/page.tsx`
- `from-sand-900/60` (hero overlay gradient) → `from-mist-900/60`
- `bg-terracotta-500/600` (category badge) → `bg-sea-salt-400`
- `text-sand-900` (post title) → `text-mist-900`
- `text-sand-600` (date row) → `text-mist-700`
- `border-sand-200` → `border-mist-200`
- `bg-sand-200 text-sand-700` (tags) → `bg-mist-200 text-mist-700`

---

## What "done" looks like
- The site renders with a soft gray-blue-green palette instead of warm sand/terracotta
- Body text remains dark and legible (#293539 on light mist backgrounds)
- No layout, spacing, font, or structural changes — only colors
- All interactive hover/focus states updated to the new palette
- `npm run dev` runs with no errors and the site visually matches the new palette

---

## What will NOT change
- Layout, spacing, typography, fonts
- Component structure or HTML
- CMS configuration or content files
- Netlify/deployment config
