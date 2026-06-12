// Netlify serverless function — GET/POST /api/likes
// Stores a like count per post slug in Netlify Blobs.

const { connectLambda, getStore } = require('@netlify/blobs');

const SLUG_RE = /^[a-z0-9-]+$/;

exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'https://flourandflaneuse.com',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  try {
    connectLambda(event);
    const store = getStore('likes');

    if (event.httpMethod === 'GET') {
      const slug = event.queryStringParameters?.slug || '';

      if (!SLUG_RE.test(slug)) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid slug' }) };
      }

      const data = await store.get(slug, { type: 'json' });
      return { statusCode: 200, headers, body: JSON.stringify({ count: data?.count ?? 0 }) };
    }

    if (event.httpMethod === 'POST') {
      let slug;
      try {
        ({ slug } = JSON.parse(event.body || '{}'));
      } catch {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid request' }) };
      }

      if (typeof slug !== 'string' || !SLUG_RE.test(slug)) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid slug' }) };
      }

      const data = await store.get(slug, { type: 'json' });
      const count = (data?.count ?? 0) + 1;
      await store.setJSON(slug, { count });

      return { statusCode: 200, headers, body: JSON.stringify({ count }) };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  } catch (err) {
    console.error('likes function error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }),
    };
  }
};
