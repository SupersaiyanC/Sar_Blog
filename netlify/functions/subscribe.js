// Netlify serverless function — POST /api/subscribe
// Adds an email address to the Brevo contact list.
// Env vars required: BREVO_API_KEY, BREVO_LIST_ID

exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
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

  let email;
  try {
    ({ email } = JSON.parse(event.body || '{}'));
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid request' }) };
  }

  if (!email || !email.includes('@') || !email.includes('.')) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Please enter a valid email address' }) };
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
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
    // in that list — treat it as success so the user isn't confused
    if (body.code === 'duplicate_parameter') {
      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }

    console.error('Brevo API error:', body);
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: body.message || 'Subscription failed. Please try again.' }),
    };
  } catch (err) {
    console.error('Subscribe function error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Something went wrong. Please try again.' }),
    };
  }
};
