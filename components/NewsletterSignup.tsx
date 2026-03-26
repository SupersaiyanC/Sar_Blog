'use client';

import { useState } from 'react';

interface Props {
  /** compact = footer variant (dark background, single row) */
  compact?: boolean;
}

export default function NewsletterSignup({ compact = false }: Props) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
        setErrorMsg(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again.');
    }
  }

  // ── Compact variant (inside the dark footer) ───────────────────────────────
  if (compact) {
    return (
      <div className="text-center">
        <p className="text-mist-300 text-sm mb-3 font-medium">
          Get new posts straight to your inbox
        </p>
        {status === 'success' ? (
          <p className="text-sea-salt-300 text-sm">
            You&apos;re subscribed — welcome along for the journey!
          </p>
        ) : (
          <>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-2 justify-center max-w-sm mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 px-4 py-2 rounded-full text-sm bg-alpine-sage-700 text-mist-100 placeholder-mist-400 border border-alpine-sage-600 focus:outline-none focus:border-sea-salt-400 transition-colors"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-5 py-2 rounded-full text-sm bg-sea-salt-400 text-white hover:bg-sea-salt-500 transition-colors disabled:opacity-60 font-medium shrink-0"
              >
                {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
              </button>
            </form>
            {status === 'error' && (
              <p className="text-red-300 text-xs mt-2">{errorMsg}</p>
            )}
          </>
        )}
      </div>
    );
  }

  // ── Full section variant (homepage, cream background) ─────────────────────
  return (
    <section className="bg-cream py-16 md:py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-sea-salt-500 text-sm font-medium uppercase tracking-widest mb-3 block">
          Newsletter
        </span>
        <h2 className="text-3xl md:text-4xl font-serif text-mist-900 mb-3">
          Get new posts in your inbox
        </h2>
        <p className="text-mist-600 mb-8 text-base">
          No spam — only new posts, delivered straight to you. Unsubscribe any time.
        </p>

        {status === 'success' ? (
          <div className="py-4">
            <p className="text-sea-salt-600 text-lg font-medium">
              You&apos;re subscribed — welcome along for the journey!
            </p>
            <p className="text-mist-500 text-sm mt-1">
              You&apos;ll get an email the next time a new post goes live.
            </p>
          </div>
        ) : (
          <>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 max-w-xs px-5 py-3 rounded-full text-mist-900 bg-white border border-mist-200 focus:outline-none focus:border-sea-salt-400 focus:ring-2 focus:ring-sea-salt-100 placeholder-mist-400 text-sm transition-colors"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-7 py-3 rounded-full bg-sea-salt-400 text-white font-medium hover:bg-sea-salt-500 transition-colors disabled:opacity-60 text-sm shadow-sm shrink-0"
              >
                {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
              </button>
            </form>
            {status === 'error' && (
              <p className="text-red-500 text-sm mt-3">{errorMsg}</p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
