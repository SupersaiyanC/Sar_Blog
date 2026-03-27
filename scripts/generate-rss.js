// Generates public/feed.xml at build time.
// Run via: node scripts/generate-rss.js  (called automatically by npm run prebuild)
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const SITE_URL = 'https://flourandflaneuse.com';
const postsDir = path.join(process.cwd(), 'content/posts');
const settingsPath = path.join(process.cwd(), 'content/settings/general.json');
const outputPath = path.join(process.cwd(), 'public/feed.xml');

function escapeXml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function normalizeSlug(fileName) {
  return fileName
    .replace(/\.md$/, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip combining diacritical marks
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')    // replace remaining non-ASCII with hyphens
    .replace(/-+/g, '-')             // collapse consecutive hyphens
    .replace(/^-|-$/g, '');          // trim leading/trailing hyphens
}

function getAllPosts() {
  if (!fs.existsSync(postsDir)) return [];
  return fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith('.md'))
    .map((fileName) => {
      const slug = normalizeSlug(fileName);
      const { data } = matter(fs.readFileSync(path.join(postsDir, fileName), 'utf8'));
      return { slug, ...data };
    })
    .filter((p) => p.date)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

const settings = fs.existsSync(settingsPath)
  ? JSON.parse(fs.readFileSync(settingsPath, 'utf8'))
  : { title: 'Wanderlust & Whisk', description: 'A travel and lifestyle blog' };

const posts = getAllPosts();

const items = posts
  .slice(0, 20)
  .map(
    (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/posts/${post.slug}/</link>
      <description>${escapeXml(post.excerpt || '')}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <guid isPermaLink="true">${SITE_URL}/posts/${post.slug}/</guid>
      ${post.featuredImage ? `<enclosure url="${SITE_URL}${post.featuredImage}" type="image/jpeg" length="0" />` : ''}
      ${post.category ? `<category>${escapeXml(post.category)}</category>` : ''}
    </item>`
  )
  .join('');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${escapeXml(settings.title)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(settings.description)}</description>
    <language>en-us</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

fs.writeFileSync(outputPath, xml.trim());
console.log(`✓ RSS feed generated → public/feed.xml (${posts.length} posts)`);
