// Netlify serverless function — POST /api/subscribe
// Adds an email address to the Brevo contact list.
// Env vars required: BREVO_API_KEY, BREVO_LIST_ID

// Loose but effective RFC 5322-compatible email regex
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;

exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    // Restrict to the live domain only — no cross-site submissions
    'Access-Control-Allow-Origin': 'https://flourandflaneuse.com',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const { BREVO_API_KEY, BREVO_LIST_ID } = process.env;

  if (!BREVO_API_KEY || !BREVO_LIST_ID) {
    console.error('Missing BREVO_API_KEY or BREVO_LIST_ID env vars');
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Server configuration error' }),
    };
  }

  let rawEmail;
  try {
    ({ email: rawEmail } = JSON.parse(event.body || '{}'));
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid request' }) };
  }

  const email = typeof rawEmail === 'string' ? rawEmail.toLowerCase().trim() : '';

  if (!email || email.length > 320 || !EMAIL_RE.test(email)) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Please enter a valid email address' }),
    };
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      body: JSON.stringify({
        email,
        listIds: [parseInt(BREVO_LIST_ID, 10)],
        updateEnabled: true, // update if contact already exists
      }),
    });

    // 201 = created, 204 = already existed and updated
    if (response.status === 201 || response.status === 204) {
      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }

    const body = await response.json();

    // Brevo returns 400 with code "duplicate_parameter" when contact already exists
    // in that list — treat as success so the user isn't confused
    if (body.code === 'duplicate_parameter') {
      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }

    console.error('Brevo API error:', body.code, body.message);
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Subscription failed. Please try again.' }),
    };
  } catch (err) {
    console.error('Subscribe function error:', err instanceof Error ? err.message : err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Something went wrong. Please try again.' }),
    };
  }
};
