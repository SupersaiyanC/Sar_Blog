// Netlify serverless function — GET/POST/DELETE /api/comments
// Stores comments per post slug in Netlify Blobs.
//
// - GET  ?slug=xxx        -> public, returns that post's comments
// - GET  (no slug)        -> admin only, returns all posts' comments
// - POST { slug, name, message, website } -> public, adds a comment
//        { slug, name, message, isAdminReply: true } -> admin only, adds a reply
// - DELETE { slug, commentId } -> admin only, removes a comment

const { getStore } = require('@netlify/blobs');
const { randomUUID } = require('crypto');

const SLUG_RE = /^[a-z0-9-]+$/;
const MAX_NAME_LENGTH = 60;
const MAX_MESSAGE_LENGTH = 1000;

function isAdmin(context) {
  return Boolean(context.clientContext && context.clientContext.user);
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Emails Sarita via Brevo (reusing the newsletter API key) whenever a visitor
// leaves a new comment, so she doesn't have to keep checking /manage-comments.
async function sendCommentNotification(slug, comment) {
  const { BREVO_API_KEY, BREVO_SENDER_NAME, BREVO_SENDER_EMAIL, COMMENT_NOTIFY_EMAIL } = process.env;

  if (!BREVO_API_KEY || !BREVO_SENDER_EMAIL || !COMMENT_NOTIFY_EMAIL) {
    console.error('Skipping comment notification — missing Brevo/notification env vars');
    return;
  }

  try {
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: BREVO_SENDER_NAME || 'Flour & Flaneuse', email: BREVO_SENDER_EMAIL },
        to: [{ email: COMMENT_NOTIFY_EMAIL }],
        subject: `New comment from ${comment.name}`,
        htmlContent: `
          <p><strong>${escapeHtml(comment.name)}</strong> left a new comment on
          <a href="https://flourandflaneuse.com/posts/${slug}/">${slug}</a>:</p>
          <blockquote style="margin:0;padding:12px;background:#f4f6f7;border-radius:8px;">${escapeHtml(comment.message)}</blockquote>
          <p><a href="https://flourandflaneuse.com/manage-comments/">Reply or delete this comment</a></p>
        `,
      }),
    });
  } catch (err) {
    console.error('Comment notification email failed:', err instanceof Error ? err.message : err);
  }
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

  try {
    return await handleRequest(event, context, headers);
  } catch (err) {
    console.error('comments function error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }),
    };
  }
};

async function handleRequest(event, context, headers) {
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
      id: randomUUID(),
      name: trimmedName,
      message: trimmedMessage,
      date: new Date().toISOString(),
      isAdmin: Boolean(isAdminReply),
    };
    comments.push(comment);
    await store.setJSON(slug, comments);

    if (!isAdminReply) {
      await sendCommentNotification(slug, comment);
    }

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
}
