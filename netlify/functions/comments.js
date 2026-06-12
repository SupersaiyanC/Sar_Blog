// Netlify serverless function — GET/POST/DELETE /api/comments
// Stores comments per post slug in Netlify Blobs.
//
// - GET  ?slug=xxx        -> public, returns that post's comments
// - GET  (no slug)        -> admin only, returns all posts' comments
// - POST { slug, name, message, website } -> public, adds a comment
//        { slug, name, message, isAdminReply: true } -> admin only, adds a reply
// - DELETE { slug, commentId } -> admin only, removes a comment

const { getStore } = require('@netlify/blobs');

const SLUG_RE = /^[a-z0-9-]+$/;
const MAX_NAME_LENGTH = 60;
const MAX_MESSAGE_LENGTH = 1000;

function isAdmin(context) {
  return Boolean(context.clientContext && context.clientContext.user);
}

exports.handler = async (event, context) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'https://flourandflaneuse.com',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  const store = getStore('comments');

  if (event.httpMethod === 'GET') {
    const slug = event.queryStringParameters?.slug || '';

    if (slug) {
      if (!SLUG_RE.test(slug)) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid slug' }) };
      }
      const comments = (await store.get(slug, { type: 'json' })) || [];
      return { statusCode: 200, headers, body: JSON.stringify({ comments }) };
    }

    // No slug — admin-only view of every post's comments
    if (!isAdmin(context)) {
      return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
    }

    const { blobs } = await store.list();
    const all = {};
    for (const { key } of blobs) {
      all[key] = (await store.get(key, { type: 'json' })) || [];
    }
    return { statusCode: 200, headers, body: JSON.stringify({ comments: all }) };
  }

  if (event.httpMethod === 'POST') {
    let body;
    try {
      body = JSON.parse(event.body || '{}');
    } catch {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid request' }) };
    }

    const { slug, name, message, website, isAdminReply } = body;

    if (typeof slug !== 'string' || !SLUG_RE.test(slug)) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid slug' }) };
    }

    // Honeypot field — real visitors never fill this in. Silently pretend
    // success so bots don't learn to avoid it.
    if (website) {
      const comments = (await store.get(slug, { type: 'json' })) || [];
      return { statusCode: 200, headers, body: JSON.stringify({ comments }) };
    }

    if (isAdminReply && !isAdmin(context)) {
      return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
    }

    const trimmedName = typeof name === 'string' ? name.trim() : '';
    const trimmedMessage = typeof message === 'string' ? message.trim() : '';

    if (!trimmedName || trimmedName.length > MAX_NAME_LENGTH) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Please enter a valid name' }) };
    }

    if (!trimmedMessage || trimmedMessage.length > MAX_MESSAGE_LENGTH) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Please enter a comment' }) };
    }

    const comments = (await store.get(slug, { type: 'json' })) || [];
    const comment = {
      id: crypto.randomUUID(),
      name: trimmedName,
      message: trimmedMessage,
      date: new Date().toISOString(),
      isAdmin: Boolean(isAdminReply),
    };
    comments.push(comment);
    await store.setJSON(slug, comments);

    return { statusCode: 200, headers, body: JSON.stringify({ comments }) };
  }

  if (event.httpMethod === 'DELETE') {
    if (!isAdmin(context)) {
      return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
    }

    let body;
    try {
      body = JSON.parse(event.body || '{}');
    } catch {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid request' }) };
    }

    const { slug, commentId } = body;

    if (typeof slug !== 'string' || !SLUG_RE.test(slug)) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid slug' }) };
    }

    const comments = (await store.get(slug, { type: 'json' })) || [];
    const filtered = comments.filter((c) => c.id !== commentId);
    await store.setJSON(slug, filtered);

    return { statusCode: 200, headers, body: JSON.stringify({ comments: filtered }) };
  }

  return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
};
