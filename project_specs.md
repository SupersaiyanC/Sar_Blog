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
`https://flourandflaneuse.com/feed.xml`

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

## Accented Slug Fix (2026-03-26)

### Summary

Fixes a build-breaking bug where posts with accented characters in their title (e.g. "Pâtisserie") generated filenames with non-ASCII characters. The `getPostBySlug()` validation regex only allowed `[a-z0-9-]`, causing it to throw on those slugs and crash the entire Netlify build.

**Affected post:** `2026-03-26-ferrandi-pâtesserie-diaries-part-2-tarte-aux-fraises.md`

### Code changes

- `lib/posts.ts` — Added `normalizeSlug()` helper (strips diacritics via Unicode NFD normalization). `getAllPosts()` now uses normalized slugs; `getPostBySlug()` now scans the directory to find the file whose normalized slug matches, instead of assuming `${slug}.md` is the filename.
- `public/admin/config.yml` — Added `slug: encoding: "ascii" / clean_accents: true` to prevent the CMS from generating accented filenames going forward.

---

## Local Newsletter Sending Tool (2026-03-28)

### Summary

A standalone `newsletter-tool.html` file (open directly in any browser, no server needed) for manually sending newsletter emails via Brevo. Fetches posts from the live RSS feed, renders a full email preview, and fires to a Brevo list via the campaigns API.

### How it works

1. On load, fetches `https://flourandflaneuse.com/feed.xml` via a CORS proxy (allorigins.win) and lists all posts in the sidebar.
2. Clicking a post renders a full email preview (in an isolated iframe) matching the blog aesthetic — cream background, emblem, Playfair Display headings, terracotta CTA button.
3. The subject line is pre-filled and editable.
4. "Send to List" → confirmation dialog → `POST /v3/emailCampaigns` → `POST /v3/emailCampaigns/{id}/sendNow`.

### Settings (saved in browser localStorage)

- `BREVO_API_KEY` — paste from Brevo dashboard → Account → API Keys
- `BREVO_LIST_ID` — 2 (from existing newsletter setup)
- Sender name / sender email (must be a verified sender in Brevo)

### File

- `newsletter-tool.html` — root of repo (not deployed; gitignored if desired)

### Notes

- The unsubscribe link is injected by Brevo via the `{unsubscribeLink}` variable in the campaign HTML (Brevo's single-brace syntax, not Mustache triple-braces).
- The tool does NOT use Node or any build step — just double-click the file.

---

## Open Graph & SEO Meta Tags (2026-04-08)

### OG — What this change does

Adds full Open Graph and Twitter Card meta tags to all pages so Google, iMessage, WhatsApp, Twitter, and Facebook render rich previews (title, description, image) when any link is shared.

### OG — Key detail: absolute image URLs

Social platforms require image URLs to start with `https://`. Decap CMS stores images as relative paths like `/uploads/image.jpg`. The fix: in `generateMetadata`, prepend `https://flourandflaneuse.com` if the path isn't already absolute. The layout also sets `metadataBase: new URL('https://flourandflaneuse.com')` as a Next.js-level fallback.

### OG — Files changed

- `app/layout.tsx` — Added `metadataBase`, `openGraph.siteName`, and `twitter.card` defaults so all pages inherit them
- `app/posts/[slug]/page.tsx` — Expanded `generateMetadata` to include `og:title`, `og:description`, `og:image` (absolute), `og:url`, `og:type: article`, `twitter:card`
- `app/page.tsx` — Added `generateMetadata` with site title/description and `/emblem.png` as fallback OG image
- `app/about/page.tsx` — Added `generateMetadata`; uses `aboutPageImage` if set, otherwise falls back to `/emblem.png`
- `app/category/[category]/page.tsx` — Expanded `generateMetadata` with OG/Twitter tags; uses `/emblem.png` as image

### OG — What will NOT change

- Layout, spacing, typography, fonts
- Component structure or HTML
- CMS configuration or content files
- Netlify/deployment config

---

## Recipe Cards, Jump-to-Recipe, Likes & Comments (2026-06-13)

### What this change does

Adds food-blog features so the site behaves like a real recipe blog: structured Recipe Cards (with Google rich-result markup), a "Jump to Recipe" button, a "Love this" likes button, and a comments/notes section on every post — plus a private page for Rayaan to moderate comments.

### Recipe Cards (opt-in per post)

- New CMS fields on every post: **"This post has a recipe"** toggle (`isRecipe`) and a collapsible **"Recipe Details"** section (`recipe`: prep time, cook time, servings, ingredients list, instructions list). Both optional — existing posts are unaffected until Sarita fills them in.
- When `isRecipe` is on and recipe details are filled in:
  - A **"Jump to Recipe ↓"** pill button appears near the top of the post, scrolling to...
  - A styled **Recipe Card** (`components/RecipeCard.tsx`) rendered after the post body, with prep/cook time + servings badges, an ingredients list, and numbered instructions (`id="recipe"`).
  - A `Recipe` JSON-LD `<script>` tag is added to the page (`app/posts/[slug]/page.tsx`) so Google can show recipe rich results — includes ingredients, instructions, prep/cook/total time (converted from friendly strings like "20 mins" to ISO-8601 via `parseDurationToMinutes`/`minutesToISO8601` in `lib/posts.ts`).

### Likes ("Love this")

- `components/LikeButton.tsx` — heart button + count on every post, near the date. One like per browser via `localStorage`.
- `netlify/functions/likes.js` — stores per-post counts in **Netlify Blobs** (store `likes`). `GET /api/likes?slug=` reads, `POST /api/likes` increments.
- `lib/likes.ts` — `getLikeCount(slug)` reads the count at build time (falls back to 0 if Blobs isn't reachable, e.g. local `npm run build`).
- **Likes on Google**: for recipe posts with ≥1 like, the JSON-LD includes `aggregateRating` (5-star, `ratingCount` = like count) — this is the closest real equivalent to "likes" that Google's recipe rich results support. The count reflects the like total as of the last publish/deploy, not live.

### Comments / Notes

- `components/Comments.tsx` — name + message form (no account needed) plus the list of existing comments, shown on every post above the "More posts" link. Includes a hidden honeypot field and length limits (name ≤60 chars, message ≤1000 chars) for basic spam protection.
- `netlify/functions/comments.js` — stores comments per post slug in **Netlify Blobs** (store `comments`). Public `GET`/`POST`; `DELETE` and admin replies require a logged-in Netlify Identity user.

### Comment moderation

- New private page **`/manage-comments`** (`app/manage-comments/page.tsx` + `components/ManageComments.tsx`), linked from the footer. Logs in with the same Netlify Identity account used for `/admin`. Lists every post's comments, with **Delete** and **Reply** (posted as an "Author reply" badge) for each.

### New dependency

- `@netlify/blobs` — added to `package.json` for the likes/comments storage.

### Local testing note

Likes and comments are Netlify Functions, so they only work under `netlify dev` (port 8888), same as the existing newsletter subscribe function — they will not work under plain `npm run dev`.

### What will NOT change

- Layout, spacing, typography, fonts elsewhere on the site
- Existing posts (recipe fields are opt-in and default to empty)
- Editorial workflow / deploy-credit behavior
