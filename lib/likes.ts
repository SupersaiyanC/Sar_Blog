import { getStore } from '@netlify/blobs';

// Reads the current like count for a post at build time, for use in Recipe
// JSON-LD (aggregateRating). Falls back to 0 if Blobs isn't reachable (e.g.
// a local `npm run build` without Netlify's environment), so the build never
// fails because of this.
export async function getLikeCount(slug: string): Promise<number> {
  try {
    const store = getStore('likes');
    const data = await store.get(slug, { type: 'json' });
    return (data as { count?: number } | null)?.count ?? 0;
  } catch {
    return 0;
  }
}
